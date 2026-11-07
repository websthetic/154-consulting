// Service pages: the interactive module under each hero, and the audit checklist.
import images from "../../../_data/images.json";
const SHOTS = images.shots, LOGOS = images.logos;

export default function serviceWidgets() {
  var NAME = { own:"154 Consulting", kennedy:"Sold By Kennedy", andrew:"Andrew Nicholson", brooklyn:"Brooklyn College", revibe:"Revibe",
                 wholemade:"WholeMade", mfarm:"Marketing Farm", southwest:"Southwest Wheels" };
  var esc = function(t){ return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;"); };

  // 1. a client mark placed in four real-world contexts
var CTXP = {"own":{"desk":"/assets/images/site/desk.webp","door":"/assets/images/site/door.webp","shirt":"/assets/images/site/shirt.webp","card":"/assets/images/site/card.webp","phone":"/assets/images/site/phone.webp"},"kennedy":{"desk":"/assets/images/site/desk-2.webp","door":"/assets/images/site/door-2.webp","shirt":"/assets/images/site/shirt-2.webp","card":"/assets/images/site/card-2.webp","phone":"/assets/images/site/phone-2.webp"},"brooklyn":{"desk":"/assets/images/site/desk-3.webp","door":"/assets/images/site/door-3.webp","shirt":"/assets/images/site/shirt-3.webp","card":"/assets/images/site/card-3.webp","phone":"/assets/images/site/phone-3.webp"},"revibe":{"desk":"/assets/images/site/desk-4.webp","door":"/assets/images/site/door-4.webp","shirt":"/assets/images/site/shirt-4.webp","card":"/assets/images/site/card-4.webp","phone":"/assets/images/site/phone-4.webp"},"wholemade":{"desk":"/assets/images/site/desk-5.webp","door":"/assets/images/site/door-5.webp","shirt":"/assets/images/site/shirt-5.webp","card":"/assets/images/site/card-5.webp","phone":"/assets/images/site/phone-5.webp"},"mfarm":{"desk":"/assets/images/site/desk-6.webp","door":"/assets/images/site/door-6.webp","shirt":"/assets/images/site/shirt-6.webp","card":"/assets/images/site/card-6.webp","phone":"/assets/images/site/phone-6.webp"},"southwest":{"desk":"/assets/images/site/desk-7.webp","door":"/assets/images/site/door-7.webp","shirt":"/assets/images/site/shirt-7.webp","card":"/assets/images/site/card-7.webp","phone":"/assets/images/site/phone-7.webp"},"andrew":{"desk":"/assets/images/site/desk-8.webp","door":"/assets/images/site/door-8.webp","shirt":"/assets/images/site/shirt-8.webp","card":"/assets/images/site/card-8.webp","phone":"/assets/images/site/phone-8.webp"}};
var CTXS = [["desk","Behind the front desk"],["door","On the door"],["shirt","On a shirt"],["card","Business card"],["phone","On a phone"]];
  var CTXK = ["own","kennedy","brooklyn","revibe","wholemade","mfarm","southwest","andrew"];
  function drawCtx(stage, k){
    var set = CTXP[k] || CTXP.own;
    stage.innerHTML = '<div class="ctx ctx--photo">' + CTXS.map(function(sc){
      return '<figure><img src="' + set[sc[0]] + '" alt="' + (NAME[k] || "The") +
             ' mark, ' + sc[1].toLowerCase() + '" loading="lazy">' +
             '<figcaption>' + sc[1] + '</figcaption></figure>';
    }).join("") + '</div>';
  }

  // 2. annotated homepage
  var PINS = [
    [26, 61, "A claim, not an adjective", "The first thing a stranger reads is something that can be checked. Top one percent is a fact about her. Passionate, dedicated and trusted are facts about nobody."],
    [80, 9, "The action sits in the nav", "Same two words in the nav, the hero and the footer. If somebody is ready thirty seconds in, they never have to go looking for the button."],
    [32, 72, "Explain the mechanism", "Know what the number supports promises how, not what. Every competitor can claim results. Far fewer will show you the working."],
    [24, 86, "The same action, in her voice", "Lowercase, soft, and repeated where the eye lands last. One action per page, asked for twice, in a register that still sounds like her."]
  ];
  function drawAnno(stage){
    stage.innerHTML = '<div style="width:100%"><div class="anno" id="annoWrap">' +
      '<img src="' + SHOTS.kAfter + '" alt="The Sold By Kennedy homepage" loading="lazy">' +
      PINS.map(function(pn, i){
        return '<button class="anno__pin" data-i="' + i + '" style="left:' + pn[0] + '%;top:' + pn[1] +
               '%;transform:translate(-50%,-50%)" aria-label="' + esc(pn[2]) + '">' + (i + 1) + '</button>';
      }).join("") +
      '</div><div class="anno__out" id="annoOut"></div></div>';
    var out = stage.querySelector("#annoOut");
    function show(i){
      out.innerHTML = '<h4>' + esc(PINS[i][2]) + '</h4><p>' + esc(PINS[i][3]) + '</p>';
      stage.querySelectorAll(".anno__pin").forEach(function(b){ b.classList.toggle("on", +b.dataset.i === i); });
    }
    stage.addEventListener("click", function(e){
      var b = e.target.closest(".anno__pin"); if (b) show(+b.dataset.i);
    });
    stage.addEventListener("mouseover", function(e){
      var b = e.target.closest(".anno__pin"); if (b) show(+b.dataset.i);
    });
    show(0);
  }

  // 3. search listing, fix by fix
  var FIX = [
    ["Title tag", "t"], ["Meta description", "d"], ["Structured data", "r"], ["Local pages", "m"]
  ];
  function drawSerp(stage, bar){
    stage.innerHTML = '<div class="serp">' +
      '<p class="serp__t" id="sT"></p>' +
      '<p class="serp__u">yourclinic.ca &#8250; mississauga</p>' +
      '<p class="serp__d" id="sD"></p>' +
      '<div class="serp__rich" id="sR"><span class="serp__stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span><span>Rating 4.9 &#183; Physiotherapy &#183; Open until 8pm</span></div>' +
      '<div class="serp__map" id="sM">' +
        '<div><b>A competitor on Dundas</b><span>1.8 km</span></div>' +
        '<div class="me"><b>Your Clinic, Mississauga</b><span>0.6 km</span></div>' +
        '<div><b>Another recovery studio</b><span>2.4 km</span></div>' +
      '</div></div>';
    var on = {t:false, d:false, r:false, m:false};
    var sT = stage.querySelector("#sT"), sD = stage.querySelector("#sD");
    var sR = stage.querySelector("#sR"), sM = stage.querySelector("#sM");
    function paint(){
      sT.textContent = on.t ? "Physiotherapy in Mississauga | Your Clinic"
                            : "Home | Your Clinic";
      sD.textContent = on.d ? "Physiotherapy, chiropractic and recovery in Mississauga. Same week appointments, direct billing, open until 8pm on weekdays."
                            : "Welcome to our website. We are a wellness company offering a range of services to help you feel your best. Learn more about us...";
      sR.classList.toggle("on", on.r);
      sM.classList.toggle("on", on.m);
    }
    bar.innerHTML = FIX.map(function(f){
      return '<button class="chipbtn" type="button" data-f="' + f[1] + '">' + f[0] + '</button>';
    }).join("") + '<button class="chipbtn" type="button" data-f="all">Turn them all on</button>';
    bar.addEventListener("click", function(e){
      var b = e.target.closest(".chipbtn"); if (!b) return;
      if (b.dataset.f === "all"){
        var any = !(on.t && on.d && on.r && on.m);
        on = {t:any, d:any, r:any, m:any};
        bar.querySelectorAll("[data-f]").forEach(function(x){ if (x.dataset.f !== "all") x.classList.toggle("on", any); });
        b.textContent = any ? "Reset" : "Turn them all on";
      } else {
        on[b.dataset.f] = !on[b.dataset.f];
        b.classList.toggle("on", on[b.dataset.f]);
      }
      paint();
    });
    paint();
  }

  // 4. the feed, in a phone
  function drawFeed(stage, bar){
    var posts = ["g_feed1","g_feed2","g_feed3","g_feed4","g_feed5","g_feed6","g_def"];
    var mode = "grid";
    function paint(){
      var inner = mode === "grid"
        ? '<div class="phone__grid">' + posts.slice(0,6).map(function(k){
            return '<img src="' + SHOTS[k] + '" alt="154 Consulting campaign post" loading="lazy">'; }).join("") + '</div>'
        : '<div class="phone__feed">' + posts.slice(0,2).map(function(k){
            return '<img src="' + SHOTS[k] + '" alt="154 Consulting campaign post" loading="lazy">'; }).join("") + '</div>';
      stage.innerHTML = '<div class="phone"><div class="phone__scr">' + inner + '</div></div>';
    }
    bar.innerHTML = '<button class="chipbtn on" type="button" data-m="grid">Grid</button>' +
                    '<button class="chipbtn" type="button" data-m="feed">Feed</button>';
    bar.addEventListener("click", function(e){
      var b = e.target.closest(".chipbtn"); if (!b) return;
      mode = b.dataset.m;
      bar.querySelectorAll(".chipbtn").forEach(function(x){ x.classList.toggle("on", x === b); });
      paint();
    });
    paint();
  }

  // 5. the same offer, two formats
  function drawAdp(stage, bar){
    var mode = "google";
    function paint(){
      stage.innerHTML = mode === "google"
        ? '<div class="adp"><div class="adp__g">' +
            '<p style="margin:0 0 4px"><span class="adp__tag">Sponsored</span><span style="font-size:12.5px;color:#1f7a3a">154consulting.ca</span></p>' +
            '<p class="serp__t" style="margin:0 0 4px">Brand and Website Studio in Ontario | Fixed Price, No Retainers</p>' +
            '<p class="serp__d">Brand systems and websites for service businesses. One fixed price agreed before we start. Book a twenty minute call.</p>' +
          '</div></div>'
        : '<div class="adp"><div class="adp__m">' +
            '<div class="adp__mh"><span></span><div><b>154 Consulting</b><i>Sponsored</i></div></div>' +
            '<img src="' + SHOTS.g_feed2 + '" alt="154 Consulting ad creative" loading="lazy">' +
            '<div class="adp__mf"><span>Your logo came from a cousin. It shows.</span><span class="adp__cta">Learn more</span></div>' +
          '</div></div>';
    }
    bar.innerHTML = '<button class="chipbtn on" type="button" data-m="google">Google search</button>' +
                    '<button class="chipbtn" type="button" data-m="meta">Meta feed</button>';
    bar.addEventListener("click", function(e){
      var b = e.target.closest(".chipbtn"); if (!b) return;
      mode = b.dataset.m;
      bar.querySelectorAll(".chipbtn").forEach(function(x){ x.classList.toggle("on", x === b); });
      paint();
    });
    paint();
  }

  // 6. find the constraint
  var CONS = [
    ["Not enough leads", "The top of the funnel is the constraint",
     "Everything downstream is fine and there are simply not enough people seeing you. That is a search and content problem before it is an ads problem, because search works on pages you already own and the cost does not stop when you stop paying.",
     "seo", "Start with search"],
    ["They don't convert", "The handover is the constraint",
     "People are arriving and leaving. Usually the site is describing the service rather than answering the question the visitor actually came with, and the enquiry has nowhere useful to land.",
     "website-design", "Start with the site"],
    ["Margins are too thin", "Positioning is the constraint",
     "When price is the only thing a stranger can compare you on, price is what they compare. That is a brand problem, and no amount of extra traffic fixes it. It usually gets worse with volume.",
     "brand-identity", "Start with the brand"],
    ["Can't deliver more", "Delivery is the constraint",
     "Growth would break you right now, so marketing is the wrong spend this quarter. The work is getting the repeatable parts written down and off your desk first.",
     null, "Talk it through"]
  ];
  function drawCons(stage, bar){
    bar.innerHTML = CONS.map(function(c, i){
      return '<button class="chipbtn' + (i === 0 ? " on" : "") + '" type="button" data-i="' + i + '">' + c[0] + '</button>';
    }).join("");
    stage.style.placeItems = "start";
    function show(i){
      var c = CONS[i];
      stage.innerHTML = '<div class="cons"><div class="cons__out"><h4>' + c[1] + '</h4><p>' + c[2] + '</p>' +
        '<a href="' + (c[3] ? "/services/" + c[3] + "/" : "/contact/") + '">' + c[4] + ' &#8594;</a></div></div>';
      bar.querySelectorAll(".chipbtn").forEach(function(x){ x.classList.toggle("on", +x.dataset.i === i); });
    }
    bar.addEventListener("click", function(e){
      var b = e.target.closest(".chipbtn"); if (b) show(+b.dataset.i);
    });
    show(0);
  }

  var WORDS = ["none of it","one piece","two pieces","three pieces","four pieces","five pieces","all of it"];
  document.querySelectorAll(".aud").forEach(function(aud){
    var sum = document.querySelector('.aud__sum[data-sum="' + aud.dataset.aud + '"]');
    if (!sum) return;
    var rows = [].slice.call(aud.querySelectorAll(".aud__row"));
    function paint(){
      var have = rows.filter(function(r){ return r.getAttribute("aria-pressed") === "true"; });
      var left = rows.length - have.length;
      var txt;
      if (have.length === 0){
        txt = 'Tick anything above that you already have, and this line will tell you what is left.';
      } else if (left === 0){
        txt = 'You have <b>all of it</b>. Then the brief is a review rather than a build, and the call is a short one.';
      } else {
        var names = rows.filter(function(r){ return r.getAttribute("aria-pressed") !== "true"; })
                        .map(function(r){ return r.querySelector(".aud__name").textContent.toLowerCase(); });
        var list = names.length > 1
          ? names.slice(0, -1).join(", ") + " and " + names[names.length - 1]
          : names[0];
        txt = 'You have <b>' + WORDS[have.length] + '</b>. That leaves ' + list + '.';
      }
      sum.innerHTML = '<p>' + txt + '</p>' +
        '<a class="btn btn--solid" href="/contact/">Talk through what is left</a>';
    }
    aud.addEventListener("click", function(e){
      var r = e.target.closest(".aud__row"); if (!r) return;
      r.setAttribute("aria-pressed", r.getAttribute("aria-pressed") === "true" ? "false" : "true");
      paint();
    });
    paint();
  });

  document.querySelectorAll(".mod__stage").forEach(function(stage){
    var bar = document.querySelector('.mod__bar[data-bar="' + stage.dataset.k + '"]');
    switch (stage.dataset.mod){
      case "ctx":
        bar.innerHTML = CTXK.map(function(k, i){
          return '<button class="chipbtn' + (i === 0 ? " on" : "") + '" type="button" data-c="' + k + '">' + NAME[k] + '</button>';
        }).join("");
        bar.addEventListener("click", function(e){
          var b = e.target.closest(".chipbtn"); if (!b) return;
          bar.querySelectorAll(".chipbtn").forEach(function(x){ x.classList.toggle("on", x === b); });
          drawCtx(stage, b.dataset.c);
        });
        drawCtx(stage, CTXK[0]);
        break;
      case "anno":  bar.remove(); drawAnno(stage); break;
      case "serp":  drawSerp(stage, bar); break;
      case "feed":  drawFeed(stage, bar); break;
      case "adp":   drawAdp(stage, bar); break;
      case "cons":  drawCons(stage, bar); break;
    }
  });
}
