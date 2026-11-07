// Where to start: ten questions and an honest answer.

export default function start() {
  var Q = [
    { q:"Can two people on your team explain what you do the same way?",
      a:[ {t:"No. Everyone says something different.", s:{brand:5}},
          {t:"Roughly, but never the same words.", s:{brand:3, web:1}},
          {t:"Yes, near enough word for word.", s:{web:1, growth:1}} ] },

    { q:"A stranger lands on your Instagram. What do they work out in five seconds?",
      a:[ {t:"Not much. It's a bit of everything.", s:{brand:5}},
          {t:"What we sell, but not why us.", s:{brand:3, web:2}},
          {t:"Who we are and who it's for.", s:{growth:2}} ] },

    { q:"Someone asks for your logo. What do you send them?",
      a:[ {t:"I dig through old messages for a JPG.", s:{brand:5}},
          {t:"The files. There are no rules for using them.", s:{brand:3, web:1}},
          {t:"A brand kit. They get it right.", s:{web:1, growth:1}} ] },

    { q:"You bring someone new on. How do they learn how the brand should look?",
      a:[ {t:"They ask me. Every time.", s:{brand:4}},
          {t:"I send old files and hope for the best.", s:{brand:2, web:1}},
          {t:"There's a guidelines doc and they follow it.", s:{growth:2}} ] },

    { q:"Someone asks a question you've answered a hundred times. Where do you send them?",
      a:[ {t:"Nowhere. I answer it again.", s:{web:5}},
          {t:"I dig up an old message and paste it.", s:{web:3, brand:1}},
          {t:"A page on the site that covers it.", s:{growth:2}} ] },

    { q:"How much of the selling is you?",
      a:[ {t:"All of it.", s:{web:5}},
          {t:"Most of it, and I'm tired.", s:{web:3, growth:1}},
          {t:"The site does a good chunk.", s:{growth:2}} ] },

    { q:"You need to change a price on the site. What happens?",
      a:[ {t:"I email someone and wait.", s:{web:5}},
          {t:"I let it pile up until there's a few changes.", s:{web:3, brand:1}},
          {t:"I log in and change it myself.", s:{growth:2}} ] },

    { q:"Ten people visit your site today. How many get in touch?",
      a:[ {t:"No idea. Never checked.", s:{web:3, growth:2}},
          {t:"Barely any, and I don't know why.", s:{web:4}},
          {t:"Enough that I can guess it.", s:{growth:2}} ] },

    { q:"Where did your last five customers come from?",
      a:[ {t:"All from people I know.", s:{growth:5}},
          {t:"Mostly referrals. One or two found us.", s:{growth:3, web:1}},
          {t:"Mostly strangers who found us.", s:{web:1, growth:1}} ] },

    { q:"Someone nearby is searching for what you sell, right now.",
      a:[ {t:"They won't find us.", s:{growth:5}},
          {t:"Sometimes. It's luck.", s:{growth:3, web:1}},
          {t:"They find us, and I know what that's worth.", s:{brand:1, web:1}} ] }
  ];
  var VERDICT = {
    brand:{ h:"Start with the brand.",
      p:"It's clear to you and blurry to everyone else. Until the thing has a name, a look and a sentence three people repeat the same way, every dollar you put into a site or into ads carries a message nobody agreed on.",
      m:"Positioning, identity, and guidelines you actually keep. Everything after it gets cheaper." },
    web:{ h:"Start with the site.",
      p:"You know who you are. What's missing is everything between somebody looking you up and somebody paying you. Right now that gap is you, answering messages. It doesn't scale, and it doesn't work at eleven at night.",
      m:"A site written and structured before it's designed, with enquiries landing somewhere that follows up." },
    growth:{ h:"Start with growth.",
      p:"The foundation is there and the site holds up. What's missing is volume. Not enough of the right people see it, and the ones who do mostly arrive through somebody who already knows you. That's the ceiling referrals hit.",
      m:"Search on what you already own, then content and paid, in that order." }
  };
  var dIn = document.getElementById("dIn"), dMain = document.getElementById("dMain");
  if (!dIn) return;
  var dBar = document.getElementById("dBar");
  var sv = document.getElementById("sv");
  var svRow = {};
  sv.querySelectorAll(".sv__row").forEach(function(r){ svRow[r.dataset.k] = r; });
  var KEYS = ["brand","web","growth"];
  var qi = 0, picks = [], score = {brand:0, web:0, growth:0}, finished = false;

  function tally(){
    score = {brand:0, web:0, growth:0};
    for (var i = 0; i < picks.length; i++){
      var s = Q[i].a[picks[i]].s;
      for (var k in s) score[k] += s[k];
    }
  }
  function topKey(){
    var t = "brand";
    if (score.web > score[t]) t = "web";
    if (score.growth > score[t]) t = "growth";
    return t;
  }
  function renderStack(){
    var tot = score.brand + score.web + score.growth;
    var t = tot ? topKey() : null;
    var peak = Math.max(score.brand, score.web, score.growth) || 1;
    KEYS.forEach(function(k){
      var row = svRow[k];
      var pct = tot ? Math.round(score[k] / tot * 100) : 0;
      row.querySelector(".sv__hd b").textContent = pct + "%";
      row.querySelector(".sv__slab i").style.width = (score[k] ? Math.max(5, score[k] / peak * 100) : 0) + "%";
      row.classList.toggle("is-top", finished && k === t);
    });
    sv.classList.toggle("is-done", finished);
    var tag = document.getElementById("svTag");
    if (finished && t) svRow[t].appendChild(tag); else sv.appendChild(tag);
  }
  function renderQ(){
    finished = false;
    tally();
    dBar.style.width = (qi / Q.length * 100) + "%";
    var q = Q[qi];
    var s = '<p class="diag__step">Question ' + (qi + 1) + ' of ' + Q.length + '</p><h3 class="diag__q">' + q.q + '</h3><div class="opts">';
    q.a.forEach(function(a, i){
      var on = picks[qi] === i ? " is-on" : "";
      s += '<button class="opt' + on + '" data-i="' + i + '"><i>' + "ABC"[i] + '</i><span>' + a.t + '</span></button>';
    });
    s += '</div>';
    if (qi > 0) s += '<button class="diag__back" data-back="1">&#8592; Back a question</button>';
    dMain.innerHTML = s;
    renderStack();
  }
  function renderV(){
    finished = true;
    tally();
    dBar.style.width = "100%";
    var v = VERDICT[topKey()];
    try { sessionStorage.setItem("154:start", v.h); } catch (e) {}
    dMain.innerHTML = '<div class="verdict">' +
      '<h3 class="diag__q acc" style="max-width:none">' + v.h + '</h3>' +
      '<p class="body" style="max-width:56ch">' + v.p + '</p>' +
      '<p class="body" style="max-width:56ch"><strong>' + v.m + '</strong></p>' +
      '<div class="btns"><a class="btn btn--solid" href="/contact/">Book a call with this answer</a>' +
      '<button class="btn btn--ghost" id="dAgain">Start over</button></div>' +
      '<button class="diag__back" data-back="1">&#8592; Change my last answer</button></div>';
    renderStack();
  }
  dIn.addEventListener("click", function(e){
    if (e.target.closest("[data-back]")){
      if (qi >= Q.length) qi = Q.length - 1; else if (qi > 0) qi--;
      renderQ();
      return;
    }
    var o = e.target.closest(".opt");
    if (o){
      picks[qi] = +o.dataset.i;
      qi++;
      if (qi < Q.length) renderQ(); else renderV();
      return;
    }
    if (e.target.closest("#dAgain")){ qi = 0; picks = []; renderQ(); }
  });
  renderQ();
}
