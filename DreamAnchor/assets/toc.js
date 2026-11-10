// Highlights the current section in the "On this page" list. Optional: pages work without it.
(function () {
  var links = document.querySelectorAll(".da-toc a[href^='#']");
  if (!links.length || !("IntersectionObserver" in window)) return;

  var map = {};
  var headings = [];
  Array.prototype.forEach.call(links, function (a) {
    var h = document.getElementById(a.getAttribute("href").slice(1));
    if (h) { map[h.id] = a; headings.push(h); }
  });

  function setActive(id) {
    Array.prototype.forEach.call(links, function (a) { a.classList.remove("active"); a.removeAttribute("aria-current"); });
    if (map[id]) { map[id].classList.add("active"); map[id].setAttribute("aria-current", "location"); }
  }

  var visible = {};
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
    for (var i = 0; i < headings.length; i++) {
      if (visible[headings[i].id]) { setActive(headings[i].id); return; }
    }
  }, { rootMargin: "-80px 0px -65% 0px" });

  headings.forEach(function (h) { io.observe(h); });
})();
