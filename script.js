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
  initModalBio();
  initModalObra();
  initModalVisualizador();
}

/* ===== CUSTOM CURSOR ===== */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = -100, mouseY = -100, ringX = -100, ringY = -100;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll('a, button, .mosaic-card, .featured-arrow, .f-dot, .t-dot, .contacto-square-btn, .obra-option, .upload-zone').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

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
    a.addEventListener('click', () => { toggle.classList.remove('open'); links.classList.remove('open'); });
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
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.scroll-reveal').forEach(el => obs.observe(el));
}

/* ===== FEATURED CAROUSEL — con sync de mosaic stroke ===== */
function initFeaturedCarousel() {
  const slides = document.querySelectorAll('.featured-slide');
  const mosaicCards = document.querySelectorAll('.mosaic-card');
  const prev = document.getElementById('featuredPrev');
  const next = document.getElementById('featuredNext');
  const dotsContainer = document.getElementById('featuredDots');
  if (!slides.length || !dotsContainer) return;

  let current = 0;
  const total = slides.length;

  // Build dots
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    dot.classList.add('f-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => { go(i); resetAuto(); });
    dotsContainer.appendChild(dot);
  }

  function syncMosaic(index) {
    mosaicCards.forEach(card => {
      card.classList.toggle('active-mosaic', parseInt(card.dataset.index) === index);
    });
    // scroll mosaic row to show active card
    const activeCard = document.querySelector(`.mosaic-card[data-index="${index}"]`);
    if (activeCard) {
      activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  let autoTimer = null;
  function resetAuto() { clearInterval(autoTimer); autoTimer = setInterval(() => go(current + 1), 5000); }

  function go(n) {
    slides[current].classList.remove('active');
    current = (n + total) % total;
    slides[current].classList.add('active');
    dotsContainer.querySelectorAll('.f-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    syncMosaic(current);
  }

  prev.addEventListener('click', () => { go(current - 1); resetAuto(); });
  next.addEventListener('click', () => { go(current + 1); resetAuto(); });
  resetAuto();

  // Click on CTA only → WhatsApp
  document.querySelectorAll('.featured-cta').forEach(cta => {
    const slide = cta.closest('.featured-slide');
    if (slide && slide.dataset.wa) {
      cta.addEventListener('click', () => {
        window.open(`https://wa.me/5491161592163?text=${encodeURIComponent(slide.dataset.wa)}`, '_blank');
      });
    }
  });

  // Click on mosaic → jump to that slide
  mosaicCards.forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.index);
      if (!isNaN(idx)) { go(idx); resetAuto(); }
    });
  });

  const carousel = document.getElementById('featuredCarousel');

  // Touch swipe
  let tx = 0;
  carousel.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const d = tx - e.changedTouches[0].clientX;
    if (Math.abs(d) > 50) { d > 0 ? go(current + 1) : go(current - 1); resetAuto(); }
  });
}

/* ===== CARD CLICKS (solo WhatsApp, sin conflicto con mosaic→carousel) ===== */
function initCardClicks() {
  // handled inside initFeaturedCarousel for mosaic
}

