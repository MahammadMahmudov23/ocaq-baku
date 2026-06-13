/* OCAQ — Hero ember field
   Lightweight 2D canvas particle system: rising embers + sparks.
   Tuned to be smooth on any device; degrades gracefully (no canvas / reduced motion). */
(function () {
  const canvas = document.getElementById('ember-canvas');
  if (!canvas) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  let particles = [];
  let raf = null;
  let running = false;
  let mouseX = 0.5;

  // Ember palette (warm → bright)
  const palette = [
    [255, 122, 46],
    [240, 80, 28],
    [201, 16, 47],
    [232, 176, 75],
    [244, 213, 138],
  ];

  function count() {
    const w = window.innerWidth;
    if (w < 600) return 38;
    if (w < 1100) return 64;
    return 96;
  }

  function resize() {
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn(initial) {
    const col = palette[(Math.random() * palette.length) | 0];
    return {
      x: Math.random() * W,
      y: initial ? Math.random() * H : H + Math.random() * 60,
      r: 0.6 + Math.random() * 2.2,
      vy: 0.25 + Math.random() * 0.9,
      drift: (Math.random() - 0.5) * 0.4,
      phase: Math.random() * Math.PI * 2,
      life: 0,
      maxLife: 220 + Math.random() * 320,
      col,
      glow: 0.4 + Math.random() * 0.6,
    };
  }

  function build() {
    particles = [];
    const n = count();
    for (let i = 0; i < n; i++) particles.push(spawn(true));
  }

  let t = 0;
  function frame() {
    raf = requestAnimationFrame(frame);
    t += 0.016;
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.life++;
      p.y -= p.vy;
      p.x += p.drift + Math.sin(t * 0.7 + p.phase) * 0.25 + (mouseX - 0.5) * 0.3;

      const lifeRatio = p.life / p.maxLife;
      const fade = lifeRatio < 0.12 ? lifeRatio / 0.12 : (1 - lifeRatio);
      const a = Math.max(0, Math.min(1, fade)) * p.glow;

      if (p.y < -20 || p.life > p.maxLife) {
        particles[i] = spawn(false);
        continue;
      }

      const [r, g, b] = p.col;
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      grad.addColorStop(0, `rgba(${r},${g},${b},${a})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  function start() {
    if (running || reduce) return;
    running = true;
    resize();
    build();
    frame();
  }
  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  // Reduced motion: paint one calm static field, no animation
  function staticPaint() {
    resize();
    build();
    ctx.globalCompositeOperation = 'lighter';
    particles.forEach(p => {
      const [r, g, b] = p.col;
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      grad.addColorStop(0, `rgba(${r},${g},${b},${0.4 * p.glow})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalCompositeOperation = 'source-over';
  }

  window.addEventListener('resize', () => { resize(); build(); }, { passive: true });
  window.addEventListener('mousemove', e => { mouseX = e.clientX / window.innerWidth; }, { passive: true });
  document.addEventListener('visibilitychange', () => { document.hidden ? stop() : (running || reduce ? null : start()); });

  if (reduce) { staticPaint(); return; }

  if (document.body.classList.contains('loaded')) start();
  else { window.addEventListener('ocaq:ready', start, { once: true }); setTimeout(start, 2600); }
})();
