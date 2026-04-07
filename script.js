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
  initNav();
  initScrollReveal();
  /* Row arrows + dots now handled inside initScrollExpand */
  initCarousel();
  initFAB();
  initForm();
  initHeroParallax();
  initBioModal();
  initCardClicks();
  initBeforeAfter();
  initServicioClicks();
  initVisualizador();
  initScrollExpand();
}

/* ===== BIO MODAL ===== */
function initBioModal() {
  const modal = document.getElementById('bioModal');
  const openBtn = document.getElementById('openBioModal');
  const closeBtn = document.getElementById('closeBioModal');
  if (!modal || !openBtn) return;

  openBtn.addEventListener('click', () => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) close();
  });

  function close() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
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
      nav.classList.toggle('hidden', y > lastY);
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
      img.style.transform = `scale(${1 + y * 0.0003}) translateY(${y * 0.25}px)`;
      img.style.opacity = Math.max(0, 1 - y / (vh * 0.9));
    }
  }, { passive: true });
}

/* ===== SCROLL REVEAL ===== */
function initScrollReveal() {
  const els = document.querySelectorAll('.scroll-fade, .scroll-reveal-up');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => obs.observe(el));
}

/* Row arrows are now initialized inside initScrollExpand */

/* ===== CAROUSEL ===== */
function initCarousel() {
  const track = document.getElementById('clientesTrack');
  const prev = document.getElementById('carouselPrev');
  const next = document.getElementById('carouselNext');
  const dots = document.getElementById('carouselDots');
  if (!track) return;

  const cards = track.querySelectorAll('.cliente-card');
  let cur = 0;
  const total = cards.length;

  cards.forEach((_, i) => {
    const d = document.createElement('div');
    d.classList.add('carousel-dot');
    if (i === 0) d.classList.add('active');
    d.addEventListener('click', () => go(i));
    dots.appendChild(d);
  });

  function go(i) {
    cur = i;
    track.style.transform = `translateX(-${cur * 100}%)`;
    dots.querySelectorAll('.carousel-dot').forEach((d, j) => d.classList.toggle('active', j === cur));
  }

  prev.addEventListener('click', () => go(cur > 0 ? cur - 1 : total - 1));
  next.addEventListener('click', () => go(cur < total - 1 ? cur + 1 : 0));

  let auto = setInterval(() => go(cur < total - 1 ? cur + 1 : 0), 5000);
  track.parentElement.addEventListener('mouseenter', () => clearInterval(auto));
  track.parentElement.addEventListener('mouseleave', () => {
    auto = setInterval(() => go(cur < total - 1 ? cur + 1 : 0), 5000);
  });

  let tx = 0;
  track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const d = tx - e.changedTouches[0].clientX;
    if (Math.abs(d) > 50) d > 0 ? next.click() : prev.click();
  });
}

/* ===== FAB ===== */
function initFAB() {
  const fab = document.getElementById('fabWa');
  if (!fab) return;

  const obs = new IntersectionObserver(([e]) => {
    fab.classList.toggle('visible', !e.isIntersecting);
  }, { threshold: 0.3 });

  obs.observe(document.getElementById('hero'));
}

/* Row dots are now initialized inside initScrollExpand */

/* --- Servicio card clicks → WhatsApp --- */
function initServicioClicks() {
  const messages = {
    serv1: 'Hola Juan, me gustaría conversar sobre una obra para mi espacio. ¿Cómo es el proceso?',
    serv2: 'Hola Juan, me interesa conocer más sobre tu proceso creativo y las técnicas que usás.',
    serv3: 'Hola Juan, quiero transformar mi espacio con una obra tuya. ¿Podemos coordinar?',
  };

  document.querySelectorAll('.servicio-card[data-modal]').forEach(card => {
    card.addEventListener('click', () => {
      const key = card.dataset.modal;
      const msg = encodeURIComponent(messages[key] || '');
      window.open(`https://wa.me/5491161592163?text=${msg}`, '_blank');
    });
  });
}

/* --- Card clicks → WhatsApp --- */
function initCardClicks() {
  document.querySelectorAll('.card[data-wa]').forEach(card => {
    card.addEventListener('click', () => {
      const msg = encodeURIComponent(card.dataset.wa);
      window.open(`https://wa.me/5491161592163?text=${msg}`, '_blank');
    });
  });
}

