// Contact: carry what was picked on the homepage, and the Where to start answer, into the enquiry.

export default function contact() {
  var form = document.querySelector('form[name="contact"]');
  if (!form) return;
  var picks = [], start = "";
  try {
    picks = JSON.parse(sessionStorage.getItem("154:picked") || "[]");
    start = sessionStorage.getItem("154:start") || "";
  } catch (e) {}
  if (!picks.length && !start) return;

  var esc = function(t){ return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;"); };
  var box = document.getElementById("picked"), items = document.getElementById("pickedItems");
  box.hidden = false;
  items.innerHTML = picks.map(function(c){ return '<button type="button">' + esc(c.label) + '</button>'; }).join("");
  if (start) {
    var p = document.createElement("p");
    p.className = "tiny";
    p.textContent = "Where to start: " + start;
    box.appendChild(p);
  }
  document.getElementById("fPicked").value = picks.map(function(c){ return c.label; }).join(", ");
  document.getElementById("fStart").value = start;
}
