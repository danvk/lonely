// This defines a fake, local implementation of gapi.hangout.
// This allows lmnopuz to be tested locally using the same JS as in production.

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
  var state = {};
  var users = {
    '123ABC': {
      hasAppEnabled: true,
      id: '123ABC',
      person: {
        id: '4567890123',
        displayName: 'John Doe',
        image: {
          url: 'https://lh5.googleusercontent.com/-_om-59NoFH8/AAAAAAAAAAI/AAAAAAAAAAA/0fcwDv4LZ-M/s48-c-k/photo.jpg'
        }
      }
    }
  };
  var stateChangeFns = [];
  var apiReadyFns = [];

  gadgets.util.registerOnLoadHandler(function() {
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
  });

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
          for (var k in delta) {
            state[k] = delta[k];
          }
          if (keys_to_delete) {
            for (var i = 0; i < keys_to_delete.length; i++) {
              delete state[keys_to_delete[i]];
            }
          }
          for (var i = 0; i < stateChangeFns.length; i++) {
            stateChangeFns[i]();
          }
        },

        onStateChanged: {
          add: function(fn) {
            stateChangeFns.push(fn);
          }
        }
      },

      getParticipantId: function() {
        return '123ABC';
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
          // ...
        }
      }
    }
  }
})();
