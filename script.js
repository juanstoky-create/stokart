/* ===== LOADER ===== */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    document.body.style.overflow = '';
    init();
  }, 900);
});
document.body.style.overflow = 'hidden';

function init() {
  initCursor();
  initNav();
  initScrollReveal();
  initFeaturedCarousel();
  initCardClicks();
  initTestimonials();
  initFAB();
  initHeroParallax();
  initBeforeAfter();
  initModal();
}

/* ===== CUSTOM CURSOR ===== */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;
  let raf;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    raf = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover states
  const hoverEls = document.querySelectorAll('a, button, .mosaic-card, .featured-arrow, .f-dot, .t-dot, .contacto-square-btn');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // View state on featured carousel
  const carousel = document.getElementById('featuredCarousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => document.body.classList.add('cursor-view'));
    carousel.addEventListener('mouseleave', () => document.body.classList.remove('cursor-view'));
  }

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
}

/* ===== NAV ===== */
function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  let lastY = 0;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
    });
  });

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 50);
    if (y > 300) {
      nav.classList.toggle('hidden', y > lastY && (y - lastY) > 4);
    } else {
      nav.classList.remove('hidden');
    }
    lastY = y;
  }, { passive: true });
}

/* ===== HERO PARALLAX ===== */
function initHeroParallax() {
  const img = document.querySelector('.hero-bg-img');
  if (!img) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const vh = window.innerHeight;
    if (y < vh) {
      img.style.transform = `scale(${1 + y * 0.0003}) translateY(${y * 0.2}px)`;
      img.style.opacity = Math.max(0, 1 - y / (vh * 0.85));
    }
  }, { passive: true });
}

