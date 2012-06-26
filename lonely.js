// Lonely Hangouts - Local testing for the Google+ Hangouts API.
//
// Usage:
//   $ node lonely.js [--single] path/to/your/app.xml
//
// Once the server is running, visit http://localhost:8080/ to test your app.
//
// Events which this server emits:
// - welcome: { id: your_id#, users: [], state: {} }
// - participantsChanged: { users: [ { user: username, id: id# }, ... ] }
// - stateChanged: { state: { global state object } }
//
// Events which this server understands:
// - submitDelta: { delta: { k1: v1, k2: v2, ... }, deleteKeys: [ ... ] }

// Still to do:
// - Inline user PNGs

var EVENTS = {
  WELCOME: 'welcome',
  PARTICIPANTS_CHANGED: 'participantsChanged',
  STATE_CHANGED: 'stateChanged',
  SUBMIT_DELTA: 'submitDelta',
  RESET_STATE: 'resetState',
  SAVED_STATES_CHANGED: 'savedStatesChanged',
  ADD_SAVED_STATE: 'addSavedState'
};

var express = require('express'),
    io      = require('socket.io'),
    assert  = require('assert'),
    fs      = require('fs'),
    path    = require('path'),
    program = require('commander');

var readXml = require('./lib/read-xml.js');

program
  .version(0.1)
  .option('-s, --single', 'Run in singleplayer mode (for easier testing).')
  .parse(process.argv);

assert.equal(1, program.args.length,
    'Usage: node ' + process.argv[1] + ' path/to/hangout.xml');

xml_file = program.args[0];
states_file = path.basename(xml_file) + '.states.json';

var app = express.createServer();
var io = io.listen(app);

app.configure(function() {
  app.use(express.static(__dirname + '/..'));
});

// Base XML file.
app.get('/', function(req, res) {
  fs.readFile(xml_file, function(err, data) {
    assert.ifError(err);

    readXml.parseHangoutXml(data, function(err, hangout_data) {
      assert.ifError(err);

      res.header('Cache-Control', 'no-cache');
      res.contentType('text/html');
      res.send(readXml.createFakeHtml(hangout_data, program.single));
    });
  });
});

function addStaticJsFile(app, server_path, filename) {
  app.get(server_path, function(req, res) {
    fs.readFile(filename, function(e, data) {
      assert.ifError(e);
      res.header('Cache-Control', 'no-cache');
      res.contentType(filename);
      res.send(data);
    });
  });
}

// Server-defined static files.
var statics = [
  'fake-api.js',
  'fake-socket-api.js',
  'xsocket.io.min.js',
  'lonely-button.js',
  'lonely-button.css'
];
for (var i = 0; i < statics.length; i++) {
  var f = statics[i];
  addStaticJsFile(app, '/' + f, __dirname + '/static/' + f);
}

// User-defined static files.
app.get(/(.*)/, function(req, res) {
  var req_path = req.params[0];
  assert.equal('/', req_path[0]);
  var file_path = path.join(process.cwd(), req_path.substr(1));
  console.log(req_path + ' -> ' + file_path);
  fs.readFile(file_path, function(e, data) {
    if (e) {
     res.send(404);
     return;
    }

    res.contentType(file_path);  // deduces mime type.
    res.header('Cache-Control', 'no-cache');
    res.send(data);
  });
});


// Fake hangouts API.
var DEFAULT_PHOTO = 'https://lh5.googleusercontent.com/-_om-59NoFH8/AAAAAAAAAAI/AAAAAAAAAAA/0fcwDv4LZ-M/s48-c-k/photo.jpg';
var num_users = 0;
var users = [
  { id: 1234, displayName: 'Dan Vanderkam', image: { url: DEFAULT_PHOTO } },
  { id: 2345, displayName: 'Rocky Gulliver', image: { url: DEFAULT_PHOTO } },
  { id: 3456, displayName: 'Raven Keller', image: { url: DEFAULT_PHOTO } },
  { id: 4567, displayName: 'Kenny Leftin', image: { url: DEFAULT_PHOTO } },
  { id: 5678, displayName: 'Jossie Ivanov', image: { url: DEFAULT_PHOTO } },
  { id: 6789, displayName: 'Alastair Tse', image: { url: DEFAULT_PHOTO } }
  // TODO(danvk): add more
];

// Returns a { id: id#, displayName: "User Name", ... } object
// whose ID is not the same as any of existing_users.
function makeUpUser(existing_users) {
  var ids = {};
  for (var i = 0; i < existing_users.length; i++) {
    ids[existing_users[i].person.id] = true;
  }

  var user = null;
  for (var i = 0; i < users.length; i++) {
    if (ids[users[i].id]) continue;
    user = users[i];
    break;
  }
  assert.ok(user);

  var displayIndex = num_users;
  num_users++;
  return {
    id: 'x' + user.id,  // per-hangout id
    displayIndex: displayIndex,
    hasAppEnabled: true,
    hasMicrophone: false,
    hasCamera: false,
    person: user
  };
}

// This is the unified state object which is synchronized across clients.
var global_state = { };

// Current list of enabled users.
var current_users = [ ];

// Saved States
var saved_states = {};
fs.readFile(states_file, function(e, data) {
  if (e && e.code == 'ENOENT') {
    // file does not exist yet -- and that's totally fine.
    return;
  }
  assert.ifError(e);
  saved_states = JSON.parse(data);
});
function writeSavedStates() {
  var data = JSON.stringify(saved_states);
  fs.writeFile(states_file, data, function(e) {
    assert.ifError(e);
  });
}

io.sockets.on('connection', function(socket) {
  var user = makeUpUser(current_users);
  current_users.push(user);

  // Tell the user who they are and give them the lay of the land.
  socket.emit(EVENTS.WELCOME, {
    id: user.id,
    state: global_state,
    users: current_users,
    savedStates: saved_states
  } );

  // Let everyone else know that someone has joined.
  socket.broadcast.emit(EVENTS.PARTICIPANTS_CHANGED, { users: current_users });

  socket.on('disconnect', function() {
    var idx = current_users.indexOf(user);
    current_users.splice(idx, 1);
    socket.broadcast.emit(EVENTS.PARTICIPANTS_CHANGED, { users: current_users });
  });

  socket.on(EVENTS.SUBMIT_DELTA, function(data) {
    if (data.delta) {
      for (var k in data.delta) {
        global_state[k] = data.delta[k];
      }
    }
    if (data.deleteKeys) {
      for (var i = 0; i < data.deleteKeys.length; i++) {
        delete global_state[data.deleteKeys[i]];
      }
    }

    socket.broadcast.emit(EVENTS.STATE_CHANGED, { state: global_state });
    socket.emit(EVENTS.STATE_CHANGED, { state: global_state });
  });

  // Some user wants to reset the state. Do it and let everyone know.
  socket.on(EVENTS.RESET_STATE, function(data) {
    global_state = data.state || {};
    socket.broadcast.emit(EVENTS.STATE_CHANGED, { state: global_state });
    socket.emit(EVENTS.STATE_CHANGED, { state: global_state });
  });

  // User added a saved state. Save it and let everyone know.
  socket.on(EVENTS.ADD_SAVED_STATE, function(data) {
    saved_states[data.name] = data.state;
    writeSavedStates();
    socket.broadcast.emit(EVENTS.SAVED_STATES_CHANGED, { savedStates: saved_states });
    socket.emit(EVENTS.SAVED_STATES_CHANGED, { savedStates: saved_states });
  });
});


app.listen(8080);
console.log('Listening on http://localhost:8080/');
