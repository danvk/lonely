gadgets.util.registerOnLoadHandler(function() {
  gapi.hangout.onApiReady.add(
    function(eventObj) {
      if (eventObj.isApiReady) {
        realInit();
      }
    }
  );
});

function realInit() {
  gapi.hangout.data.onStateChanged.add(stateUpdated);
  gapi.hangout.onEnabledParticipantsChanged.add(usersChanged);

  document.getElementById("submit").onclick = function() {
    var k = document.getElementById("key").value;
    var v = document.getElementById("value").value;
    d = {};
    d[k] = v;
    gapi.hangout.data.submitDelta(d);
  };

  stateUpdated();  // initialize state
  usersChanged();
}

function stateUpdated() {
  var keys = gapi.hangout.data.getKeys();
  keys.sort();
  var state = gapi.hangout.data.getState();

  var html = '';
  for (var i = 0; i < keys.length; i++) {
    html += '<li>' + keys[i] + ': ' + state[keys[i]] + '</li>\n';
  }
  document.getElementById('state').innerHTML = html;
}

function usersChanged() {
  var users = gapi.hangout.getParticipants();
  var html = '';
  for (var i = 0; i < users.length; i++) {
    var u = users[i];
    var p = u.person;
    var line = '';
    line += '<img src="' + p.image.url + '" />';
    line += ' ' + u.id + ': ' + p.displayName;
    if (!users[i].hasAppEnabled) line = '<strike>' + line + '</strike>';

    html += '<li>' + line + '</li>\n';
  }

  document.getElementById('participants').innerHTML = html;

  var me = gapi.hangout.getParticipantById(gapi.hangout.getParticipantId());
  document.getElementById('you').innerHTML = me.person.displayName;
}
