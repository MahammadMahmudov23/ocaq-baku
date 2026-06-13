/* OCAQ — Preloader: the wordmark rises, an ember line ignites, curtain lifts */
(function () {
  const pre = document.getElementById('preloader');
  if (!pre) return;

  const chars = pre.querySelectorAll('.pl-mark .ch');
  const line  = pre.querySelector('.pl-line');
  const tag   = pre.querySelector('.pl-tag');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function finish() {
    document.body.classList.add('loaded');
    window.dispatchEvent(new CustomEvent('ocaq:ready'));
  }

  function run() {
    if (reduce || !window.gsap) {
      pre.style.display = 'none';
      finish();
      return;
    }
    const tl = gsap.timeline({ onComplete: () => { pre.style.display = 'none'; finish(); } });
    tl.to(chars, { y: '0%', duration: 0.9, stagger: 0.06, ease: 'power4.out', delay: 0.15 })
      .to(line, { width: 200, duration: 0.7, ease: 'power2.inOut' }, '-=0.25')
      .to(tag,  { opacity: 1, duration: 0.5 }, '-=0.35')
      .to({}, { duration: 0.45 })
      .to(pre, { clipPath: 'inset(0 0 100% 0)', duration: 0.95, ease: 'power4.inOut' });
  }

  if (window.gsap) run();
  else window.addEventListener('load', run);
})();