/* --- Before/After slider --- */
function initBeforeAfter() {
  const container = document.getElementById('beforeAfter');
  const after = document.getElementById('baAfter');
  const slider = document.getElementById('baSlider');
  if (!container || !after || !slider) return;

  let dragging = false;

  function setPosition(x) {
    const rect = container.getBoundingClientRect();
    let pct = ((x - rect.left) / rect.width) * 100;
    pct = Math.max(5, Math.min(95, pct));
    after.style.clipPath = `inset(0 0 0 ${pct}%)`;
    slider.style.left = `${pct}%`;
  }

  container.addEventListener('mousedown', (e) => { dragging = true; setPosition(e.clientX); });
  window.addEventListener('mouseup', () => { dragging = false; });
  window.addEventListener('mousemove', (e) => { if (dragging) setPosition(e.clientX); });

  container.addEventListener('touchstart', (e) => { dragging = true; setPosition(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend', () => { dragging = false; });
  window.addEventListener('touchmove', (e) => { if (dragging) setPosition(e.touches[0].clientX); }, { passive: true });
}

/* ===== VISUALIZADOR MODAL ===== */
function initVisualizador() {
  const modal = document.getElementById('vizModal');
  const openBtn = document.getElementById('openVisualizador');
  const closeBtn = document.getElementById('closeVizModal');
  if (!modal || !openBtn) return;

  const steps = [document.getElementById('vizStep1'), document.getElementById('vizStep2'), document.getElementById('vizStep3')];
  const progressBar = document.getElementById('vizProgressBar');
  const stepDots = modal.querySelectorAll('.viz-step-dot');
  let currentStep = 0;

  // State
  let spaceImageData = null;
  let selectedObra = null;
  let selectedObraImg = null;
  let isCustom = false;

  // Open / Close
  openBtn.addEventListener('click', () => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function goToStep(n) {
    steps[currentStep].classList.remove('viz-step-active');
    steps[n].classList.add('viz-step-active');
    currentStep = n;
    progressBar.style.width = `${((n + 1) / 3) * 100}%`;
    stepDots.forEach((dot, i) => {
      dot.classList.remove('active', 'done');
      if (i < n) dot.classList.add('done');
      if (i === n) dot.classList.add('active');
    });
    if (n === 2) buildSummary();
  }

  // Step 1: File upload
  const uploadArea = document.getElementById('vizUpload');
  const fileInput = document.getElementById('vizFileInput');
  const previewSpace = document.getElementById('vizPreviewSpace');
  const spaceImg = document.getElementById('vizSpaceImg');
  const changeBtn = document.getElementById('vizChangeImg');
  const next1 = document.getElementById('vizNext1');

  uploadArea.addEventListener('click', (e) => {
    if (e.target.closest('.viz-upload-btn')) return;
    fileInput.click();
  });

  uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
  uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) handleFile(fileInput.files[0]);
  });

  changeBtn.addEventListener('click', () => {
    previewSpace.style.display = 'none';
    uploadArea.style.display = '';
    spaceImageData = null;
    next1.disabled = true;
    fileInput.value = '';
  });

  function handleFile(file) {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) { alert('La imagen supera los 10 MB.'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      spaceImageData = e.target.result;
      spaceImg.src = spaceImageData;
      uploadArea.style.display = 'none';
      previewSpace.style.display = '';
      next1.disabled = false;
    };
    reader.readAsDataURL(file);
  }

  next1.addEventListener('click', () => goToStep(1));

  // Step 2: Tabs
  const tabs = modal.querySelectorAll('.viz-tab');
  const tabContents = [document.getElementById('vizTabCatalog'), document.getElementById('vizTabCustom')];
  const next2 = document.getElementById('vizNext2');
  const back2 = document.getElementById('vizBack2');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const isCatalog = tab.dataset.tab === 'catalog';
      tabContents[0].classList.toggle('active', isCatalog);
      tabContents[1].classList.toggle('active', !isCatalog);
      isCustom = !isCatalog;
      validateStep2();
    });
  });

  // Catalog selection
  const catalogCards = modal.querySelectorAll('.viz-catalog-card');
  catalogCards.forEach(card => {
    card.addEventListener('click', () => {
      catalogCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedObra = card.dataset.obra;
      selectedObraImg = card.dataset.img;
      validateStep2();
    });
  });

  // Custom form validation
  const vizPaleta = document.getElementById('vizPaleta');
  const vizTamaño = document.getElementById('vizTamaño');
  const vizEstilo = document.getElementById('vizEstilo');
  const vizConcepto = document.getElementById('vizConcepto');
  [vizPaleta, vizTamaño, vizEstilo, vizConcepto].forEach(el => {
    el.addEventListener('change', validateStep2);
    el.addEventListener('input', validateStep2);
  });

  function validateStep2() {
    if (isCustom) {
      next2.disabled = !(vizPaleta.value && vizTamaño.value);
    } else {
      next2.disabled = !selectedObra;
    }
  }

  next2.addEventListener('click', () => goToStep(2));
  back2.addEventListener('click', () => goToStep(0));

  // Step 3: Summary + Send
  const back3 = document.getElementById('vizBack3');
  const sendBtn = document.getElementById('vizSend');

  back3.addEventListener('click', () => goToStep(1));

  function buildSummary() {
    const summaryImg = document.getElementById('vizSummarySpaceImg');
    const details = document.getElementById('vizSummaryDetails');
    summaryImg.src = spaceImageData || '';

    let html = '';
    if (isCustom) {
      html += item('Tipo', 'Obra personalizada');
      if (vizPaleta.value) html += item('Paleta', vizPaleta.value);
      if (vizTamaño.value) html += item('Tamaño', vizTamaño.value);
      if (vizEstilo.value) html += item('Estilo', vizEstilo.value);
      if (vizConcepto.value) html += item('Concepto', vizConcepto.value);
    } else {
      html += item('Obra seleccionada', selectedObra);
      if (selectedObraImg) html += `<img class="viz-summary-obra-img" src="${selectedObraImg}" alt="${selectedObra}">`;
    }
    details.innerHTML = html;

    // Build WhatsApp link
    let msg = 'Hola Juan! Vi tu web y quiero consultarte.\n\n';
    if (isCustom) {
      msg += '🎨 Me interesa una OBRA PERSONALIZADA:\n';
      if (vizPaleta.value) msg += `• Paleta: ${vizPaleta.value}\n`;
      if (vizTamaño.value) msg += `• Tamaño: ${vizTamaño.value}\n`;
      if (vizEstilo.value) msg += `• Estilo: ${vizEstilo.value}\n`;
      if (vizConcepto.value) msg += `• Concepto: ${vizConcepto.value}\n`;
    } else {
      msg += `🖼️ Me interesa la obra "${selectedObra}" para mi espacio.\n`;
    }
    msg += '\n📸 Adjunté una foto de mi espacio en el visualizador de tu web.';
    msg += '\n\n¿Podemos coordinar?';

    sendBtn.href = `https://wa.me/5491161592163?text=${encodeURIComponent(msg)}`;
  }

  function item(label, value) {
    return `<div class="viz-summary-item"><span class="viz-summary-label">${label}</span><span class="viz-summary-value">${value}</span></div>`;
  }
}

