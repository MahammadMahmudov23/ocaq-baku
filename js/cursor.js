/* OCAQ — Custom ember cursor + magnetic elements (desktop only) */
(function () {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const dot = document.querySelector('.cur-dot');
  const ring = document.querySelector('.cur-ring');
  if (!dot || !ring) return;

  let dx = -100, dy = -100, rx = -100, ry = -100;
  const lerp = (a, b, n) => a + (b - a) * n;

  function loop() {
    rx = lerp(rx, dx, 0.14); ry = lerp(ry, dy, 0.14);
    dot.style.transform  = `translate(${dx}px, ${dy}px) translate(-50%,-50%)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  window.addEventListener('mousemove', e => { dx = e.clientX; dy = e.clientY; });
  const hov = 'a, button, [data-cursor], .dish, .m-item';
  document.addEventListener('mouseover', e => { if (e.target.closest(hov)) ring.classList.add('hover'); });
  document.addEventListener('mouseout',  e => { if (e.target.closest(hov)) ring.classList.remove('hover'); });
  document.addEventListener('mousedown', () => ring.classList.add('down'));
  document.addEventListener('mouseup',   () => ring.classList.remove('down'));

  if (window.gsap) {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      const s = parseFloat(el.dataset.magnetic) || 0.3;
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * s, y: (e.clientY - r.top - r.height / 2) * s, duration: 0.4, ease: 'power2.out' });
      });
      el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' }));
    });
  }
})();
