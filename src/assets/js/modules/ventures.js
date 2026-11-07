// About: three ventures, all in the page; the tabs only choose which one is showing.

export default function ventures() {
  var tabs = document.getElementById("ventTabs");
  if (!tabs) return;
  var buttons = [].slice.call(tabs.querySelectorAll(".vent__tab"));
  var panels = [].slice.call(document.querySelectorAll(".vent__panel"));
  tabs.setAttribute("role", "tablist");
  function show(i){
    panels.forEach(function(p, n){ p.hidden = n !== i; });
    buttons.forEach(function(b, n){
      b.classList.toggle("is-on", n === i);
      b.setAttribute("aria-selected", String(n === i));
    });
  }
  buttons.forEach(function(b, n){
    b.setAttribute("role", "tab");
    b.setAttribute("aria-controls", "vent-" + n);
  });
  tabs.addEventListener("click", function(e){
    var b = e.target.closest(".vent__tab");
    if (b) show(+b.dataset.v);
  });
  show(0);
}
