/* OCAQ — Lenis smooth scroll, mobile nav, anchor scroll, page transitions */
(function () {
  let lenis = null;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Lenis smooth scroll */
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ duration: 1.4, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, wheelMultiplier: 0.9 });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    if (window.ScrollTrigger) lenis.on('scroll', ScrollTrigger.update);
  }

  /* Mobile nav overlay */
  const toggle = document.querySelector('.nav-toggle');
  const overlay = document.querySelector('.nav-overlay');
  const ovLinks = document.querySelectorAll('.ov-link');
  if (toggle && overlay) {
    toggle.addEventListener('click', () => {
      const open = overlay.classList.toggle('open');
      toggle.classList.toggle('open', open);
      document.body.classList.toggle('lock', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      ovLinks.forEach((l, i) => { l.style.transitionDelay = open ? `${0.12 + i * 0.07}s` : '0s'; });
    });
    ovLinks.forEach(l => l.addEventListener('click', () => {
      overlay.classList.remove('open'); toggle.classList.remove('open');
      document.body.classList.remove('lock'); toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  /* Active nav link */
  (function () {
    const cur = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(l => {
      const href = l.getAttribute('href');
      if (href === cur || (cur === '' && href === 'index.html')) l.classList.add('active');
    });
  })();

  /* Language switching is handled by js/i18n.js */

  /* Smooth anchor scrolling */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -80, duration: 1.4 });
      else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* Page transitions (fade up an ember curtain between pages) */
  const trans = document.querySelector('.page-trans');
  if (trans && window.gsap && !reduce) {
    gsap.set(trans, { scaleY: 1, transformOrigin: 'top' });
    gsap.to(trans, { scaleY: 0, duration: 0.7, ease: 'power3.inOut', onComplete: () => gsap.set(trans, { clearProps: 'all' }) });

    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') ||
          href.startsWith('tel') || href.startsWith('https://wa.me') || link.target === '_blank') return;
      link.addEventListener('click', e => {
        e.preventDefault();
        gsap.set(trans, { transformOrigin: 'bottom' });
        gsap.to(trans, { scaleY: 1, duration: 0.5, ease: 'power3.in', onComplete: () => { window.location.href = href; } });
      });
    });
  }
})();