/* ===== TESTIMONIALS ===== */
function initTestimonials() {
  const testimonials = document.querySelectorAll('.testimonial');
  const dotsContainer = document.getElementById('testimonialDots');
  const prev = document.getElementById('testimonialPrev');
  const next = document.getElementById('testimonialNext');
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
    current = (n + total) % total;
    testimonials[current].classList.add('active');
    dotsContainer.querySelectorAll('.t-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  if (prev) prev.addEventListener('click', () => go(current - 1));
  if (next) next.addEventListener('click', () => go(current + 1));
}

/* ===== BEFORE/AFTER ===== */
function initBeforeAfter() {
  const compare = document.getElementById('baCompare');
  const handle = document.getElementById('baHandle');
  if (!compare || !handle) return;
  const beforeImg = compare.querySelector('.ba-before-img');
  if (!beforeImg) return;

  let dragging = false;

  function updatePosition(x) {
    const rect = compare.getBoundingClientRect();
    let pos = Math.max(0.05, Math.min(0.95, (x - rect.left) / rect.width));
    beforeImg.style.clipPath = `inset(0 ${100 - pos * 100}% 0 0)`;
    handle.style.left = (pos * 100) + '%';
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
  if (!fab) return;
  fab.classList.add('visible');
}

/* ===== MODAL OBRA ===== */
function initModalObra() {
  const overlay = document.getElementById('modalObra');
  const btnOpen = document.getElementById('btnObraModal');
  const btnClose = document.getElementById('modalObraClose');
  if (!overlay || !btnOpen) return;

  btnOpen.addEventListener('click', e => {
    e.preventDefault();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    showStep(1);
  });
  btnClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal(); });

  function closeModal() { overlay.classList.remove('open'); document.body.style.overflow = ''; }

  function showStep(n) {
    overlay.querySelectorAll('.modal-step').forEach(s => s.classList.remove('active'));
    document.getElementById('obraStep' + n).classList.add('active');
    overlay.querySelectorAll('.modal-progress-step').forEach(s => {
      s.classList.toggle('active', parseInt(s.dataset.step) <= n);
    });
    overlay.querySelectorAll('.modal-progress-line').forEach((line, i) => {
      line.classList.toggle('active', i < n - 1);
    });
  }

  // Step 1
  const fileInput = document.getElementById('obraFileInput');
  const step1Next = document.getElementById('obraStep1Next');

  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const zone = document.getElementById('obraUploadZone');
    zone.classList.add('has-file');
    document.getElementById('obraUploadInner').innerHTML =
      '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" stroke-width="1.5"><polyline points="20,6 9,17 4,12"/></svg>' +
      '<span style="color:var(--accent)">Foto cargada</span>' +
      '<small style="color:var(--text-muted)">' + file.name + '</small>';
    step1Next.disabled = false;
  });

  step1Next.addEventListener('click', () => showStep(2));
  document.getElementById('obraStep2Back').addEventListener('click', () => showStep(1));

  // Step 2
  let selectedObra = { name: 'Aurelius', custom: false };
  const customField = document.getElementById('obraCustomField');

  overlay.querySelectorAll('.obra-option').forEach(opt => {
    opt.addEventListener('click', () => {
      overlay.querySelectorAll('.obra-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      const isCustom = opt.dataset.name === 'Personalizada';
      selectedObra = { name: opt.dataset.name, custom: isCustom };
      customField.style.display = isCustom ? 'block' : 'none';
    });
  });

  document.getElementById('obraStep2Next').addEventListener('click', () => { buildStep3(); showStep(3); });
  document.getElementById('obraStep3Back').addEventListener('click', () => showStep(2));

  // Step 3
  function buildStep3() {
    const customDesc = document.getElementById('obraCustomDesc');
    let msg, subject;

    if (selectedObra.custom) {
      const desc = customDesc && customDesc.value.trim() ? ' ' + customDesc.value.trim() : '';
      document.getElementById('obraSummary').textContent = 'Creación personalizada para tu espacio';
      msg = 'Hola Juan, subí una foto de mi espacio y me gustaría una obra personalizada.' + desc + ' ¿Podemos conversar?';
      subject = 'Consulta: Obra personalizada para mi espacio';
    } else {
      document.getElementById('obraSummary').textContent = 'Obra seleccionada: ' + selectedObra.name;
      msg = 'Hola Juan, subí una foto de mi espacio y me interesa la obra ' + selectedObra.name + '. ¿Podemos conversar?';
      subject = 'Consulta: Obra ' + selectedObra.name + ' para mi espacio';
    }

    document.getElementById('obraWA').href = 'https://wa.me/5491161592163?text=' + encodeURIComponent(msg);
    document.getElementById('obraMail').href = 'mailto:juanstoky@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(msg);
  }
}

/* ===== MODAL BIO ===== */
function initModalBio() {
  const overlay = document.getElementById('modalBio');
  const btnOpen = document.getElementById('btnBioModal');
  const btnClose = document.getElementById('modalBioClose');
  if (!overlay || !btnOpen) return;

  btnOpen.addEventListener('click', () => { overlay.classList.add('open'); document.body.style.overflow = 'hidden'; });
  btnClose.addEventListener('click', () => closeModal());
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  function closeModal() { overlay.classList.remove('open'); document.body.style.overflow = ''; }
}

