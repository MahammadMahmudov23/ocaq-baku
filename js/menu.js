/* OCAQ — Menu filter with animated category transitions */
(function () {
  const btns = document.querySelectorAll('.m-filter');
  const cats = document.querySelectorAll('.m-cat');
  if (!btns.length) return;

  function show(target) {
    const toShow = target === 'all' ? cats : document.querySelectorAll(`[data-cat="${target}"]`);
    cats.forEach(c => { if (!Array.from(toShow).includes(c)) c.classList.add('hidden'); });
    toShow.forEach(c => {
      c.classList.remove('hidden');
      if (window.gsap) {
        gsap.fromTo(c, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
        gsap.fromTo(c.querySelectorAll('.m-item'), { opacity: 0, x: -14 },
          { opacity: 1, x: 0, duration: 0.45, stagger: 0.035, ease: 'power3.out', delay: 0.08 });
      }
    });
  }

  btns.forEach(b => b.addEventListener('click', () => {
    btns.forEach(x => { x.classList.remove('active'); x.setAttribute('aria-selected', 'false'); });
    b.classList.add('active'); b.setAttribute('aria-selected', 'true');
    show(b.dataset.filter);
  }));

  /* initial stagger */
  if (window.gsap) {
    gsap.fromTo(document.querySelectorAll('.m-cat:not(.hidden) .m-item'),
      { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.55, stagger: 0.035, ease: 'power3.out', delay: 0.3 });
  }
})();
