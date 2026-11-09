(function () {
  "use strict";

  var CONTACT_EMAIL = "hello@spottechai.com";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- Hero headline: split into animated words ---------- */
  var title = document.querySelector("[data-split]");
  if (title) {
    var i = 0;
    var splitNode = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            var w = document.createElement("span");
            w.className = "w";
            var inner = document.createElement("span");
            inner.textContent = part;
            inner.style.setProperty("--i", i++);
            w.appendChild(inner);
            frag.appendChild(w);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== "BR") {
          splitNode(child);
        }
      });
    };
    title.setAttribute("aria-label", title.textContent.replace(/\s+/g, " ").trim());
    splitNode(title);
    Array.prototype.forEach.call(title.querySelectorAll(".w"), function (w) { w.setAttribute("aria-hidden", "true"); });
  }

  /* ---------- Header, progress bar, timeline, active link (one scroll loop) ---------- */
  var header = document.querySelector(".site-header");
  var progress = document.querySelector(".scroll-progress");
  var timeline = document.querySelector(".timeline");
  var tlFill = document.querySelector(".tl-fill");
  var tlSteps = document.querySelectorAll(".tl-step");
  var navLinks = document.querySelectorAll('.nav-menu a[href^="#"]:not(.btn)');
  var sections = Array.prototype.map.call(navLinks, function (a) { return document.querySelector(a.getAttribute("href")); });

  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    var vh = window.innerHeight;
    var max = document.documentElement.scrollHeight - vh;

    header.classList.toggle("scrolled", y > 20);
    progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";

    if (timeline) {
      var r = timeline.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (vh * 0.75 - r.top) / (r.height + vh * 0.25)));
      tlFill.style.setProperty("--p", p.toFixed(3));
      var vertical = window.innerWidth <= 900;
      Array.prototype.forEach.call(tlSteps, function (step, idx) {
        var lit = vertical
          ? step.getBoundingClientRect().top < vh * 0.75
          : p >= idx / tlSteps.length + 0.02;
        step.classList.toggle("lit", lit);
      });
    }

    var current = -1;
    sections.forEach(function (sec, idx) {
      if (sec && sec.getBoundingClientRect().top < vh * 0.4) current = idx;
    });
    Array.prototype.forEach.call(navLinks, function (a, idx) { a.classList.toggle("active", idx === current); });

    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  }
  toggle.addEventListener("click", function () { setMenu(!menu.classList.contains("open")); });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("resize", function () { if (window.innerWidth > 900) setMenu(false); });

  /* ---------- Scroll reveal with sibling stagger ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.classList.contains("reveal"); });
        var delay = Math.min(siblings.indexOf(el), 8) * 70;
        el.style.setProperty("--rd", delay + "ms");
        el.classList.add("visible");
        io.unobserve(el);
        // hand control back to the element's own hover transitions once revealed
        setTimeout(function () {
          el.classList.remove("reveal", "visible");
          el.style.removeProperty("--rd");
        }, delay + 1100);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Card cursor spotlight ---------- */
  if (finePointer) {
    document.querySelectorAll(".card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--x", e.clientX - r.left + "px");
        card.style.setProperty("--y", e.clientY - r.top + "px");
      });
    });
  }

  /* ---------- Hero: glow follows cursor + particle network ---------- */
  var hero = document.querySelector(".hero");
  var canvas = document.querySelector(".hero-canvas");
  var mouse = { x: -9999, y: -9999 };

  if (hero && finePointer && !reduceMotion) {
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      hero.style.setProperty("--mx", mouse.x + "px");
      hero.style.setProperty("--my", mouse.y + "px");
    });
    hero.addEventListener("pointerleave", function () { mouse.x = mouse.y = -9999; });
  }

  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, pts = [], running = false, rafId = 0;
    var LINK = 140;

    var resize = function () {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.min(90, Math.round((W * H) / 16000));
      pts = [];
      for (var k = 0; k < count; k++) {
        pts.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.4 + 0.6
        });
      }
      if (reduceMotion) draw();
    };

    var draw = function () {
      ctx.clearRect(0, 0, W, H);
      for (var a = 0; a < pts.length; a++) {
        var p = pts[a];
        if (!reduceMotion) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
          var mdx = mouse.x - p.x, mdy = mouse.y - p.y, md = Math.sqrt(mdx * mdx + mdy * mdy);
          if (md < 180) { p.x += mdx * 0.004; p.y += mdy * 0.004; }
        }
        for (var b = a + 1; b < pts.length; b++) {
          var q = pts[b], dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
          if (d < LINK * LINK) {
            ctx.strokeStyle = "rgba(45,176,164," + (1 - Math.sqrt(d) / LINK) * 0.22 + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        ctx.fillStyle = "rgba(160,230,222,.55)";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
    };

    var loop = function () { draw(); rafId = requestAnimationFrame(loop); };
    var start = function () { if (!running && !reduceMotion) { running = true; loop(); } };
    var stop = function () { running = false; cancelAnimationFrame(rafId); };

    resize();
    window.addEventListener("resize", function () { resize(); });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) { e[0].isIntersecting ? start() : stop(); }).observe(hero);
    } else { start(); }
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
  }

  /* ---------- Contact form → opens email app with message prefilled ---------- */
  var form = document.getElementById("contact-form");
  var status = form.querySelector(".form-status");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var valid = true;
    ["name", "email", "message"].forEach(function (id) {
      var input = form.elements[id];
      var v = input.value.trim();
      var ok = v !== "" && (id !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
      input.closest(".field").classList.toggle("invalid", !ok);
      if (!ok) valid = false;
    });

    if (!valid) {
      status.textContent = "Please add your name, a valid email and a short message.";
      status.className = "form-status err";
      return;
    }

    var name = form.elements.name.value.trim();
    var company = form.elements.company.value.trim();
    var interest = form.elements.interest.value;
    var subject = "Project enquiry: " + interest + " — " + name + (company ? " (" + company + ")" : "");
    var body =
      "Name: " + name + "\n" +
      "Email: " + form.elements.email.value.trim() + "\n" +
      (company ? "Company: " + company + "\n" : "") +
      "Interested in: " + interest + "\n\n" +
      form.elements.message.value.trim();

    window.location.href = "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

    status.textContent = "Opening your email app… If nothing happens, email us at " + CONTACT_EMAIL + ".";
    status.className = "form-status ok";
  });

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
