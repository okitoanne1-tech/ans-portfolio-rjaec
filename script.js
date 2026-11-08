(() => {
  const $ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ====== RÉGLAGES — à modifier ======
     Pour recevoir les inscriptions directement par e-mail :
     1) crée un formulaire gratuit sur https://formspree.io (avec rjaecongo@gmail.com)
     2) colle ici l'adresse fournie, ex. "https://formspree.io/f/xxxxxxx"
     Tant que c'est vide, le bouton ouvre l'e-mail de la personne, pré-rempli, vers RJAEC. */
  const FORM_ENDPOINT = '';
  const RJAEC_EMAIL = 'rjaecongo@gmail.com';

  /* Titre d'accueil : mot par mot */
  $('.hero h1').forEach(el => {
    const words = el.textContent.trim().replace(/\s+!/g,'\u00a0!').split(/ +/); el.setAttribute('aria-label', el.textContent); el.textContent = '';
    words.forEach((w, i) => {
      const s = document.createElement('span'); s.className = 'w' + (/monde|meilleur/i.test(w) ? ' hl' : '');
      s.setAttribute('aria-hidden', 'true'); s.innerHTML = `<i style="--d:${i * .09}s">${w}</i>`; el.append(s, ' ');
    });
  });
  /* Titres de sections : lettre par lettre */
  $('.split:not([data-words])').forEach(el => {
    const txt = el.textContent; el.setAttribute('aria-label', txt); el.textContent = '';
    txt.split(' ').forEach((word, wi, arr) => {
      const wrap = document.createElement('span'); wrap.style.whiteSpace = 'nowrap'; wrap.style.display = 'inline-block';
      [...word].forEach((c, i) => { const s = document.createElement('span'); s.className = 'ch'; s.setAttribute('aria-hidden', 'true'); s.innerHTML = `<i style="--d:${(wi * 4 + i) * .025}s">${c}</i>`; wrap.appendChild(s); });
      el.appendChild(wrap); if (wi < arr.length - 1) el.append(' ');
    });
  });
  $('.goals,.cards,.benefits,.members ol,.partners,.gallery,.stats').forEach(g => $('.reveal', g).forEach((el, i) => el.style.setProperty('--d', (i % 4) * .1 + 's')));

  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  const startReveals = () => $('.reveal,.split').forEach(el => io.observe(el));

  const co = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; co.unobserve(e.target);
    const end = +e.target.dataset.count; let n = 0; const t = setInterval(() => { e.target.textContent = ++n; if (n >= end) clearInterval(t); }, 600 / end);
  }), { threshold: .6 });
  $('[data-count]').forEach(el => co.observe(el));

  /* Écran de chargement */
  const loader = $('.loader')[0], num = $('.loader__count')[0], bar = $('.loader__bar i')[0]; let p = 0;
  const tick = setInterval(() => {
    p = Math.min(100, p + Math.ceil(Math.random() * 10)); num.textContent = p + '%'; bar.style.width = p + '%';
    if (p === 100) { clearInterval(tick); setTimeout(() => { loader.classList.add('done'); document.body.classList.remove('is-loading'); startReveals(); }, 300); }
  }, 60);

  /* Défilement */
  const prog = $('.progress')[0], header = $('.header')[0], nav = $('#nav')[0]; let lastY = 0;
  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (y / h * 100) + '%';
    header.classList.toggle('scrolled', y > 40);
    header.classList.toggle('hide', y > lastY && y > 300 && !nav.classList.contains('open'));
    lastY = y;
    if (!reduce) $('[data-parallax]').forEach(el => el.style.transform = `translateY(${Math.min(y, innerHeight) * el.dataset.parallax}px) scale(1.08)`);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Réseau animé (clin d'œil au logo) */
  const cv = $('#network')[0];
  if (cv && !reduce) {
    const ctx = cv.getContext('2d'); let W, H, pts = []; const mouse = { x: -999, y: -999 };
    const size = () => { const r = cv.getBoundingClientRect(); const d = devicePixelRatio || 1; W = cv.width = r.width * d; H = cv.height = r.height * d; ctx.setTransform(d, 0, 0, d, 0, 0); W /= d; H /= d;
      const n = Math.min(70, Math.round(W * H / 16000)); pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: 2 + Math.random() * 4, g: Math.random() < .08 })); };
    size(); addEventListener('resize', size);
    cv.parentElement.addEventListener('mousemove', e => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    (function draw() {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(a => {
        a.x += a.vx; a.y += a.vy; if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1;
        const dx = a.x - mouse.x, dy = a.y - mouse.y, d = Math.hypot(dx, dy); if (d < 120) { a.x += dx / d * 1.2; a.y += dy / d * 1.2; }
      });
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 150) { ctx.strokeStyle = `rgba(31,86,184,${.28 * (1 - d / 150)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      pts.forEach(a => { ctx.fillStyle = a.g ? '#f5a623' : 'rgba(31,86,184,.55)'; ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 7); ctx.fill(); });
      requestAnimationFrame(draw);
    })();
  }

  /* Curseur */
  const cur = $('.cursor')[0];
  if (matchMedia('(hover:hover)').matches) {
    let x = 0, y = 0, cx = 0, cy = 0;
    addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; cur.style.opacity = 1; });
    (function loop() { cx += (x - cx) * .18; cy += (y - cy) * .18; cur.style.left = cx + 'px'; cur.style.top = cy + 'px'; requestAnimationFrame(loop); })();
    $('a,button,.card,.g').forEach(el => { el.addEventListener('mouseenter', () => cur.classList.add('big')); el.addEventListener('mouseleave', () => cur.classList.remove('big')); });
  }
  /* Boutons magnétiques + inclinaison */
  if (!reduce) {
    $('.magnetic').forEach(b => { b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px,${(e.clientY - r.top - r.height / 2) * .3}px)`; }); b.addEventListener('mouseleave', () => b.style.transform = ''); });
    $('[data-tilt]').forEach(c => { c.addEventListener('mousemove', e => { const r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5; c.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg)`; }); c.addEventListener('mouseleave', () => c.style.transform = ''); });
  }

  /* Menu mobile */
  const btn = $('.menu-btn')[0];
  const toggle = o => { nav.classList.toggle('open', o); btn.setAttribute('aria-expanded', o); btn.textContent = o ? 'Fermer' : 'Menu'; };
  btn.addEventListener('click', () => toggle(!nav.classList.contains('open')));
  $('a', nav).forEach(a => a.addEventListener('click', () => toggle(false)));

  /* Galerie : agrandissement */
  const lb = $('.lightbox')[0], lbImg = $('img', lb)[0];
  $('.g').forEach(g => g.addEventListener('click', () => { lbImg.src = g.dataset.full; lbImg.alt = $('img', g)[0].alt; lb.classList.add('open'); }));
  lb.addEventListener('click', () => lb.classList.remove('open'));
  addEventListener('keydown', e => e.key === 'Escape' && lb.classList.remove('open'));

  /* Formulaire d'inscription */
  const form = $('#joinForm')[0], msg = $('.form__msg', form)[0];
  form.addEventListener('submit', async e => {
    e.preventDefault(); msg.className = 'form__msg'; msg.textContent = '';
    let ok = true; $('[required]', form).forEach(f => { const bad = f.type === 'checkbox' ? !f.checked : !f.value.trim(); f.classList.toggle('invalid', bad); if (bad) ok = false; });
    if (!ok) { msg.classList.add('err'); msg.textContent = 'Merci de remplir tous les champs obligatoires.'; return; }
    const data = Object.fromEntries(new FormData(form)); if (data.website) return; delete data.website;
    const submitBtn = $('button[type=submit]', form)[0]; submitBtn.disabled = true;
    if (FORM_ENDPOINT) {
      try {
        const r = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
        if (!r.ok) throw 0; form.reset(); msg.classList.add('ok'); msg.textContent = 'Merci ! Votre inscription a bien été envoyée. Le RJAEC vous contactera bientôt.';
      } catch { msg.classList.add('err'); msg.textContent = `Envoi impossible pour le moment. Écrivez-nous à ${RJAEC_EMAIL}.`; }
    } else {
      const lines = [['Nom', data.nom], ['Postnom', data.postnom], ['Prénom', data.prenom], ['Sexe', data.sexe], ['Date de naissance', data.naissance], ['Pays', data.pays], ['Ville', data.ville], ['WhatsApp', data.whatsapp], ['E-mail', data.email], ['Profession / Domaine', data.profession], ['Spécialité', data.specialite], ['Situation actuelle', data.situation], ['Pourquoi rejoindre le RJAEC', data.motivation], ['Attentes envers le réseau', data.attentes], ['Consentement', 'Oui']];
      const body = lines.map(([k, v]) => `${k} : ${v || '-'}`).join('\n');
      location.href = `mailto:${RJAEC_EMAIL}?subject=${encodeURIComponent('Inscription au RJAEC — ' + data.prenom + ' ' + data.nom)}&body=${encodeURIComponent(body)}`;
      msg.classList.add('ok'); msg.textContent = "Votre application d'e-mail s'ouvre : envoyez le message pour finaliser votre inscription.";
    }
    submitBtn.disabled = false;
  });
})();
