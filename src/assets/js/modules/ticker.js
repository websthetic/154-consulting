// Home: the client marks running in the ticker.
import images from "../../../_data/images.json";
const SHOTS = images.shots, LOGOS = images.logos;

export default function ticker() {
  var WALL = [["kennedy","Sold By Kennedy"],["andrew","Andrew Nicholson"],["brooklyn","Brooklyn College"],["revibe","Revibe"],
              ["wholemade","WholeMade"],["mfarm","The Marketing Farm"],["southwest","Southwest Wheels and Custom"]];
  // The wall marks are flat ink, so colour has to be painted under them. Each one is a mask
  // over its own brand colour, picked from that client's delivered palette for legibility on paper.
  var WALLC = { kennedy:"#35241D", andrew:"#FF7519", brooklyn:"#19305A", revibe:"#01AD85",
                wholemade:"#C96B2B", mfarm:"#94C37B", southwest:"#F56918" };
  var row = WALL.map(function(x){
    return '<span><i role="img" aria-label="' + x[1] + '" data-k="' + x[0] + '" style="--m:url(\'' +
           LOGOS[x[0]] + '\');--c:' + (WALLC[x[0]] || "#131313") + '"></i></span>';
  }).join("");
  if (!document.getElementById("tick")) return;
  (function brandWall(){
    var tick = document.getElementById("tick");
    if (!tick) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce){ tick.innerHTML = row; return; }

    var hidden = row.replace(/<span>/g, '<span aria-hidden="true">');
    var reps = 0;


    // The loop travels exactly half the track, so both halves have to be identical AND
    // one half has to be wider than the viewport, or a gap opens at the wrap point.
    tick.innerHTML = row;
    function build(){
      // derive one run's width from what is already there rather than re-rendering to measure,
      // which would wipe the built track every time a late image fired refresh
      var one = reps ? tick.scrollWidth / (reps * 2) : tick.scrollWidth;
      if (!one) return;
      var need = Math.max(1, Math.ceil((window.innerWidth + 120) / one));
      if (need === reps) return;
      reps = need;
      var a = "", b = "";
      for (var i = 0; i < reps; i++){ a += row; b += hidden; }
      tick.innerHTML = a + b;
    }

    // every mark keeps its own aspect ratio at a shared height
    var RATIO = {};
    function sizes(){
      var el = tick.querySelectorAll("i");
      for (var i = 0; i < el.length; i++){
        var r = RATIO[el[i].dataset.k];
        if (r) el[i].style.setProperty("--w", (42 * r).toFixed(1) + "px");
      }
    }

    function pace(){
      var half = tick.scrollWidth / 2;
      if (!half) return;
      // one steady speed whatever the wall holds, rather than a duration that drifts
      tick.style.animationDuration = Math.max(18, Math.round(half / 46)) + "s";
    }

    function refresh(){ sizes(); build(); sizes(); pace(); }

    var left = WALL.length;
    WALL.forEach(function(x){
      var im = new Image();
      im.onload = im.onerror = function(){
        if (im.naturalHeight) RATIO[x[0]] = im.naturalWidth / im.naturalHeight;
        if (--left === 0) refresh();
      };
      im.src = LOGOS[x[0]];
    });
    refresh();
    window.addEventListener("resize", refresh);
  })();
}
