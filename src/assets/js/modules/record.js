// About: the founder's record, counted up once it is on screen.

export default function record() {
  var RM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var rec = document.getElementById("record"), done = false;
  if (!rec) return;
  new IntersectionObserver(function(en){
    en.forEach(function(x){
      if (!x.isIntersecting || done) return;
      done = true;
      rec.querySelectorAll(".n").forEach(function(n){
        var to = +n.dataset.to;
        if (RM){ n.textContent = to; return; }
        var t0 = performance.now();
        (function run(now){
          var p = Math.min(1, (now - t0) / 1200), e2 = 1 - Math.pow(1 - p, 3);
          n.textContent = Math.round(to * e2);
          if (p < 1) requestAnimationFrame(run);
        })(t0);
      });
    });
  }, {threshold:0.4}).observe(rec);
}
