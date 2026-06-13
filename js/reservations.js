/* OCAQ — Reservation form: validate, then compose a pre-filled WhatsApp message.
   REPLACE waNumber below with the restaurant's real WhatsApp number (digits only). */
(function () {
  // *** REPLACE: real WhatsApp number, digits only (country code + number) ***
  const waNumber = '994000000000';

  const form = document.getElementById('res-form');
  const confirm = document.getElementById('res-confirm');
  if (!form) return;

  // Localized string lookup (falls back to the key if i18n isn't ready)
  const t = (k) => (window.OCAQ_I18N ? window.OCAQ_I18N.t(k) : k);

  const empty = v => !v || !v.trim();
  const phoneOk = v => /^[\d\s+\-()]{7,20}$/.test(v.trim());
  const dateOk = v => { const d = new Date(v + 'T00:00:00'); return !isNaN(d) && d >= new Date(new Date().toDateString()); };

  function showErr(el, msg) {
    el.classList.add('err');
    const m = el.parentElement.querySelector('.f-msg');
    if (m) { m.textContent = msg; m.classList.add('show'); }
  }
  function clearErr(el) {
    el.classList.remove('err');
    const m = el.parentElement.querySelector('.f-msg');
    if (m) m.classList.remove('show');
  }

  form.querySelectorAll('.f-input, .f-select, .f-area').forEach(el => {
    el.addEventListener('input', () => clearErr(el));
    el.addEventListener('change', () => clearErr(el));
  });

  const dateEl = form.querySelector('#date');
  if (dateEl) {
    const d = new Date();
    dateEl.min = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    const f = id => form.querySelector('#' + id);
    const name = f('name'), phone = f('phone'), date = f('date'), time = f('time'),
          guests = f('guests'), occasion = f('occasion'), notes = f('notes');

    if (empty(name.value)) { showErr(name, t('err_name')); ok = false; }
    if (empty(phone.value) || !phoneOk(phone.value)) { showErr(phone, t('err_phone')); ok = false; }
    if (empty(date.value) || !dateOk(date.value)) { showErr(date, t('err_date')); ok = false; }
    if (empty(time.value)) { showErr(time, t('err_time')); ok = false; }
    if (empty(guests.value)) { showErr(guests, t('err_guests')); ok = false; }
    if (!ok) return;

    const dObj = new Date(date.value + 'T00:00:00');
    const dStr = dObj.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const occ = occasion && occasion.value ? `\nOccasion: ${occasion.value}` : '';
    const note = notes && notes.value.trim() ? `\nNotes: ${notes.value.trim()}` : '';

    const text = encodeURIComponent(
`Salam! I'd like to reserve a table at OCAQ.

Name: ${name.value.trim()}
Phone: ${phone.value.trim()}
Date: ${dStr}
Time: ${time.value}
Guests: ${guests.value}${occ}${note}

Please confirm. Çox sağ olun.`);

    const url = `https://wa.me/${waNumber}?text=${text}`;
    form.style.display = 'none';
    confirm.classList.add('show');
    setTimeout(() => window.open(url, '_blank', 'noopener,noreferrer'), 600);
    if (window.gsap) gsap.fromTo('#res-confirm', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
  });

  const reset = document.getElementById('res-reset');
  if (reset) reset.addEventListener('click', () => { form.reset(); form.style.display = ''; confirm.classList.remove('show'); });
})();
