/* OCAQ — Motion: hero intro, scroll reveals, fire-edge wipes,
   the "Into the Fire" pinned sequence, kinetic headings, nav state. */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = !!window.gsap;
  if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  function init() {
    observeReveals();
    if (reduce || !hasGsap) return;
    heroIntro();
    fireReveals();
    parallax();
    intoTheFire();
  }

  if (document.body.classList.contains('loaded')) init();
  else { window.addEventListener('ocaq:ready', init, { once: true }); setTimeout(init, 2700); }

  /* Reveal-on-scroll (CSS-class driven; works without GSAP) */
  function observeReveals() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.rv, .rv-l, .rv-r, .k-line').forEach(el => io.observe(el));
  }

  /* Hero intro timeline */
  function heroIntro() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const tl = gsap.timeline({ delay: 0.15 });
    const loc = hero.querySelector('.hero-loc');
    const inners = hero.querySelectorAll('.hero-title .ln i');
    const sub = hero.querySelector('.hero-sub');
    const cta = hero.querySelector('.hero-cta');
    const hint = hero.querySelector('.hero-scroll');
    if (loc) tl.to(loc, { opacity: 1, duration: 0.7, ease: 'power2.out' });
    if (inners.length) tl.to(inners, { y: '0%', duration: 1.15, stagger: 0.1, ease: 'power4.out' }, '-=0.35');
    if (sub) tl.to(sub, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5');
    if (cta) tl.to(cta, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4');
    if (hint) tl.to(hint, { opacity: 1, duration: 0.7 }, '-=0.2');
  }

  /* Fire-edge clip reveals: wipe + travelling ember flare */
  function fireReveals() {
    if (!window.ScrollTrigger) return;
    document.querySelectorAll('.fire-reveal').forEach(el => {
      const flare = el.querySelector('.flare');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 82%', once: true }
      });
      if (flare) {
        tl.set(flare, { left: '0%', opacity: 1 })
          .to(el, { clipPath: 'inset(0 0% 0 0)', duration: 1.25, ease: 'power3.inOut' }, 0)
          .to(flare, { left: '100%', duration: 1.25, ease: 'power3.inOut' }, 0)
          .to(flare, { opacity: 0, duration: 0.3 }, 1.0);
      } else {
        tl.to(el, { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power3.inOut' });
      }
    });
  }

  /* Subtle parallax on tagged media */
  function parallax() {
    if (!window.ScrollTrigger) return;
    document.querySelectorAll('[data-parallax]').forEach(el => {
      const amt = parseFloat(el.dataset.parallax) || 0.12;
      gsap.to(el, { yPercent: amt * 100, ease: 'none',
        scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }

  /* THE SIGNATURE: Into the Fire — pinned, scroll-scrubbed flame sequence */
  function intoTheFire() {
    const sec = document.getElementById('fire');
    if (!sec || !window.ScrollTrigger) return;
    const flame = sec.querySelector('.fire-flame');
    const stages = gsap.utils.toArray(sec.querySelectorAll('.fire-stage'));
    const bars = gsap.utils.toArray(sec.querySelectorAll('.fire-progress i b'));
    if (!stages.length) return;

    gsap.set(stages, { opacity: 0, y: 30 });
    gsap.set(stages[0], { opacity: 1, y: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sec,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
      }
    });

    // Flame grows steadily across the whole sequence
    if (flame) tl.fromTo(flame,
      { scaleY: 0.35, scaleX: 0.7, opacity: 0.18 },
      { scaleY: 1.12, scaleX: 1.05, opacity: 0.6, ease: 'power1.in', duration: stages.length },
      0);

    stages.forEach((st, i) => {
      const at = i;
      if (bars[i]) tl.fromTo(bars[i], { width: '0%' }, { width: '100%', duration: 1, ease: 'none' }, at);
      if (i > 0) {
        tl.to(stages[i - 1], { opacity: 0, y: -30, duration: 0.4 }, at);
        tl.fromTo(st, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4 }, at + 0.1);
      }
    });
  }

  /* Nav scrolled state */
  (function () {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 70);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  /* WhatsApp float entrance */
  (function () {
    const wa = document.querySelector('.wa');
    if (wa) setTimeout(() => wa.classList.add('show'), 2800);
  })();
})();
