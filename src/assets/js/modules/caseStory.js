// Case study pages: the mark is set out, traced, filled, then shown in its system.

export default function caseStory() {
  [].slice.call(document.querySelectorAll(".cs--story")).forEach(function(sec){
    var q      = function(r){ return sec.querySelector('[data-r="' + r + '"]'); };
    var caps   = [].slice.call(sec.querySelectorAll(".cs__cap"));
    var ghosts = [].slice.call(sec.querySelectorAll(".cs__ghost"));
    var stage  = sec.querySelector(".cs__stage");
    var before = q("before"), ring = q("ring"), note = q("note");
    var mark   = q("mark"), sys = q("sys"), live = q("live"), nameEl = q("name");
    var altsEl = q("alts");
    var cells  = [].slice.call(sec.querySelectorAll(".ka"));
    var conG   = q("con");
    var con    = [].slice.call(sec.querySelectorAll(".kc"));
    var outs   = [].slice.call(sec.querySelectorAll(".ko"));
    var fills  = [].slice.call(sec.querySelectorAll(".kf"));
    var wordm  = [].slice.call(sec.querySelectorAll(".kw"));
    var TR     = sec.dataset.tr ? JSON.parse(sec.dataset.tr) : null;
    var STOPS = altsEl ? 7 : 6, DWELL = 0.34;
    var A1 = altsEl ? 1 : 0;   // everything after the Mark stop shifts by one when there are variants
    if (!mark || !live) return;
    sec.style.height = (STOPS * 74 + 16) + "vh";

    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var clamp = function(x,a,b){ a = a||0; b = (b===undefined?1:b); return x<a?a:(x>b?b:x); };
    var sm   = function(x){ return x*x*(3-2*x); };
    var eout = function(x){ return 1-Math.pow(1-x,3); };
    var lin  = function(t,a,b){ return clamp((t-a)/(b-a)); };
    var unit = 0, mob = false;

    // the trace cascades across however many contours the mark has
    var N = outs.length || 1;
    var span = N > 1 ? 0.62 / (N - 1) : 0;
    function tr(i){ return TR ? TR[i] : [1.02 + i * span, 1.02 + i * span + 0.44]; }
    var fspan = N > 1 ? 0.30 / (N - 1) : 0;

    function fit(){
      mob = window.innerWidth <= 760;
      var w = stage.clientWidth;
      if (!w) return;
      if (!unit){ ghosts.forEach(function(g){ g.style.fontSize = "100px"; unit = Math.max(unit, g.scrollWidth / 100); }); }
      if (unit){
        var gf = Math.min(mob ? 170 : 360, w * 0.96 / unit);
        ghosts.forEach(function(g){ g.style.fontSize = gf.toFixed(1) + "px"; });
      }
      if (ring && before){
        var br = before.getBoundingClientRect(), sr = stage.getBoundingClientRect();
        if (br.width){
          ring.style.left   = (br.left - sr.left + br.width * 0.06) + "px";
          ring.style.top    = (br.top  - sr.top  + br.height * 0.50) + "px";
          ring.style.width  = (br.width * 0.88) + "px";
          ring.style.height = (br.height * 0.44) + "px";
          note.style.left   = (br.left - sr.left + br.width * 0.06) + "px";
          note.style.top    = (br.top  - sr.top  + br.height * 0.50 - 30) + "px";
        }
      }
    }

    function seek(t){
      var bOut = sm(lin(t, 0.40, 0.80));
      before.style.opacity = (1 - bOut).toFixed(3);
      before.style.transform = "translate(-50%,-50%) scale(" + (1 - 0.06 * bOut).toFixed(3) + ")";
      if (ring){
        var rk = eout(lin(t, -0.30, 0.02)) * (1 - sm(lin(t, 0.30, 0.58)));
        ring.style.opacity = rk.toFixed(3);
        note.style.opacity = rk.toFixed(3);
      }

      conG.style.opacity = (sm(lin(t, 0.62, 0.80)) * (1 - sm(lin(t, 2.30, 2.70)))).toFixed(3);
      con.forEach(function(el, i){
        el.style.strokeDashoffset = (1 - eout(lin(t, 0.66 + i * 0.045, 0.98 + i * 0.045))).toFixed(3);
      });

      outs.forEach(function(el, i){
        var k = tr(i);
        el.style.strokeDashoffset = (1 - lin(t, k[0], k[1])).toFixed(3);
        el.style.opacity = (1 - sm(lin(t, 2.55, 2.95))).toFixed(3);
      });
      fills.forEach(function(el, i){
        el.style.opacity = sm(lin(t, 2.12 + i * fspan, 2.52 + i * fspan)).toFixed(3);
      });
      wordm.forEach(function(el, i){
        el.style.opacity = sm(lin(t, 2.40 + i * 0.028, 2.74 + i * 0.028)).toFixed(3);
      });
      if (nameEl) nameEl.style.opacity = sm(lin(t, 2.46, 2.86)).toFixed(3);

      var aside = sm(lin(t, 3.15, 3.75));
      var sc = 1 - 0.66 * aside;
      mark.style.opacity = (sm(lin(t, 0.56, 0.76)) * (1 - sm(lin(t, 4.30 + A1, 4.68 + A1)))).toFixed(3);
      mark.style.transform = "translate(-50%,-50%) translate(" + (-aside * (mob ? 0 : 74)).toFixed(1) +
        "%," + (-aside * (mob ? 52 : 46)).toFixed(1) + "%) scale(" + sc.toFixed(3) + ")";

      if (altsEl){
        var ak = eout(lin(t, 3.34, 3.86));
        altsEl.style.opacity = (ak * (1 - sm(lin(t, 4.34, 4.76)))).toFixed(3);
        altsEl.style.transform = "translate(-50%,-50%) translateY(" + ((1 - ak) * 22 - sm(lin(t, 4.34, 4.84)) * 10).toFixed(1) + "%)";
        var n = cells.length, step = n > 1 ? 0.30 / (n - 1) : 0;
        cells.forEach(function(cell, i){
          var a0 = 3.42 + i * step;
          var dash = (1 - eout(lin(t, a0, a0 + 0.30))).toFixed(3);
          [].forEach.call(cell.querySelectorAll(".kao"), function(el){ el.style.strokeDashoffset = dash; });
          var f = cell.querySelector(".kaf");
          if (f) f.style.opacity = sm(lin(t, a0 + 0.22, a0 + 0.46)).toFixed(3);
        });
      }

      var sk = eout(lin(t, 3.34 + A1, 3.84 + A1));
      sys.style.opacity = (sk * (1 - sm(lin(t, 4.30 + A1, 4.70 + A1)))).toFixed(3);
      sys.style.transform = "translate(-50%,-50%) translateY(" + ((1 - sk) * 26 - sm(lin(t, 4.30 + A1, 4.80 + A1)) * 10).toFixed(1) + "%)";

      var lk = eout(lin(t, 4.34 + A1, 4.86 + A1));
      live.style.opacity = lk.toFixed(3);
      live.style.transform = "translate(-50%,-50%) translateY(" + ((1 - lk) * 28).toFixed(1) +
        "%) scale(" + (0.94 + 0.06 * lk).toFixed(3) + ")";

      ghosts.forEach(function(g){
        var dd = Math.abs(t - +g.dataset.at);
        g.style.opacity = (clamp(1 - dd * 1.4) * (mob ? 0.11 : 0.08)).toFixed(4);
        g.style.transform = "translateX(calc(-50% + " + ((+g.dataset.at - t) * 34).toFixed(1) + "px))";
      });
      caps.forEach(function(c){ c.style.opacity = Math.abs(t - +c.dataset.at) < 0.5 ? "1" : "0"; });
    }

    function progress(){
      var r = sec.getBoundingClientRect();
      var total = r.height - window.innerHeight;
      if (total <= 0) return 0;
      return clamp(-r.top / total);
    }
    function sceneT(p){
      if (reduce) return Math.round(p * (STOPS - 1));
      var seg = p * (STOPS - 1), i = Math.floor(seg), f = seg - i;
      var move = clamp((f - DWELL / 2) / (1 - DWELL));
      return Math.min(STOPS - 1, i + sm(move));
    }
    var on = false, queued = false;
    function frame(){ queued = false; if (on){ fit(); seek(sceneT(progress())); } }
    function request(){ if (!queued){ queued = true; requestAnimationFrame(frame); } }
    if (window.IntersectionObserver){
      new IntersectionObserver(function(en){ on = en[0].isIntersecting; if (on) request(); }).observe(sec);
    } else { on = true; }
    window.addEventListener("scroll", request, {passive:true});
    window.addEventListener("resize", function(){ unit = 0; request(); });
    document.addEventListener("click", function(){ setTimeout(request, 80); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ unit = 0; request(); });
    fit(); seek(0);
  });
}
