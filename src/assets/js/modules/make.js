// Home: what we make, scrubbed brand to web to growth, and the list you build from it.

export default function make() {
  if (!document.getElementById("make")) return;
  var MAKE = {
    brand: [
      ["Logo suite","Logo suite","The mark, the wordmark and every lockup, in every file type anybody will ever ask you for."],
      ["Brand kit","Brand kit","Colour, type and logo rules in one document, so anyone you hire after us stays on brand."],
      ["Guidelines","Brand guidelines","The written rules. Spacing, photography, tone of voice, and the things nobody should do with your logo."],
      ["Positioning","Positioning and messaging","What you do, who it's for, and why they should pick you. Written as a sentence you can repeat."],
      ["Naming","Naming","Names for the business, the product or the sub-brands, sense-checked for the obvious clashes."],
      ["Print","Print and packaging","Cards, signage, packaging and anything else that has to survive a real printer."],
      ["Typography","Typography system","Every face given a job, so headings, body and buttons stay consistent wherever they turn up."],
      ["Colour","Colour palette","Specified to CMYK as well as hex, so the printer and the screen agree with each other."],
      ["Social kit","Social templates","Post and story templates in your brand, so what goes out between projects still looks like you."]
    ],
    web: [
      ["Web design","Website design","Every page designed in your brand with finished copy, before a single line of it gets built."],
      ["Development","Website development","The build itself. Quick, works on a phone, and handed over so you can run it without us."],
      ["Copywriting","Copywriting","The actual words, written before the design, because the design has to fit the words rather than the other way round."],
      ["CMS","CMS build","So you can change text, images and listings yourself at eleven at night without calling anybody."],
      ["CRM","CRM integration","Enquiries land in the system you already use, tagged and ready to follow up instead of lost in an inbox."],
      ["Landing pages","Landing pages","One page, one offer, one action. Built for a campaign rather than for browsing."],
      ["Structure","Structure and user flow","Which page does the heavy lifting, the single action, and the order that earns it."],
      ["Booking","Booking and scheduling","Appointments taken on the site, synced to the calendar the business already runs on."],
      ["Accessibility","Accessibility","Measured against WCAG 2.2 AA rather than assumed, so the site works for everybody who lands on it."]
    ],
    growth: [
      ["SEO","Search engine optimisation","Technical, on-page and local, so the people already looking for what you do can actually find you."],
      ["Google Ads","Google Ads","Search campaigns pointed at people typing the thing you sell, right at the moment they type it."],
      ["Meta ads","Meta ads","Instagram and Facebook, built to convert rather than to collect impressions you can't spend."],
      ["Social","Social media management","Content direction and the day to day posting, in a voice that still sounds like you."],
      ["Email","Email marketing","The one list you actually own, used properly. Sequences, newsletters and the follow-up nobody gets round to."],
      ["Analytics","Analytics and reporting","What happened, what it cost and what to do differently next month, in plain language."],
      ["Local SEO","Local search","Maps, the Business Profile and location pages, so you turn up when somebody nearby needs you today."],
      ["Content","Content strategy","Long-form writing that answers what people actually type, and gives search something to rank."],
      ["Reviews","Reviews and reputation","Asked for properly, answered properly, and showing up where they count."]
    ]
  };

  var bowl = document.getElementById("make");
  var sec = document.getElementById("mkScrub");
  var stage = document.getElementById("mkStage");
  var svg = document.getElementById("mkScene");
  var host = document.getElementById("mkWords");
  var bub = document.getElementById("bub"), bubT = document.getElementById("bubT");
  var bubP = document.getElementById("bubP"), bubAdd = document.getElementById("bubAdd");
  var caps = [].slice.call(document.querySelectorAll("#mkCaps .mk__cap"));
  var ghosts = [].slice.call(document.querySelectorAll("#mkGhost span"));
  var active = null;

  // Where each label hangs off the drawing, in viewBox units.
  var AN = { brand: [[222,508,"m"],[304,532,"m"],[386,508,"m"],[468,532,"m"],[550,508,"m"],[632,532,"m"],[714,508,"m"],[796,532,"m"],[878,508,"m"]], web: [[292.0,184.1,"e"],[292.0,224.1,"e"],[292.0,264.1,"e"],[292.0,304.1,"e"],[292.0,344.1,"e"],[868.0,192.1,"s"],[868.0,242.1,"s"],[868.0,292.1,"s"],[868.0,342.1,"s"]], growth: [[182,176,"e"],[182,252,"e"],[182,328,"e"],[398,119,"m"],[560,105,"m"],[722,119,"m"],[960,168,"s"],[960,244,"s"],[960,320,"s"]] };
  var ORDER = ["brand", "web", "growth"];
  var words = [];
  ORDER.forEach(function(key, at){
    MAKE[key].forEach(function(it, k){
      var pt = AN[key][k];
      if (!pt) return;
      var b = document.createElement("button");
      b.className = "orb"; b.type = "button";
      b.textContent = it[0];
      b.dataset.full = it[1]; b.dataset.def = it[2];
      b.dataset.p = key; b.dataset.k = k; b.dataset.at = at;
      b.dataset.an = pt[2];
      b.setAttribute("aria-pressed", "false");
      b.vx = pt[0]; b.vy = pt[1];
      host.appendChild(b);
      words.push(b);
    });
  });

  var VW = 1100, VH = 460, VBY = 92;
  var clamp = function(x,a,b){ a = a||0; b = (b===undefined?1:b); return x<a?a:(x>b?b:x); };
  var sm   = function(x){ return x*x*(3-2*x); };
  var eout = function(x){ return 1-Math.pow(1-x,3); };
  var lin  = function(t,a,b){ return clamp((t-a)/(b-a)); };

  var plate  = document.getElementById("mkPlate");
  var roll   = document.getElementById("mkRoll");
  var page   = document.getElementById("mkPageIn");
  var webG   = document.getElementById("mkWeb");
  var growG  = document.getElementById("mkGrow");
  var phone  = document.getElementById("mkPhone");
  var sign   = document.getElementById("mkSign");
  var card   = document.getElementById("mkCard");
  var leads  = [].slice.call(svg.querySelectorAll("#mkWeb .mdr"));
  var shafts = [].slice.call(svg.querySelectorAll("#mkGrow .mdr"));
  var heads  = [].slice.call(svg.querySelectorAll("#mkGrow .mhead"));

  var STOPS = 3, DWELL = 0.36;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var sc = 1, ox = 0, oy = 0, ghostUnit = 0, mob = window.innerWidth <= 760;

  function measure(){
    mob = window.innerWidth <= 760;
    var r = svg.getBoundingClientRect();
    if (!r.width) return;
    sc = Math.min(r.width / VW, r.height / VH);
    ox = (r.width - VW * sc) / 2;
    oy = (r.height - VH * sc) / 2 - VBY * sc;
    // the stage name is set to the widest of the three, so GROWTH fills the
    // frame and the other two sit to the same measure
    if (!ghostUnit){
    ghosts.forEach(function(g){
        g.style.fontSize = "100px";
        ghostUnit = Math.max(ghostUnit, g.scrollWidth / 100);
      });
    }
    if (ghostUnit){
      var gfs = Math.min(mob ? 190 : 420, (r.width * (mob ? 0.98 : 0.96)) / ghostUnit);
      ghosts.forEach(function(g){ g.style.fontSize = gfs.toFixed(1) + "px"; });
    }
    if (mob) return;
    var fs = Math.max(11, Math.min(17, 15.5 * sc));
    words.forEach(function(b){ b.style.fontSize = fs.toFixed(1) + "px"; });
  }

  function seek(t){
    // the ground is set out first, and everything after is measured off it
    // The ground and the plate are the poster. They are complete before any
    // script runs, so the section is whole for a crawler and a slow phone.

    // the page rises out of the plate it was set out on

    // the sign steps aside and the site rises into the space it leaves
    var aside = sm(lin(t, 0.26, 0.74));
    sign.setAttribute("x", (452.0 + (208.0 - 452.0) * aside).toFixed(1));
    sign.setAttribute("y", (240.0 + (347.97 - 240.0) * aside).toFixed(1));
    sign.setAttribute("width",  (356.0 + (150.0 - 356.0) * aside).toFixed(1));
    sign.setAttribute("height", (170.9 + (72.0 - 170.9) * aside).toFixed(1));
    // the card arrives with the sign and leaves with it, so the brand stop has two real objects
    if (card){
      var ck = 1 - sm(lin(t, 0.30, 0.58));
      card.style.opacity = ck.toFixed(3);
      card.style.transform = "translate(" + ((1 - ck) * -30).toFixed(1) + "px," + ((1 - ck) * 18).toFixed(1) + "px)";
    }
    var rise = sm(lin(t, 0.44, 0.84));
    page.style.transform = "translate(0," + ((1 - rise) * 270).toFixed(1) + "px)";
    var pk = eout(lin(t, 1.48, 1.78));
    phone.style.opacity = pk.toFixed(3);
    phone.style.transform = "translate(0," + ((1 - pk) * 90).toFixed(1) + "px)";
    webG.style.opacity = (sm(lin(t, 0.66, 0.80)) * (1 - sm(lin(t, 1.38, 1.62)))).toFixed(3);
    leads.forEach(function(el, i){
      el.style.strokeDashoffset = (1 - lin(t, 0.68 + i * 0.012, 0.86 + i * 0.012)).toFixed(3);
    });

    // then the channels, every one aimed at the same page
    growG.style.opacity = sm(lin(t, 1.42, 1.58)).toFixed(3);
    shafts.forEach(function(el, i){
      el.style.strokeDashoffset = (1 - eout(lin(t, 1.44 + i * 0.016, 1.74 + i * 0.016))).toFixed(3);
    });
    heads.forEach(function(el, i){
      var k = eout(lin(t, 1.70 + i * 0.012, 1.86 + i * 0.012));
      el.style.opacity = k.toFixed(3);
      el.style.transform = "scale(" + (0.3 + 0.7 * k).toFixed(3) + ")";
    });

    // one layer is labelled at a time, so you read nine things, never twenty seven
    words.forEach(function(b){
      var at = +b.dataset.at;
      var IN  = [[-1, -0.5], [0.70, 0.90], [1.62, 1.86]][at];
      var OUT = [[0.42, 0.68], [1.40, 1.64], [9, 9]][at];
      var k = eout(lin(t, IN[0], IN[1])) * (1 - sm(lin(t, OUT[0], OUT[1])));
      var read = b.classList.contains("is-read");
      b.style.opacity = (read ? Math.max(k, 0.25) : k).toFixed(3);
      b.style.pointerEvents = k > 0.55 ? "auto" : "none";
      b.classList.toggle("is-live", k > 0.92);
      if (mob){
        b.style.transform = "none";
        b.style.display = k > 0.45 ? "" : "none";
      } else {
        b.style.display = "";
        b.style.transform = "translate(var(--mtx),-50%) translate(" +
          (ox + b.vx * sc).toFixed(1) + "px," + (oy + b.vy * sc).toFixed(1) + "px)";
      }
    });

    // the name cast into the plate rolls over with the scene
    roll.setAttribute("transform", "translate(0," + (-t * 50).toFixed(1) + ")");

    // the stage name sits behind the drawing and changes with it, so you
    // always know which of the three you are looking at
    ghosts.forEach(function(g){
      var d = Math.abs(t - +g.dataset.at);
      g.style.opacity = (clamp(1 - d * 1.35) * (mob ? 0.12 : 0.085)).toFixed(4);
      g.style.transform = "translateX(calc(-50% + " + ((+g.dataset.at - t) * 38).toFixed(1) + "px))";
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
  function layout(){ measure(); seek(sceneT(progress())); }

  var DEF_T = bubT.textContent, DEF_P = bubP.textContent;
  function openBub(el){
    active = el;
    bubT.textContent = el.dataset.full;
    bubP.textContent = el.dataset.def;
    bubAdd.textContent = el.classList.contains("on") ? "Remove from my list" : "Add to my list";
    bubAdd.hidden = false;
    host.querySelectorAll(".orb").forEach(function(o){ o.classList.toggle("is-read", o === el); });
  }
  function closeBub(){
    active = null;
    bubT.textContent = DEF_T; bubP.textContent = DEF_P; bubAdd.hidden = true;
    host.querySelectorAll(".orb").forEach(function(o){ o.classList.remove("is-read"); });
  }

  var tick = false, onScreen = true;
  function onFrame(){ tick = false; if (onScreen) layout(); }
  function request(){ if (!tick){ tick = true; requestAnimationFrame(onFrame); } }
  if (window.IntersectionObserver){
    new IntersectionObserver(function(en){ onScreen = en[0].isIntersecting; if (onScreen) request(); })
      .observe(sec);
  }
  window.addEventListener("scroll", request, {passive:true});
  window.addEventListener("resize", function(){ ghostUnit = 0; request(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ ghostUnit = 0; request(); });

  var canHover = !(window.matchMedia && window.matchMedia("(hover:none)").matches);

  bowl.addEventListener("click", function(e){
    var el = e.target.closest(".orb");
    if (el) openBub(el);
  });
  if (canHover){
    bowl.addEventListener("pointerover", function(e){
      var el = e.target.closest(".orb");
      if (el && !el.dataset.go && el !== active) openBub(el);
    });
  }


  var tray = document.getElementById("tray"), trayItems = document.getElementById("trayItems");
  var trayHd = document.getElementById("trayHd"), trayClear = document.getElementById("trayClear");
  var picked = document.getElementById("picked"), pickedItems = document.getElementById("pickedItems");
  var chosen = [];
  try { chosen = JSON.parse(sessionStorage.getItem("154:picked") || "[]"); } catch (e) {}

  var EMPTY = { brand:"Nothing from the foundation yet.", web:"Nothing to build on it yet.", growth:"Nothing pointed at it yet." };
  function renderTray(){
    try { sessionStorage.setItem("154:picked", JSON.stringify(chosen)); } catch (e) {}
    tray.hidden = chosen.length === 0;
    if (picked){
      picked.hidden = chosen.length === 0;
      pickedItems.innerHTML = chosen.map(function(c){ return '<button type="button">' + c.label + '</button>'; }).join("");
    }
    trayItems.innerHTML = ["brand","web","growth"].map(function(p){
      var rows = chosen.map(function(c, i){ return c.p === p ? [c, i] : null; }).filter(Boolean);
      var body = rows.length
        ? '<ul>' + rows.map(function(r){
            return '<li><button type="button" data-i="' + r[1] + '"><i></i>' + r[0].label + '</button></li>';
          }).join("") + '</ul>'
        : '<p>' + EMPTY[p] + '</p>';
      return '<div class="tgroup"><em>' + p + '</em>' + body + '</div>';
    }).join("");
    var order = ["brand","web","growth"].filter(function(p){ return chosen.some(function(c){ return c.p === p; }); });
    trayHd.textContent = order.length > 1
      ? "We would run it in this order: " + order.join(", then ") + "."
      : (order.length ? "All " + order[0] + " so far. Tap another ring to see what it needs around it." :
         "Pick anything off the rings and it lands here, in the order we would do it in.");
  }
  function syncChips(){
    bowl.querySelectorAll(".orb").forEach(function(m){
      var on = chosen.some(function(c){ return c.label === m.dataset.full; });
      m.classList.toggle("on", on);
      m.setAttribute("aria-pressed", String(on));
    });
    if (active) bubAdd.textContent = active.classList.contains("on") ? "Remove from my list" : "Add to my list";
  }
  function toggleOrb(el){
    var label = el.dataset.full, p = el.dataset.p, at = -1;
    chosen.forEach(function(c, i){ if (c.label === label) at = i; });
    if (at > -1) chosen.splice(at, 1); else chosen.push({label:label, p:p});
    syncChips(); renderTray();
  }
  bubAdd.addEventListener("click", function(){ if (active) toggleOrb(active); });
  trayItems.addEventListener("click", function(e){
    var b = e.target.closest("button[data-i]");
    if (!b) return;
    chosen.splice(+b.dataset.i, 1);
    syncChips(); renderTray();
  });
  trayClear.addEventListener("click", function(){ chosen = []; syncChips(); renderTray(); });
  syncChips();
  renderTray();
  layout();
  window.addEventListener("load", layout);
}
