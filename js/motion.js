/* Motion system (GSAP + ScrollTrigger). The site is fully usable if this never runs. */
(() => {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const loader = $("#loader"), hide = () => { if (loader) loader.style.display = "none"; };
  if (!window.gsap || !window.ScrollTrigger) { hide(); return; }
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: reduce)", hide);

  /* ---------- everything animated (motion allowed) ---------- */
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const once = (trigger, start = "top 85%") => ({ trigger, start, once: true });

    /* 1 — loader: name fills with spray, curtain lifts, hero lands */
    const ldf = $("#ldf"), ldn = $("#ldn"), p = { v: 0 };
    gsap.set(".neon-art .nt path, .doodle .nt path, .uline .nt path", { strokeDashoffset: 1 });
    gsap.set(".hero .ln > span", { yPercent: 108 });
    gsap.set(".slab", { scale: 1.4, autoAlpha: 0 });
    gsap.set(".neon-art circle", { scale: 0, transformOrigin: "center" });
    gsap.set([".hero-top", ".lede", ".cta"], { autoAlpha: 0, y: 24 });
    const intro = () => gsap.timeline()
      .to(p, { v: 100, duration: 1.2, ease: "power2.inOut", onUpdate: () => { ldf.style.setProperty("--p", p.v); ldn.textContent = String(Math.round(p.v)).padStart(3, "0"); } })
      .to(loader, { yPercent: -100, duration: .9, ease: "power4.inOut", onComplete: hide })
      .to(".hero .ln > span", { yPercent: 0, stagger: .14, duration: 1.1, ease: "expo.out" }, "-=.35")
      .to(".neon-art .nt path", { strokeDashoffset: 0, duration: 1.6, stagger: .06, ease: "power2.inOut" }, "-=.7")
      .to(".neon-art circle", { scale: 1, stagger: .1, duration: .4, ease: "back.out(3)" }, "-=.5")
      .to(".slab", { scale: 1, autoAlpha: 1, duration: .6, ease: "power4.out" }, "-=.4")
      .to([".hero-top", ".lede", ".cta"], { autoAlpha: 1, y: 0, stagger: .1, duration: .7 }, "-=.9");
    document.readyState === "complete" ? intro() : addEventListener("load", intro, { once: true });

    gsap.to("#progress", { scaleX: 1, ease: "none", scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: .2 } });

    /* 2 — headings: masked line reveals */
    $$(".h2,.mega").forEach(h => gsap.from($$(".mask>span", h), { yPercent: 110, stagger: .12, duration: 1, ease: "expo.out", scrollTrigger: once(h, "top 88%") }));
    $$(".kicker").forEach(k => gsap.from(k, { x: -30, autoAlpha: 0, duration: .7, scrollTrigger: once(k, "top 92%") }));

    /* 3 — about: statement rises, marker underline draws, stamp slams down */
    gsap.from(".statement", { y: 40, autoAlpha: 0, duration: .9, ease: "power3.out", scrollTrigger: once(".statement") });
    gsap.to(".uline .nt path", { strokeDashoffset: 0, duration: 1, ease: "power2.out", scrollTrigger: once(".statement", "top 70%") });
    gsap.to(".doodle .nt path", { strokeDashoffset: 0, duration: 1.4, stagger: .08, scrollTrigger: once(".contact", "top 60%") });
    gsap.from(".about-p,.about-facts li", { y: 26, autoAlpha: 0, stagger: .1, duration: .8, scrollTrigger: once(".about-p") });
    gsap.from(".stamp", { scale: 1.5, rotate: 12, autoAlpha: 0, duration: .7, ease: "power4.in", clearProps: "scale,rotate", scrollTrigger: once(".stamp", "top 85%") });

    /* 4 — skills: elements stamp in group by group */
    $$(".grp").forEach(g => {
      gsap.from($("h3", g), { xPercent: -40, autoAlpha: 0, duration: .6, scrollTrigger: once(g, "top 90%") });
      gsap.from($$(".tile", g), { scale: .5, autoAlpha: 0, rotate: -8, stagger: .08, duration: .55, ease: "back.out(2)", clearProps: "transform", scrollTrigger: once(g, "top 88%") });
    });
    gsap.from(".pro li", { y: 30, autoAlpha: 0, stagger: .12, duration: .7, scrollTrigger: once(".pro", "top 92%") });

    /* 5 — experience: the spray line draws with scroll, slips slide in */
    gsap.from(".tl-line", { scaleY: 0, ease: "none", scrollTrigger: { trigger: ".tl", start: "top 75%", end: "bottom 60%", scrub: .4 } });
    $$(".job").forEach((j, i) => {
      gsap.from($(".slip", j), { x: 60, rotate: i % 2 ? 2 : -2, autoAlpha: 0, duration: .9, ease: "power3.out", scrollTrigger: once(j, "top 82%") });
      gsap.from($(".yr", j), { xPercent: -30, autoAlpha: 0, duration: .9, ease: "power3.out", scrollTrigger: once(j, "top 82%") });
    });

    /* 6 — projects: each poster wipes in, preview parts fly in */
    $$(".case").forEach(c => {
      const pv = $(".pv", c);
      gsap.from(pv, { clipPath: "inset(0 100% 0 0)", duration: 1.1, ease: "expo.out", scrollTrigger: once(c, "top 78%") });
      gsap.from($$(".pv > :not(.tg)", c), { y: 60, autoAlpha: 0, stagger: .1, duration: .8, ease: "back.out(1.4)", delay: .25, scrollTrigger: once(c, "top 78%") });
      gsap.from($$(".case-tx > *", c), { y: 30, autoAlpha: 0, stagger: .08, duration: .8, ease: "power3.out", scrollTrigger: once(c, "top 76%") });
    });

    /* 7 — certificates + contact */
    gsap.from(".tk", { y: 70, rotate: () => gsap.utils.random(-6, 6), autoAlpha: 0, stagger: .14, duration: .9, ease: "power3.out", clearProps: "transform", scrollTrigger: once(".tickets", "top 85%") });
    gsap.from(".c-list li,.paper-form > *:not(.tape)", { y: 36, autoAlpha: 0, stagger: .07, duration: .8, scrollTrigger: once(".c-grid", "top 85%") });
    gsap.from(".foot-name span", { yPercent: 100, stagger: .12, duration: 1, ease: "expo.out", scrollTrigger: once(".foot", "top 95%") });

  });

  /* ---------- desktop with mouse: parallax and magnetic buttons ---------- */
  mm.add("(min-width:960px) and (hover:hover) and (prefers-reduced-motion: no-preference)", () => {
    gsap.to(".hero .l1", { xPercent: -4, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero .l2", { xPercent: 4, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".neon-art", { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    $$(".yr").forEach(y => gsap.to(y, { y: -40, ease: "none", scrollTrigger: { trigger: y.closest(".job"), scrub: true } }));
    $$(".case .pv").forEach(v => gsap.fromTo(v, { yPercent: 5 }, { yPercent: -5, ease: "none", scrollTrigger: { trigger: v.closest(".case"), start: "top bottom", end: "bottom top", scrub: true } }));
    const off = $$(".magnetic").map(b => {
      const mv = e => { const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .3 }); };
      const lv = () => gsap.to(b, { x: 0, y: 0, duration: .7, ease: "elastic.out(1,.4)" });
      b.addEventListener("mousemove", mv); b.addEventListener("mouseleave", lv);
      return () => { b.removeEventListener("mousemove", mv); b.removeEventListener("mouseleave", lv); gsap.set(b, { clearProps: "transform" }); };
    });
    return () => off.forEach(f => f());
  });

  const refresh = () => ScrollTrigger.refresh();
  document.fonts && document.fonts.ready.then(refresh);
  addEventListener("load", () => setTimeout(refresh, 300));
  setTimeout(hide, 7000);
})();
