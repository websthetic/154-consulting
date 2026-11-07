// Every page: the menu, the reading rail, and cards that are links as a whole.

export default function nav() {
  var bar = document.getElementById("nav"), burger = document.getElementById("burger");
  if (bar && burger) {
    burger.addEventListener("click", function(){
      burger.setAttribute("aria-expanded", String(bar.classList.toggle("is-open")));
    });
  }

  var rail = document.getElementById("rail");
  if (rail) {
    var onScroll = function(){
      var h = document.documentElement.scrollHeight - window.innerHeight;
      rail.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", onScroll, {passive:true});
    onScroll();
  }

  // A card can be clickable as a whole; the real link inside it is what search follows.
  document.addEventListener("click", function(e){
    var card = e.target.closest("[data-href]");
    if (!card || e.target.closest("a, button")) return;
    window.location.href = card.dataset.href;
  });
}
