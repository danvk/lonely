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
  panel.innerHTML = "<b>Lonely Hangouts</b><br/><br/><button id=lonely-reset>Reset State</button>";
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
});
