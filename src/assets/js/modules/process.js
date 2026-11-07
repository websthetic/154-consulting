// Process: what happens after you say yes, drawn as you scroll.

export default function process() {
  var sec   = document.getElementById("procScrub");
  var build = document.getElementById("build");
  var capsEl= document.getElementById("procCaps");
  var caps  = [].slice.call(document.querySelectorAll("#procCaps .cap"));
  var stage = document.querySelector(".proc__stage");
  if (!sec || !build || !capsEl) return;

  var rail = document.createElement("div");
  rail.className = "procRail"; rail.innerHTML = "<i></i>";
  stage.appendChild(rail);
  var railFill = rail.firstChild;

  var STOPS = 6, DWELL = 0.38;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // One camera, keyed per stop: [scale, focus x, focus y]. On a phone the
  // frame is tighter at every stop, or the answers on the sheet and the
  // candidate marks stop being readable, which is the point of showing them.
  var KD = [[1,280,190],[1,280,190],[1,280,190],[1,280,190],[1.62,303,179],[1,280,190]];
  var KM = [[1.46,280,152],[1.90,405,208],[1.20,276,194],[1.06,283,186],[2.00,303,176],[1.04,283,188]];
  var mob = window.innerWidth < 900;

  var E = function(id){ return document.getElementById(id); };
  var all = function(s){ return [].slice.call(build.querySelectorAll(s)); };
  var cam = E("pCam"), sheet = E("pSheet"),
      qg = E("pQg"), dg = E("pDg"), mg = E("pMg"), win = E("pWin"),
      wg = E("pWg"), sg = E("pSg"), ag = E("pAg"),
      stamp = E("pStamp"), mark = E("pMark"), appr = E("pAppr");
  var hls = all("#pQg .phl"), conns = all("#pDg .pdr"), chips = all("#pDg .pch"),
      mks = all("#pMg .pmk"), ring = win.querySelector(".pdr"),
      arts = all("#pWg .pat"), specs = all("#pSg .pdr"), oks = all("#pOk .pok");

  var clamp = function(x,a,b){ a = a||0; b = (b===undefined?1:b); return x<a?a:(x>b?b:x); };
  var sm    = function(x){ return x*x*(3-2*x); };
  var eout  = function(x){ return 1-Math.pow(1-x,3); };
  var eio   = function(x){ return x<0.5 ? 4*x*x*x : 1-Math.pow(-2*x+2,3)/2; };
  var lin   = function(t,a,b){ return clamp((t-a)/(b-a)); };
  var lerp  = function(a,b,k){ return a+(b-a)*k; };

  var C0 = [245,243,236], C1 = [22,53,42];
  var mix = function(a,b,k){
    return "rgb(" + Math.round(a[0]+(b[0]-a[0])*k) + "," +
                    Math.round(a[1]+(b[1]-a[1])*k) + "," +
                    Math.round(a[2]+(b[2]-a[2])*k) + ")";
  };
  // the losing directions, in the order they come off the table
  var DIM = [0.02, 0.09, 0.20, 0.13, 0];

  function seek(t){
    // The sheet is the one object that runs through every stop. It slides
    // over to make room for the decisions, then opens out into the board the
    // work gets made on.
    var slide = eio(lin(t, 0.16, 0.62));
    var open  = eio(lin(t, 1.34, 1.80));
    sheet.setAttribute("x", (lerp(132, 18, slide) + 6*open).toFixed(1));
    sheet.setAttribute("y", lerp(10, 46, open).toFixed(1));
    sheet.setAttribute("width",  lerp(296, 512, open).toFixed(1));
    sheet.setAttribute("height", lerp(360, 280, open).toFixed(1));
    sheet.style.strokeOpacity = (1 - 0.8*open).toFixed(3);

    // the questionnaire
    qg.setAttribute("transform", "translate(" + (lerp(132,18,slide) - 132).toFixed(1) + ",0)");
    qg.style.opacity = (1 - sm(lin(t, 1.28, 1.64))).toFixed(3);
    var sk = eout(lin(t, 0.26, 0.50));
    stamp.style.opacity = sk.toFixed(3);
    stamp.style.transform = "rotate(-3.5deg) scale(" + (0.86 + 0.14*sk).toFixed(3) + ")";
    hls.forEach(function(el, i){
      el.style.transform = "scaleX(" + eout(lin(t, 0.38 + i*0.07, 0.66 + i*0.07)).toFixed(3) + ")";
    });

    // the decisions, pulled off the answers that caused them
    dg.style.opacity = (sm(lin(t, 0.54, 0.68)) * (1 - sm(lin(t, 1.24, 1.56)))).toFixed(3);
    conns.forEach(function(el, i){
      el.style.strokeDashoffset = (1 - lin(t, 0.56 + i*0.06, 0.80 + i*0.06)).toFixed(3);
    });
    chips.forEach(function(el, i){
      var k = eout(lin(t, 0.64 + i*0.07, 0.92 + i*0.07));
      el.style.opacity = k.toFixed(3);
      el.style.transform = "translate(0," + ((1-k)*14).toFixed(1) + "px)";
    });

    // five directions go up, four come off the table, one is left
    mg.style.opacity = (sm(lin(t, 1.42, 1.56)) * (1 - sm(lin(t, 2.26, 2.52)))).toFixed(3);
    mks.forEach(function(el, i){
      var k = eout(lin(t, 1.44 + i*0.05, 1.74 + i*0.05));
      var off = DIM[i] === 0 ? 1 : (1 - 0.86 * sm(lin(t, 1.80 + DIM[i], 1.94 + DIM[i])));
      var gone = DIM[i] === 0 ? 0 : sm(lin(t, 1.98, 2.14));
      var moved = DIM[i] === 0 ? sm(lin(t, 1.98, 2.14)) : 0;
      el.style.opacity = (k * off * (1 - 0.6*gone) * (1 - moved)).toFixed(3);
      el.style.transform = "scale(" + (0.62 + 0.38*k - 0.10*gone).toFixed(3) + ")";
    });
    var wk = eout(lin(t, 1.96, 2.20));
    win.style.opacity = (wk * (1 - sm(lin(t, 2.26, 2.52)))).toFixed(3);
    win.style.transform = "scale(" + (0.52 + 0.48*wk).toFixed(3) + ")";
    ring.style.strokeDashoffset = (1 - eout(lin(t, 2.00, 2.18))).toFixed(3);

    // the work, made real, with that mark on all of it
    wg.style.opacity = sm(lin(t, 2.34, 2.48)).toFixed(3);
    var IN = [[2.36,2.74],[2.46,2.82],[2.54,2.90],[2.62,2.96]];
    var push = eio(lin(t, 3.26, 3.94)) - eio(lin(t, 4.30, 4.94));
    arts.forEach(function(el){
      var i = +el.dataset.i, w = IN[i] || IN[0];
      var k = eout(lin(t, w[0], w[1]));
      el.style.opacity = (k * (i === 0 ? 1 : 1 - 0.88*push)).toFixed(3);
      el.style.transform = "translate(0," + ((1-k)*22).toFixed(1) + "px)";
    });

    // one camera, keyed per stop, pushing into the page at the specification
    var K = mob ? KM : KD, ci = Math.min(STOPS-2, Math.floor(t)), cf = clamp(t - ci);
    var k0 = K[ci], k1 = K[ci+1];
    var cs = lerp(k0[0], k1[0], cf);
    var fx = lerp(k0[1], k1[1], cf), fy = lerp(k0[2], k1[2], cf);
    cam.setAttribute("transform",
      "translate(280,190) scale(" + cs.toFixed(4) + ") translate(" + (-fx).toFixed(2) + "," + (-fy).toFixed(2) + ")");

    // the specification, written in the margin so every number reads
    sg.style.opacity = (sm(lin(t, 3.42, 3.64)) * (1 - sm(lin(t, 4.16, 4.40)))).toFixed(3);
    specs.forEach(function(el, i){
      el.style.strokeDashoffset = (1 - eout(lin(t, 3.46 + i*0.07, 3.76 + i*0.07))).toFixed(3);
    });

    // what is off gets said, then corrected in front of you
    ag.style.opacity = sm(lin(t, 4.30, 4.44)).toFixed(3);
    mark.style.opacity = (eout(lin(t, 4.32, 4.54)) * (1 - sm(lin(t, 4.58, 4.70)))).toFixed(3);
    all("#pMark .ppop").forEach(function(el, i){
      el.style.transform = "scale(" + (1.5 - 0.5*eout(lin(t, 4.32 + i*0.05, 4.54 + i*0.05))).toFixed(3) + ")";
    });
    oks.forEach(function(g, i){
      var k = eout(lin(t, 4.62 + i*0.07, 4.86 + i*0.07));
      g.style.opacity = k.toFixed(3);
      g.querySelector(".ppop").style.transform = "scale(" + (0.4 + 0.6*k).toFixed(3) + ")";
      g.querySelector(".pdr").style.strokeDashoffset = (1 - lin(t, 4.68 + i*0.05, 4.88 + i*0.05)).toFixed(3);
    });
    var ak = eout(lin(t, 4.74, 4.96));
    appr.style.opacity = ak.toFixed(3);
    appr.style.transform = "rotate(-3deg) scale(" + (0.88 + 0.12*ak).toFixed(3) + ")";

    // Colour is state: the band holds paper through the build and turns over
    // the last step, when the thing is finished. Text flips in one go rather
    // than fading through grey, where neither colour would read.
    var k  = sm(lin(t, 3.95, 5));
    var up = k > 0.62;
    sec.style.backgroundColor = mix(C0,C1,k);
    sec.style.setProperty("--fg",   up ? "rgb(239,237,228)" : "rgb(27,26,23)");
    sec.style.setProperty("--fg-2", up ? "rgb(182,196,188)" : "rgb(86,83,74)");
    sec.style.setProperty("--fg-3", up ? "rgb(143,160,151)" : "rgb(131,127,114)");
    sec.style.setProperty("--rule", up ? "rgba(239,237,228,.2)" : "rgba(19,19,19,.14)");
    sec.style.setProperty("--accent-text", up ? "var(--accent)" : "");
    sec.style.setProperty("--panel", mix([237,234,224],[29,64,50],k));
    railFill.style.width = (clamp(t/(STOPS-1))*100).toFixed(1) + "%";

    caps.forEach(function(c){
      c.classList.toggle("on", Math.abs(t - +c.dataset.at) < 0.52);
    });
  }

  // Progress is read off the captions, not the whole section, so the step
  // being drawn is always the step sitting in the middle of the screen.
  function progress(){
    var r = capsEl.getBoundingClientRect();
    var unit = r.height / STOPS;
    if (unit <= 0) return 0;
    var c = (window.innerHeight / 2) - r.top;
    return clamp((c - unit / 2) / (unit * (STOPS - 1)));
  }
  function sceneT(p){
    if (reduce) return Math.round(p*(STOPS-1));
    var seg = p*(STOPS-1), i = Math.floor(seg), f = seg-i;
    var move = clamp((f - DWELL/2)/(1-DWELL));
    return Math.min(STOPS-1, i + sm(move));
  }

  var on = false, queued = false;
  function frame(){ queued = false; if (on) seek(sceneT(progress())); }
  function request(){ if (!queued){ queued = true; requestAnimationFrame(frame); } }
  if (window.IntersectionObserver){
    new IntersectionObserver(function(en){ on = en[0].isIntersecting; if (on) request(); })
      .observe(sec);
  } else { on = true; }
  window.addEventListener("scroll", request, {passive:true});
  window.addEventListener("resize", function(){ mob = window.innerWidth < 900; request(); });
  document.addEventListener("click", function(){ setTimeout(request, 60); });
  seek(0);
}
