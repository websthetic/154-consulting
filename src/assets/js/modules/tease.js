// Home: the house accent, and the work teaser.
import images from "../../../_data/images.json";
const SHOTS = images.shots, LOGOS = images.logos;

export default function tease() {
  var RM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;
  var TEASE = {
    "":          [SHOTS.own_pager, SHOTS.own_lock,  "154 Consulting, our own"],
    kennedy:     [SHOTS.kAfter,   SHOTS.k_kit,      "Sold By Kennedy"],
    andrew:      [SHOTS.c_andrew, SHOTS.a_app,      "Andrew Nicholson"],
    brooklyn:    [SHOTS.c_brooklyn, SHOTS.b_crest,  "Brooklyn College"],
    revibe:      [SHOTS.c_revibe, SHOTS.r_word,     "Revibe"],
    wholemade:   [SHOTS.w_subs,   SHOTS.c_wholemade,"WholeMade"],
    mfarm:       [SHOTS.m_mock,   SHOTS.c_mfarm,    "The Marketing Farm"],
    southwest:   [SHOTS.c_southwest, null,          "Southwest Wheels and Custom"]
  };
  var tsA = document.getElementById("tsA"), tsB = document.getElementById("tsB");
  var tsCap = document.getElementById("tsCap"), tshots = document.querySelector(".tshots");
  function setTease(k){
    var t = TEASE[k || ""];
    if (!t || !tsA) return;
    tshots.classList.add("is-swap");
    setTimeout(function(){
      tsA.src = t[0];
      tsA.alt = t[2] + ", by 154 Consulting";
      if (t[1]){ tsB.src = t[1]; tsB.alt = t[2] + " brand work"; tsB.hidden = false; }
      else { tsB.hidden = true; }
      tsCap.textContent = t[2];
      tshots.classList.remove("is-swap");
    }, RM ? 0 : 200);
  }

  // The site used to repaint itself in a client's palette. That is gone; the house
  // accent is simply set once, and the teaser still opens on 154's own work.
  root.style.setProperty("--accent", "#C6941F");
  root.style.setProperty("--accent-text", "#8A5C13");
  root.style.setProperty("--accent-on-fill", "#131313");
  setTease(null);
}