/* ===== SCROLL REVEAL ===== */
function initScrollReveal() {
  const els = document.querySelectorAll('.scroll-reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ===== FEATURED CAROUSEL ===== */
function initFeaturedCarousel() {
  const slides = document.querySelectorAll('.featured-slide');
  const prev = document.getElementById('featuredPrev');
  const next = document.getElementById('featuredNext');
  const dotsContainer = document.getElementById('featuredDots');
  if (!slides.length || !dotsContainer) return;

  let current = 0;
  const total = slides.length;

  for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    dot.classList.add('f-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => go(i));
    dotsContainer.appendChild(dot);
  }

  function go(n) {
    slides[current].classList.remove('active');
    current = (n + total) % total;
    slides[current].classList.add('active');
    dotsContainer.querySelectorAll('.f-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prev.addEventListener('click', () => go(current - 1));
  next.addEventListener('click', () => go(current + 1));

  slides.forEach(slide => {
    if (slide.dataset.wa) {
      slide.addEventListener('click', () => {
        window.open(`https://wa.me/5491161592163?text=${encodeURIComponent(slide.dataset.wa)}`, '_blank');
      });
    }
  });

  let auto = setInterval(() => go(current + 1), 5000);
  const carousel = document.getElementById('featuredCarousel');
  carousel.addEventListener('mouseenter', () => clearInterval(auto));
  carousel.addEventListener('mouseleave', () => {
    auto = setInterval(() => go(current + 1), 5000);
  });

  let tx = 0;
  carousel.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const d = tx - e.changedTouches[0].clientX;
    if (Math.abs(d) > 50) d > 0 ? go(current + 1) : go(current - 1);
  });
}

/* ===== CARD CLICKS ===== */
function initCardClicks() {
  document.querySelectorAll('.mosaic-card[data-wa]').forEach(card => {
    card.addEventListener('click', () => {
      window.open(`https://wa.me/5491161592163?text=${encodeURIComponent(card.dataset.wa)}`, '_blank');
    });
  });
}

/* ===== TESTIMONIALS ===== */
function initTestimonials() {
  const testimonials = document.querySelectorAll('.testimonial');
  const dotsContainer = document.getElementById('testimonialDots');
  if (!testimonials.length || !dotsContainer) return;

  let current = 0;
  const total = testimonials.length;

  for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    dot.classList.add('t-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => go(i));
    dotsContainer.appendChild(dot);
  }

  function go(n) {
    testimonials[current].classList.remove('active');
    current = n;
    testimonials[current].classList.add('active');
    dotsContainer.querySelectorAll('.t-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  let auto = setInterval(() => go(current < total - 1 ? current + 1 : 0), 6000);
  const parent = testimonials[0].parentElement;
  parent.addEventListener('mouseenter', () => clearInterval(auto));
  parent.addEventListener('mouseleave', () => {
    auto = setInterval(() => go(current < total - 1 ? current + 1 : 0), 6000);
  });
}

/* ===== BEFORE / AFTER ===== */
function initBeforeAfter() {
  const compare = document.getElementById('baCompare');
  const handle = document.getElementById('baHandle');
  if (!compare || !handle) return;
  const beforeImg = compare.querySelector('.ba-before-img');
  if (!beforeImg) return;

  let dragging = false;

  function updatePosition(x) {
    const rect = compare.getBoundingClientRect();
    let pos = (x - rect.left) / rect.width;
    pos = Math.max(0.05, Math.min(0.95, pos));
    const pct = pos * 100;
    beforeImg.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left = pct + '%';
  }

  compare.addEventListener('mousedown', e => { dragging = true; updatePosition(e.clientX); });
  window.addEventListener('mousemove', e => { if (dragging) { e.preventDefault(); updatePosition(e.clientX); } });
  window.addEventListener('mouseup', () => { dragging = false; });
  compare.addEventListener('touchstart', e => { dragging = true; updatePosition(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchmove', e => { if (dragging) updatePosition(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend', () => { dragging = false; });
}

/* ===== FAB ===== */
function initFAB() {
  const fab = document.getElementById('fabWa');
  const hero = document.getElementById('hero');
  if (!fab || !hero) return;
  const obs = new IntersectionObserver(([e]) => {
    fab.classList.toggle('visible', !e.isIntersecting);
  }, { threshold: 0.3 });
  obs.observe(hero);
}

/* ===== MODAL VISUALIZADOR ===== */
function initModal() {
  const overlay = document.getElementById('modalVisualizar');
  const btnOpen = document.getElementById('btnVisualizarModal');
  const btnClose = document.getElementById('modalClose');
  if (!overlay || !btnOpen) return;

  // Open / close
  btnOpen.addEventListener('click', () => {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    showStep(1);
  });
  btnClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Steps
  function showStep(n) {
    document.querySelectorAll('.modal-step').forEach(s => s.classList.remove('active'));
    document.getElementById('step' + n).classList.add('active');
  }

  // Step 1 — file upload
  const fileInput = document.getElementById('fileInput');
  const uploadZone = document.getElementById('uploadZone');
  const step1Next = document.getElementById('step1Next');
  let uploadedImageSrc = null;

  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      uploadedImageSrc = ev.target.result;
      uploadZone.classList.add('has-file');
      document.getElementById('uploadZoneInner').innerHTML = `
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" stroke-width="1.5"><polyline points="20,6 9,17 4,12"/></svg>
        <span style="color:var(--accent)">Foto cargada</span>
        <small style="color:var(--text-muted)">${file.name}</small>
      `;
      step1Next.disabled = false;
    };
    reader.readAsDataURL(file);
  });

  step1Next.addEventListener('click', () => showStep(2));
  document.getElementById('step2Back').addEventListener('click', () => showStep(1));

  // Step 2 — obra picker
  let selectedObra = { img: 'img/aurelius-space.jpg', name: 'Aurelius' };
  document.querySelectorAll('.obra-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.obra-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      selectedObra = { img: opt.dataset.img, name: opt.dataset.name };
    });
  });

  document.getElementById('step2Next').addEventListener('click', () => {
    buildPreview();
    showStep(3);
  });

  document.getElementById('step3Back').addEventListener('click', () => showStep(2));

  // Step 3 — preview
  function buildPreview() {
    const bg = document.getElementById('previewBg');
    const artImg = document.getElementById('previewArtImg');
    const obraName = document.getElementById('previewObraName');
    const waLink = document.getElementById('step3WA');

    bg.src = uploadedImageSrc;
    artImg.src = selectedObra.img;
    obraName.textContent = 'Obra: ' + selectedObra.name;
    waLink.href = `https://wa.me/5491161592163?text=${encodeURIComponent('Hola Juan, probé tu visualizador y me gustaría la obra ' + selectedObra.name + ' para mi espacio. ¿Podemos conversar?')}`;

    initDragResize();
  }

  function initDragResize() {
    const artwork = document.getElementById('previewArtwork');
    const canvas = document.getElementById('previewCanvas');
    const handle = document.getElementById('resizeHandle');
    if (!artwork || !canvas) return;

    // Reset position
    artwork.style.left = '30%';
    artwork.style.top = '20%';
    artwork.style.width = '35%';

    let dragging = false, resizing = false;
    let startX, startY, startLeft, startTop, startW;

    // Drag
    artwork.addEventListener('mousedown', e => {
      if (e.target === handle) return;
      dragging = true;
      startX = e.clientX; startY = e.clientY;
      const r = artwork.getBoundingClientRect();
      const cr = canvas.getBoundingClientRect();
      startLeft = r.left - cr.left;
      startTop = r.top - cr.top;
      e.preventDefault();
    });

    // Resize
    handle.addEventListener('mousedown', e => {
      resizing = true;
      startX = e.clientX;
      startW = artwork.offsetWidth;
      e.preventDefault(); e.stopPropagation();
    });

    window.addEventListener('mousemove', e => {
      if (dragging) {
        const cr = canvas.getBoundingClientRect();
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        artwork.style.left = ((startLeft + dx) / cr.width * 100) + '%';
        artwork.style.top = ((startTop + dy) / cr.height * 100) + '%';
      }
      if (resizing) {
        const cr = canvas.getBoundingClientRect();
        const newW = Math.max(60, startW + (e.clientX - startX));
        artwork.style.width = (newW / cr.width * 100) + '%';
      }
    });

    window.addEventListener('mouseup', () => { dragging = false; resizing = false; });

    // Touch drag
    artwork.addEventListener('touchstart', e => {
      if (e.target === handle) return;
      dragging = true;
      startX = e.touches[0].clientX; startY = e.touches[0].clientY;
      const r = artwork.getBoundingClientRect();
      const cr = canvas.getBoundingClientRect();
      startLeft = r.left - cr.left;
      startTop = r.top - cr.top;
    }, { passive: true });

    window.addEventListener('touchmove', e => {
      if (dragging) {
        const cr = canvas.getBoundingClientRect();
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        artwork.style.left = ((startLeft + dx) / cr.width * 100) + '%';
        artwork.style.top = ((startTop + dy) / cr.height * 100) + '%';
      }
    }, { passive: true });

    window.addEventListener('touchend', () => { dragging = false; });
  }
}
