// This defines an implementation of gapi.hangout which communicates with a
// local node.js socket.io server.
// This allows multi-user features of puzzle+ to be tested locally using the
// same JS as in production.

// Methods/Properties of gapi that are used:
// gapi.hangout.data
// gapi.hangout.data.getKeys();
// gapi.hangout.data.getState();
// gapi.hangout.data.getValue();
// gapi.hangout.data.onStateChanged.add();
// gapi.hangout.data.submitDelta();
// gapi.hangout.getParticipantById();
// gapi.hangout.getParticipantId();
// gapi.hangout.onApiReady.add()
// gapi.hangout.data.onEnabledParticipantsChanged.add();
// gapi.hangout.getParticipants();


// TODO(danvk): pull this out into a shared constants.js file.
// Keep this list in sync with hangout/server.js
var EVENTS = {
  WELCOME: 'welcome',
  PARTICIPANTS_CHANGED: 'participantsChanged',
  STATE_CHANGED: 'stateChanged',
  SUBMIT_DELTA: 'submitDelta',
  RESET_STATE: 'resetState',
  SAVED_STATES_CHANGED: 'savedStatesChanged',
  ADD_SAVED_STATE: 'addSavedState'
};


// TODO(danvk): use a jQuery deferred object for this.
var pageHasLoaded = false;
var initFns = [];
document.addEventListener('DOMContentLoaded', function() {
  pageHasLoaded = true;
  for (var i = 0; i < initFns.length; i++) {
    initFns[i]();
  }
});

var gadgets = (function() {
  return {
    util: {
      registerOnLoadHandler: function(fn) {
        if (!pageHasLoaded) {
          initFns.push(fn);
        } else {
          fn();
        }
      }
    }
  }
})();

var gapi = (function() {
  var my_id = null;
  var state = { };
  var users = { };

  var stateChangeFns = [];
  var apiReadyFns = [];
  var userChangeFns = [];

  // converts users from a list to a map.
  var convertUsers = function(users) {
    var users_map = {};
    for (var i = 0; i < users.length; i++) {
      var u = users[i];
      users_map[u.id] = u;
    }
    return users_map;
  };

  return {
    hangout: {
      data: {
        getKeys: function() {
          var keys = [];
          for (var k in state) {
            keys.push(k);
          }
          return keys;
        },

        getState: function() {
          var copy = {};
          for (var k in state) {
            copy[k] = state[k];
          }
          return copy;
        },

        getValue: function(key) {
          return state[key];
        },

        submitDelta: function(delta, keys_to_delete) {
          socket.emit(EVENTS.SUBMIT_DELTA, {
            delta: delta,
            deleteKeys: keys_to_delete
          });
        },

        onStateChanged: {
          add: function(fn) {
            stateChangeFns.push(fn);
          }
        }
      },

      getParticipantId: function() {
        return my_id;
      },

      getParticipantById: function(id) {
        return users[id];
      },

      getParticipants: function(id) {
        var users_list = [];
        for (var k in users) {
          users_list.push(users[k]);
        }
        return users_list;
      },

      onApiReady: {
        add: function(fn) {
          apiReadyFns.push(fn);
        }
      },

      onEnabledParticipantsChanged: {
        add: function(fn) {
          userChangeFns.push(fn);
        }
      }
    },

    _apiIsReady: function(id, init_users, init_state) {
      my_id = id;
      users = convertUsers(init_users);
      state = init_state;

      var obj = {
        isApiReady: true
      };

      // Give other onload event handlers a change to run and possibly register
      // their own apiReadyFns.
      setTimeout(function() {
        for (var i = 0; i < apiReadyFns.length; i++) {
          apiReadyFns[i](obj);
        }
      }, 100);
    },

    _changeState: function(new_state) {
      state = new_state;
      for (var i = 0; i < stateChangeFns.length; i++) {
        stateChangeFns[i]();
      }
    },

    _changeUsers: function(new_users) {
      users = convertUsers(new_users);
      for (var i = 0; i < userChangeFns.length; i++) {
        userChangeFns[i]();
      }
    },
  }
})();

if (typeof(GAPI_SERVER) == 'undefined') {
  // This is typically localhost:8080, but might not be if you share the link
  // with someone else on your intranet.
  var loc = window.location;
  GAPI_SERVER = loc.protocol + '//' + loc.host;
}
var socket = io.connect(GAPI_SERVER);

var lonelySavedStates = {};

socket.on(EVENTS.WELCOME, function(data) {
  gapi._apiIsReady(data.id, data.users, data.state);
  lonelySavedStates = data.savedStates;
});

socket.on(EVENTS.PARTICIPANTS_CHANGED, function(data) {
  gapi._changeUsers(data.users);
});

socket.on(EVENTS.STATE_CHANGED, function(data) {
  gapi._changeState(data.state);
});

socket.on(EVENTS.SAVED_STATES_CHANGED, function(data) {
  lonelySavedStates = data.savedStates;
  if (typeof(savedStatesUpdateCallback) !== 'undefined') {
    // hack!
    savedStatesUpdateCallback(lonelySavedStates);
  }
});

function lonelyResetState(state) {
  // This will trigger a state update.
  var d = {};
  if (state) d.state = state;
  socket.emit(EVENTS.RESET_STATE, d);
}

function lonelySaveState(name, state) {
  socket.emit(EVENTS.ADD_SAVED_STATE, {
    name: name,
    state: state
  });
}
