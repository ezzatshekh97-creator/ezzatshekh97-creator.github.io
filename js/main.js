/* NEON — Ezzat Shaikh Mohammed portfolio */
(() => {
  gsap.registerPlugin(ScrollTrigger);

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const mm = gsap.matchMedia();
  $('#yr').textContent = new Date().getFullYear();

  /* ---------- Smooth scroll ---------- */
  let lenis = null;
  if (!reduce) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  const scrollTo = target => lenis ? lenis.scrollTo(target, { duration: 1.6, offset: 0 }) : $(target)?.scrollIntoView({ behavior: 'smooth' });

  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2 && id !== '#') return;
    e.preventDefault();
    closeMenu();
    scrollTo(id === '#' ? 0 : id);
  }));

  /* ---------- Text splitting (word-level: keeps Arabic letters joined) ---------- */
  const splitWords = (el, cls) => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w => cls === 'w'
      ? `<span class="w">${w}</span>`
      : `<span class="sw-word"><span>${w}</span></span>`).join(' ');
  };
  $$('.split-words').forEach(el => splitWords(el));
  $$('[data-words]').forEach(el => splitWords(el, 'w'));

  /* ---------- Lazy videos: play only in view ---------- */
  const vids = $$('video[data-src]');
  const loadVid = v => { if (!v.src) { v.src = v.dataset.src; v.load(); } };
  const io = new IntersectionObserver(entries => {
    entries.forEach(({ target: v, isIntersecting }) => {
      if (isIntersecting) { loadVid(v); v.play().catch(() => {}); }
      else v.pause();
    });
  }, { rootMargin: '200px 0px' });

  /* ---------- Loader ---------- */
  const loader = $('.loader');
  const countEl = $('.loader__count span');
  const intro = () => {
    document.body.classList.remove('is-loading');
    lenis?.start();
    vids.forEach(v => io.observe(v));
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.hero .line__in', { yPercent: 115, rotate: 4, duration: 1.4, stagger: 0.12 })
      .from('.hero .reveal-up', { y: 40, opacity: 0, duration: 1.1, stagger: 0.1 }, '-=1.0')
      .from('.hero__col', { yPercent: 30, opacity: 0, duration: 1.8, stagger: 0.12 }, 0)
      .from('.nav > *', { y: -30, opacity: 0, duration: 1, stagger: 0.06 }, 0.2);
    startRotator();
  };

  if (reduce) {
    loader.remove();
    intro();
  } else {
    const counter = { v: 0 };
    const logo = $('.loader__logo');
    const colors = ['#F65401', '#CAFC05', '#8B3FD1'];
    let ci = 0;
    const flick = setInterval(() => { logo.style.background = colors[++ci % 3]; }, 220);
    const ready = Promise.all([
      document.fonts.ready,
      new Promise(r => (document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true }))),
      new Promise(r => setTimeout(r, 1400))
    ]);
    gsap.to(counter, {
      v: 90, duration: 1.4, ease: 'power2.out',
      onUpdate: () => { countEl.textContent = Math.round(counter.v); }
    });
    ready.then(() => {
      gsap.timeline()
        .to(counter, { v: 100, duration: 0.4, onUpdate: () => { countEl.textContent = Math.round(counter.v); } })
        .add(() => clearInterval(flick))
        .to('.loader__logo, .loader__count', { scale: 0.8, opacity: 0, duration: 0.5, ease: 'power3.in' })
        .to('.loader__bars i', { scaleY: 1, duration: 0.7, stagger: 0.08, ease: 'expo.inOut' }, '-=0.2')
        .set(loader, { backgroundColor: 'transparent' })
        .set('.loader__bars i', { transformOrigin: 'top' })
        .add(intro)
        .to('.loader__bars i', { scaleY: 0, duration: 0.9, stagger: 0.08, ease: 'expo.inOut' }, '<')
        .add(() => loader.remove());
    });
  }

  /* ---------- Hero word rotator ---------- */
  function startRotator() {
    const words = $$('.rotator__word');
    if (words.length < 2) return;
    let i = 0;
    gsap.set(words, { opacity: 0, yPercent: 100, rotate: 4 });
    gsap.set(words[0], { opacity: 1, yPercent: 0, rotate: 0 });
    words.forEach(w => w.classList.remove('is-on'));
    setInterval(() => {
      const cur = words[i];
      i = (i + 1) % words.length;
      const nxt = words[i];
      gsap.to(cur, { yPercent: -100, rotate: -4, opacity: 0, duration: 0.7, ease: 'expo.inOut' });
      gsap.fromTo(nxt, { yPercent: 100, rotate: 4, opacity: 0 }, { yPercent: 0, rotate: 0, opacity: 1, duration: 0.7, ease: 'expo.inOut' });
    }, 2300);
  }

  if (!reduce) {
    /* Hero reels parallax */
    $$('.hero__col').forEach((col, i) => {
      gsap.to(col, {
        yPercent: [-18, 14, -26][i] || -10, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    });
    gsap.to('.hero__inner', {
      yPercent: -20, opacity: 0.2, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    /* Heading word reveals */
    $$('.split-words').forEach(el => {
      gsap.from($$('.sw-word > span', el), {
        yPercent: 110, rotate: 3, duration: 1.2, stagger: 0.06, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });

    /* Manifesto scrub */
    gsap.to('.manifesto__text .w', {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: '.manifesto', start: 'top 70%', end: 'bottom 60%', scrub: true }
    });

    /* Reels entrance */
    gsap.utils.toArray('.reel').forEach((r, i) => {
      gsap.from(r, {
        y: 120, rotate: i % 2 ? -4 : 4, opacity: 0, duration: 1.3, ease: 'expo.out',
        scrollTrigger: { trigger: r, start: 'top 95%' }
      });
    });

    /* Contact title */
    gsap.from('.contact .line__in', {
      yPercent: 115, duration: 1.4, stagger: 0.12, ease: 'expo.out',
      scrollTrigger: { trigger: '.contact', start: 'top 65%' }
    });

    /* Footer logos */
    gsap.from('.fl', {
      yPercent: 60, rotate: i => [-12, 6, 14][i], opacity: 0, duration: 1.4, stagger: 0.1, ease: 'expo.out',
      scrollTrigger: { trigger: '.footer', start: 'top 85%' }
    });

    /* Services: horizontal on desktop */
    mm.add('(min-width: 861px)', () => {
      const track = $('.services__track');
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      gsap.to(track, {
        x: () => dist(), ease: 'none',
        scrollTrigger: {
          trigger: '.services', pin: '.services__pin', start: 'top top',
          end: () => '+=' + dist(), scrub: 1, invalidateOnRefresh: true
        }
      });
      $$('.svc').forEach(card => {
        gsap.from($('.svc__n', card), { yPercent: 40, opacity: 0.2, ease: 'none',
          scrollTrigger: { trigger: '.services', start: 'top top', end: () => '+=' + dist(), scrub: true } });
      });
    });
    mm.add('(max-width: 860px)', () => {
      $$('.svc').forEach(card => gsap.from(card, {
        y: 80, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 90%' }
      }));
    });

    /* Campaign fan: stacked → spread, pinned */
    const fanImgs = $$('.fan__stage img');
    const mid = (fanImgs.length - 1) / 2;
    gsap.set(fanImgs, { xPercent: -50, yPercent: -50, rotate: i => (i - mid) * 1.5, y: 0, x: 0, scale: 0.9 });
    mm.add({ desk: '(min-width: 861px)', mob: '(max-width: 860px)' }, ctx => {
      const spread = ctx.conditions.desk ? Math.min(70, innerWidth * 0.045) : 34;
      gsap.timeline({
        scrollTrigger: { trigger: '.fan', pin: '.fan__pin', start: 'top top', end: '+=140%', scrub: 1 }
      })
        .to(fanImgs, {
          x: i => (i - mid) * -spread, y: i => Math.abs(i - mid) * (ctx.conditions.desk ? 22 : 10),
          rotate: i => (i - mid) * 8, scale: 1, ease: 'power2.out', duration: 1
        })
        .to(fanImgs, { y: i => Math.abs(i - mid) * (ctx.conditions.desk ? 22 : 10) - 16, duration: 0.3 });
    });
  } else {
    $$('.manifesto__text .w').forEach(w => { w.style.opacity = 1; });
  }

  /* ---------- Background theme per section (after pins so offsets include pin spacing) ---------- */
  $$('[data-theme]').forEach(sec => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 55%', end: 'bottom 55%', refreshPriority: -1,
      onToggle: self => { if (self.isActive) document.body.dataset.theme = sec.dataset.theme; }
    });
  });
  document.body.dataset.theme = 'dark';

  /* ---------- Infinite marquees, sped up by scroll velocity ---------- */
  const loops = [];
  const makeLoop = (track, speed) => {
    const unit = track.innerHTML;
    for (let n = 0; n < 4 && track.scrollWidth < innerWidth * 1.3; n++) track.innerHTML += unit;
    track.innerHTML += track.innerHTML;
    const st = { x: 0, track, speed, half: 0 };
    const measure = () => { st.half = track.scrollWidth / 2; };
    measure();
    addEventListener('resize', measure);
    track.querySelectorAll('img').forEach(img => img.addEventListener('load', measure));
    loops.push(st);
  };
  $$('.ticker__track').forEach(t => makeLoop(t, parseFloat(t.dataset.speed) || 1));
  $$('.row').forEach(r => makeLoop($('.row__track', r), 0.6 * (parseFloat(r.dataset.dir) || 1)));
  let boost = 0;
  if (lenis) lenis.on('scroll', e => { boost = gsap.utils.clamp(-14, 14, e.velocity * 0.5); });
  gsap.ticker.add(() => {
    if (reduce) return;
    boost *= 0.92;
    loops.forEach(l => {
      if (!l.half) return;
      const dir = Math.sign(l.speed) || 1;
      l.x += l.speed + dir * Math.abs(boost);
      l.x = gsap.utils.wrap(0, l.half, l.x);
      l.track.style.transform = `translate3d(${l.x}px,0,0)`;
    });
  });

  /* ---------- Filters ---------- */
  $$('.filters button').forEach(btn => btn.addEventListener('click', () => {
    $$('.filters button').forEach(b => b.classList.toggle('is-on', b === btn));
    const f = btn.dataset.f;
    const reels = $$('.reel');
    gsap.to(reels, {
      opacity: 0, y: 30, duration: 0.25, stagger: 0.015, onComplete: () => {
        reels.forEach(r => r.classList.toggle('is-hidden', f !== 'all' && r.dataset.cat !== f));
        const shown = reels.filter(r => !r.classList.contains('is-hidden'));
        gsap.fromTo(shown, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: 'expo.out' });
        ScrollTrigger.refresh();
      }
    });
  }));

  /* ---------- Lightbox ---------- */
  const lb = $('.lightbox'), lbv = $('.lightbox__video'), lbc = $('.lightbox__cap');
  const openLb = reel => {
    const v = $('video', reel);
    lbv.src = v.dataset.src;
    lbv.poster = v.poster;
    lbc.textContent = $('.reel__meta b', reel).textContent;
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    lenis?.stop();
    lbv.muted = false;
    lbv.play().catch(() => {});
  };
  const closeLb = () => {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    lbv.pause();
    lenis?.start();
  };
  $$('.reel').forEach(r => r.addEventListener('click', () => openLb(r)));
  $('.lightbox__close').addEventListener('click', closeLb);
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeLb(); closeMenu(); } });

  /* ---------- Mobile menu ---------- */
  const burger = $('.nav__burger'), menu = $('.menu');
  function closeMenu() {
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  }
  burger.addEventListener('click', () => {
    const open = !menu.classList.contains('is-open');
    menu.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    if (open) gsap.from('.menu a', { yPercent: 100, opacity: 0, duration: 0.8, stagger: 0.06, ease: 'expo.out', delay: 0.15 });
  });

  /* ---------- Counters ---------- */
  $$('[data-count]').forEach(el => {
    const end = +el.dataset.count, suf = el.dataset.suffix || '';
    const o = { v: end > 1000 ? 1990 : 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => gsap.to(o, {
        v: end, duration: 2, ease: 'expo.out',
        onUpdate: () => { el.textContent = Math.round(o.v) + suf; }
      })
    });
  });

  /* ---------- Swatches: copy hex ---------- */
  const toast = $('.toast');
  let toastT;
  $$('.sw').forEach(b => b.addEventListener('click', () => {
    navigator.clipboard?.writeText(b.dataset.copy).catch(() => {});
    toast.textContent = `تم النسخ ${b.dataset.copy}`;
    toast.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove('is-on'), 1600);
  }));

  /* ---------- Cursor, magnetic, tilt (desktop only) ---------- */
  if (finePointer && !reduce) {
    const cur = $('.cursor'), dot = $('.cursor-dot'), label = $('.cursor__label');
    const cx = gsap.quickTo(cur, 'x', { duration: 0.45, ease: 'power3' });
    const cy = gsap.quickTo(cur, 'y', { duration: 0.45, ease: 'power3' });
    const dx = gsap.quickTo(dot, 'x', { duration: 0.08 });
    const dy = gsap.quickTo(dot, 'y', { duration: 0.08 });
    addEventListener('pointermove', e => { cx(e.clientX); cy(e.clientY); dx(e.clientX); dy(e.clientY); });

    const setLabel = (el, txt) => {
      el.addEventListener('pointerenter', () => { label.textContent = txt; cur.classList.add('is-label'); });
      el.addEventListener('pointerleave', () => cur.classList.remove('is-label'));
    };
    $$('.reel').forEach(r => setLabel(r, 'شغّل ▶'));
    $$('.row__track img').forEach(r => setLabel(r, 'NEON'));
    $$('.sw').forEach(r => setLabel(r, 'انسخ'));
    $$('a, button:not(.sw)').forEach(el => {
      el.addEventListener('pointerenter', () => cur.classList.add('is-hover'));
      el.addEventListener('pointerleave', () => cur.classList.remove('is-hover'));
    });

    $$('[data-magnetic]').forEach(el => {
      const mx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1,0.4)' });
      const my = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1,0.4)' });
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * 0.35);
        my((e.clientY - r.top - r.height / 2) * 0.35);
      });
      el.addEventListener('pointerleave', () => { mx(0); my(0); });
    });

    $$('.reel').forEach(r => {
      const rx = gsap.quickTo(r, 'rotationX', { duration: 0.6, ease: 'power3' });
      const ry = gsap.quickTo(r, 'rotationY', { duration: 0.6, ease: 'power3' });
      gsap.set(r, { transformPerspective: 900 });
      r.addEventListener('pointermove', e => {
        const b = r.getBoundingClientRect();
        ry(((e.clientX - b.left) / b.width - 0.5) * 14);
        rx(-((e.clientY - b.top) / b.height - 0.5) * 14);
      });
      r.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
  }

  addEventListener('load', () => ScrollTrigger.refresh());
})();
