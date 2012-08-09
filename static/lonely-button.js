// This adds the "Lonely Hangouts" button in the top left.

document.addEventListener("DOMContentLoaded", function() {
  var div = document.createElement("div");
  div.id = "lonely-button";
  div.innerHTML = ':(';

  var toggle = function(e) {
    if (panel.style.display == 'none') {
      panel.style.display = 'block';
    } else {
      panel.style.display = 'none';
    }
  };

  var panel = document.createElement("div");
  panel.id = "lonely-panel";
  var html = "<b>Lonely Hangouts</b><br/><br/>";
  if (typeof(GAPI_SERVER) != 'undefined') {
    // Running the socket.io (i.e. multiplayer) API.
    html += "Restore:<br/>" +
    "<ul id=lonely-states></ul><br/>" +
    "<button id=lonely-save>Save State</button><br/><br/>";
  }

  html += "<button id=lonely-reset>Reset State</button>";
  panel.innerHTML = html;
  panel.style.display = 'none';

  document.body.appendChild(div);
  document.body.appendChild(panel);

  div.onclick = toggle;
  panel.onclick = toggle;

  document.getElementById("lonely-reset").onclick = function(e) {
    lonelyResetState();
    panel.style.display = 'none';
    e.stopPropagation();
  };

  if (document.getElementById("lonely-save")) {
    document.getElementById("lonely-save").onclick = function(e) {
      e.stopPropagation();
      var state = gapi.hangout.data.getState();
      var name = prompt('Enter a name for the new saved state:');
      if (name) {
        lonelySaveState(name, state);
        // update will eventually come back to us.
      }
    };
  }

  savedStatesUpdateCallback = function(savedStates) {
    var names = [];
    for (var k in savedStates) {
      names.push(k);
    }
    names.sort();

    var html = '';
    for (var i = 0; i < names.length; i++) {
      html += '<li><a href=#>' + names[i] + '</a>';
    }
    document.getElementById("lonely-states").innerHTML = html;

    var as = document.getElementById("lonely-states").getElementsByTagName("a");

    var click = function(e) {
      e.stopPropagation();
      var name = e.target.innerHTML;
      lonelyResetState(lonelySavedStates[name]);
    };

    for (var i = 0; i < as.length; i++) {
      var a = as[i];
      a.onclick = click;
    }
  };

  // Initialize the list of saved states once it's available.
  gadgets.util.registerOnLoadHandler(function() {
    gapi.hangout.onApiReady.add(function() {
      if (typeof(lonelySavedStates) !== 'undefined') {
        savedStatesUpdateCallback(lonelySavedStates);
      }
    });
  });
});
