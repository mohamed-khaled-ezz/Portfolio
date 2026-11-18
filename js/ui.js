/* UI behaviour that must work without GSAP: nav, project links, details panel, form, cursor, clock. */
(() => {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const body = document.body, esc = s => String(s).replace(/[&<>"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
  $("#yr").textContent = new Date().getFullYear();
  const cv = $("#download-cv");
  if (cv && window.CV_URL) {
    cv.href = window.CV_URL;
  }
  const clock = $("#clock"), tick = () => { clock.textContent = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Cairo" }).format(new Date()); };
  tick(); setInterval(tick, 30000);

  /* navigation */
  const burger = $("#burger"), drawer = $("#drawer"), isOpen = () => drawer.classList.contains("open");
  const setMenu = open => {
    drawer.classList.toggle("open", open); drawer.toggleAttribute("inert", !open); drawer.setAttribute("aria-hidden", String(!open));
    burger.setAttribute("aria-expanded", String(open)); burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    body.classList.toggle("menu-open", open); body.classList.toggle("locked", open);
    if (open) $("a", drawer).focus({ preventScroll: true });
  };
  burger.addEventListener("click", () => setMenu(!isOpen()));
  $$("a", drawer).forEach(a => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", e => { if (e.key === "Escape" && isOpen()) { setMenu(false); burger.focus(); } });
  matchMedia("(min-width:960px)").addEventListener("change", e => { if (e.matches && isOpen()) setMenu(false); });
  const links = $$(".menu-d a");
  const spy = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return;
    links.forEach(l => { const on = l.hash === "#" + e.target.id; l.classList.toggle("active", on); on ? l.setAttribute("aria-current", "true") : l.removeAttribute("aria-current"); }); }),
    { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach(s => spy.observe(s));

  /* projects: configurable links + details panel */
  $$(".case").forEach(c => {
    const cfg = (window.PROJECTS || {})[c.dataset.project] || {};
    $$("[data-link]", c).forEach(a => {
      const url = (cfg[a.dataset.link] || "").trim();
      if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer"; a.removeAttribute("aria-disabled"); a.removeAttribute("role"); }
      else { a.setAttribute("title", "Not configured yet — set the URL in js/config.js"); a.addEventListener("click", e => e.preventDefault()); }
    });
  });
  const dlg = $("#pdlg"), pb = $("#pd-body");
  const openProject = key => {
    const d = (window.PROJECTS || {})[key]; if (!d) return;
    const n = $$(".case").findIndex(c => c.dataset.project === key) + 1;
    const shots = d.screenshots.length ? `<div class="shots-g">${d.screenshots.map(s => `<img src="${esc(s)}" alt="${esc(d.title)} screenshot" loading="lazy">`).join("")}</div>`
      : `<p class="shots">No screenshots added yet. Add image paths to <code>screenshots</code> in <code>js/config.js</code>.</p>`;
    pb.innerHTML = `<p class="case-n">Project 0${n} / 04</p><h3 id="pd-title">${esc(d.title)}</h3><p>${esc(d.description)}</p>
      <h4>Features</h4><ul class="feat">${d.features.map(f => `<li>${esc(f)}</li>`).join("")}</ul>
      <h4>Technologies</h4><ul class="tags">${d.tech.map(t => `<li>${esc(t)}</li>`).join("")}</ul><h4>Screenshots</h4>${shots}`;
    dlg.showModal(); body.classList.add("locked"); $(".pd", dlg).scrollTop = 0;
  };
  $$("[data-open]").forEach(b => b.addEventListener("click", () => openProject(b.dataset.open)));
  $("[data-close]", dlg).addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => body.classList.toggle("locked", isOpen()));

  /* contact form → mail app */
  const form = $("#form"), st = $("#status");
  form.addEventListener("submit", e => {
    e.preventDefault(); $$("input,textarea", form).forEach(i => i.classList.add("t"));
    if (!form.checkValidity()) { st.textContent = "Please complete every field."; return; }
    const d = new FormData(form);
    location.href = `mailto:${window.CONTACT_EMAIL}?subject=${encodeURIComponent("Message from " + d.get("name"))}&body=${encodeURIComponent(d.get("message") + "\n\n— " + d.get("name") + " (" + d.get("email") + ")")}`;
    st.textContent = "Opening your email app…";
  });

  /* cursor: mouse only */
  if (matchMedia("(hover:hover) and (pointer:fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const c = $("#cursor"); let x = 0, y = 0, tx = 0, ty = 0;
    addEventListener("mousemove", e => { tx = e.clientX; ty = e.clientY; c.style.opacity = 1; }, { passive: true });
    (function f() { x += (tx - x) * .25; y += (ty - y) * .25; c.style.transform = `translate(${x}px,${y}px)`; requestAnimationFrame(f); })();
    $$("a,button,.tile,.tk,.case-pv").forEach(el => { el.addEventListener("mouseenter", () => c.classList.add("big")); el.addEventListener("mouseleave", () => c.classList.remove("big")); });
  }
})();
