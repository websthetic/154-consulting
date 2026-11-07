// Services: pull a layer out of the stack and see what rests on it.

export default function stack() {
  var stack3 = document.getElementById("stack3");
  if (!stack3) return;
  var ORDER3 = ["growth","web","brand"];   // dependents: pulling one destabilises everything after it

  function closeStack(){
    stack3.classList.remove("is-pulled");
    stack3.querySelectorAll(".slab").forEach(function(s){
      s.classList.remove("is-open","tilt1","tilt2");
      s.querySelector(".slab__copy").hidden = true;
      var b = s.querySelector(".slab__pull");
      b.textContent = "Take it out";
      b.setAttribute("aria-expanded", "false");
    });
  }
  function openSlab(p){
    closeStack();
    stack3.classList.add("is-pulled");
    var slab = stack3.querySelector('.slab[data-p="' + p + '"]');
    slab.classList.add("is-open");
    slab.querySelector(".slab__copy").hidden = false;
    var b = slab.querySelector(".slab__pull");
    b.textContent = "Put it back";
    b.setAttribute("aria-expanded", "true");
    var above = ORDER3.slice(0, ORDER3.indexOf(p));   // the layers that rest on this one
    if (above.length){
      var first = stack3.querySelector('.slab[data-p="' + above[above.length - 1] + '"]');
      if (first) first.classList.add("tilt1");
      if (above.length > 1){
        var second = stack3.querySelector('.slab[data-p="' + above[0] + '"]');
        if (second) second.classList.add("tilt2");
      }
    }
  }
  stack3.addEventListener("click", function(e){
    var btn = e.target.closest(".slab__pull");
    if (!btn) return;
    e.stopPropagation();   // the slab itself is a link to the pillar page
    var slab = btn.closest(".slab");
    if (slab.classList.contains("is-open")) closeStack(); else openSlab(slab.dataset.p);
  });
}