/* ===== SCROLL EXPANSION — GALERÍA ===== */
function initScrollExpand() {
  const section = document.getElementById('scrollExpand');
  if (!section) return;

  const media = document.getElementById('seMedia');
  const title = document.getElementById('seTitle');
  const subtitle = document.getElementById('seSubtitle');
  const gallery = document.getElementById('seGallery');
  const hint = document.getElementById('seHint');
  const isMobile = window.innerWidth < 768;

  const startW = isMobile ? 220 : 300;
  const startH = isMobile ? 280 : 380;

  // Init row arrows inside gallery
  const rowContainer = section.querySelector('.se-row-container');
  if (rowContainer) {
    const track = rowContainer.querySelector('.row-track');
    const left = rowContainer.querySelector('.row-arrow-left');
    const right = rowContainer.querySelector('.row-arrow-right');
    if (track && left && right) {
      const scrollAmt = () => track.clientWidth * 0.75;
      left.addEventListener('click', () => track.scrollBy({ left: -scrollAmt(), behavior: 'smooth' }));
      right.addEventListener('click', () => track.scrollBy({ left: scrollAmt(), behavior: 'smooth' }));
    }
  }

  window.addEventListener('scroll', () => {
    const rect = section.getBoundingClientRect();
    const sectionH = section.offsetHeight;
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    const scrolled = -rect.top;
    const total = sectionH - vh;
    if (total <= 0) return;

    const p = Math.max(0, Math.min(1, scrolled / total));

    // Phase 1 (0→0.55): Card expands from small to fullscreen
    // Phase 2 (0.5→1): Gallery content fades in, title shrinks to top-left
    const expandP = Math.min(1, p / 0.55);
    const revealP = Math.max(0, (p - 0.5) / 0.5);

    // --- Card expansion ---
    const w = startW + expandP * (vw - startW);
    const h = startH + expandP * (vh - startH);
    const radius = 18 * (1 - expandP);

    media.style.width = w + 'px';
    media.style.height = h + 'px';
    media.style.borderRadius = radius + 'px';
    media.style.clipPath = `inset(0 round ${radius}px)`;
    media.style.boxShadow = expandP < 1
      ? `0 ${20 * (1 - expandP)}px ${60 * (1 - expandP)}px rgba(0,0,0,${0.4 * (1 - expandP)})`
      : 'none';

    // --- Title morph: centered → top-left ---
    // left: 50%→3%, top: 50%→8%, translate: -50%→0%, fontSize: 3.2→1.4
    const tLeft = 50 - revealP * (isMobile ? 44 : 47);
    const tTop = 50 - revealP * (isMobile ? 40 : 42);
    const tTx = -50 * (1 - revealP);
    const tTy = -50 * (1 - revealP);
    const tSize = isMobile ? 1.6 - revealP * 0.5 : 2.2 - revealP * 0.9;

    title.style.left = tLeft + '%';
    title.style.top = tTop + '%';
    title.style.transform = `translate(${tTx}%, ${tTy}%)`;
    title.style.fontSize = tSize + 'rem';

    // --- Subtitle below title ---
    subtitle.style.left = tLeft + '%';
    subtitle.style.top = (tTop + (isMobile ? 6 : 5)) + '%';
    subtitle.style.transform = `translate(${tTx}%, ${tTy}%)`;
    subtitle.style.opacity = Math.max(0, (revealP - 0.6) / 0.4);

    // --- Gallery cards reveal ---
    if (revealP > 0.15) {
      gallery.classList.add('visible');
      gallery.style.opacity = Math.min(1, (revealP - 0.15) / 0.45);
    } else {
      gallery.classList.remove('visible');
      gallery.style.opacity = 0;
    }

    // --- Hint fades out quickly ---
    hint.style.opacity = Math.max(0, 1 - p * 5);
  }, { passive: true });

  // Init dots for gallery
  const track = section.querySelector('.row-track');
  const dotsContainer = document.getElementById('obrasDots');
  if (track && dotsContainer) {
    const cards = track.querySelectorAll('.card');
    const dotsCount = Math.min(cards.length, 10);
    for (let i = 0; i < dotsCount; i++) {
      const dot = document.createElement('div');
      dot.classList.add('row-dot');
      if (i === 0) dot.classList.add('active');
      dotsContainer.appendChild(dot);
    }
    const dots = dotsContainer.querySelectorAll('.row-dot');
    track.addEventListener('scroll', () => {
      const scrollPct = track.scrollLeft / (track.scrollWidth - track.clientWidth);
      const activeIndex = Math.round(scrollPct * (dotsCount - 1));
      dots.forEach((d, i) => d.classList.toggle('active', i === activeIndex));
    }, { passive: true });
  }
}

function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const n = form.querySelector('#nombre').value;
    const em = form.querySelector('#email').value;
    const a = form.querySelector('#asunto').value;
    const m = form.querySelector('#mensaje').value;
    const t = encodeURIComponent(`Hola Juan! Soy ${n} (${em}).\n\nAsunto: ${a}\n\n${m}`);
    window.open(`https://wa.me/5491161592163?text=${t}`, '_blank');
    form.reset();
  });
}