/* ===== MODAL VISUALIZADOR ===== */
function initModalVisualizador() {
  const overlay = document.getElementById('modalVisualizar');
  const btnOpen = document.getElementById('btnVisualizarModal');
  const btnClose = document.getElementById('modalClose');
  if (!overlay || !btnOpen) return;

  btnOpen.addEventListener('click', () => { overlay.classList.add('open'); document.body.style.overflow = 'hidden'; showStep(1); });
  btnClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal(); });

  function closeModal() { overlay.classList.remove('open'); document.body.style.overflow = ''; }
  function showStep(n) {
    document.querySelectorAll('.modal-step').forEach(s => s.classList.remove('active'));
    document.getElementById('step' + n).classList.add('active');
  }

  // Step 1
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

  // Step 2
  let selectedObra = { img: 'img/aurelius-space.jpg', name: 'Aurelius' };
  document.querySelectorAll('.obra-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.obra-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      selectedObra = { img: opt.dataset.img, name: opt.dataset.name };
    });
  });

  document.getElementById('step2Next').addEventListener('click', () => { buildPreview(); showStep(3); });
  document.getElementById('step3Back').addEventListener('click', () => showStep(2));

  // Step 3
  function buildPreview() {
    document.getElementById('previewBg').src = uploadedImageSrc;
    document.getElementById('previewArtImg').src = selectedObra.img;
    document.getElementById('previewObraName').textContent = 'Obra: ' + selectedObra.name;
    document.getElementById('step3WA').href = `https://wa.me/5491161592163?text=${encodeURIComponent('Hola Juan, probé tu visualizador y me gustaría la obra ' + selectedObra.name + ' para mi espacio. ¿Podemos conversar?')}`;
    initDragResize();
  }

  function initDragResize() {
    const artwork = document.getElementById('previewArtwork');
    const canvas = document.getElementById('previewCanvas');
    const handle = document.getElementById('resizeHandle');
    if (!artwork || !canvas) return;

    artwork.style.left = '30%'; artwork.style.top = '20%'; artwork.style.width = '35%';

    let dragging = false, resizing = false, startX, startY, startLeft, startTop, startW;

    artwork.addEventListener('mousedown', e => {
      if (e.target === handle) return;
      dragging = true; startX = e.clientX; startY = e.clientY;
      const r = artwork.getBoundingClientRect(), cr = canvas.getBoundingClientRect();
      startLeft = r.left - cr.left; startTop = r.top - cr.top;
      e.preventDefault();
    });
    handle.addEventListener('mousedown', e => {
      resizing = true; startX = e.clientX; startW = artwork.offsetWidth;
      e.preventDefault(); e.stopPropagation();
    });
    window.addEventListener('mousemove', e => {
      const cr = canvas.getBoundingClientRect();
      if (dragging) {
        artwork.style.left = ((startLeft + e.clientX - startX) / cr.width * 100) + '%';
        artwork.style.top = ((startTop + e.clientY - startY) / cr.height * 100) + '%';
      }
      if (resizing) {
        artwork.style.width = (Math.max(60, startW + e.clientX - startX) / cr.width * 100) + '%';
      }
    });
    window.addEventListener('mouseup', () => { dragging = false; resizing = false; });

    artwork.addEventListener('touchstart', e => {
      if (e.target === handle) return;
      dragging = true; startX = e.touches[0].clientX; startY = e.touches[0].clientY;
      const r = artwork.getBoundingClientRect(), cr = canvas.getBoundingClientRect();
      startLeft = r.left - cr.left; startTop = r.top - cr.top;
    }, { passive: true });
    window.addEventListener('touchmove', e => {
      if (!dragging) return;
      const cr = canvas.getBoundingClientRect();
      artwork.style.left = ((startLeft + e.touches[0].clientX - startX) / cr.width * 100) + '%';
      artwork.style.top = ((startTop + e.touches[0].clientY - startY) / cr.height * 100) + '%';
    }, { passive: true });
    window.addEventListener('touchend', () => { dragging = false; });
  }
}
