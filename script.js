/* ===== LOADER ===== */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    document.body.style.overflow = '';
    init();
  }, 800);
});
document.body.style.overflow = 'hidden';

function init() {
  initNav();
  initScrollReveal();
  initBeforeAfter();
  initPiezaClicks();
  initTestimonials();
  initFAB();
  initForm();
  initHeroParallax();
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
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ===== PIEZA CARD CLICKS → WhatsApp ===== */
function initPiezaClicks() {
  document.querySelectorAll('.pieza-card[data-wa]').forEach(card => {
    card.addEventListener('click', () => {
      const msg = encodeURIComponent(card.dataset.wa);
      window.open(`https://wa.me/5491161592163?text=${msg}`, '_blank');
    });
  });
}

/* ===== BEFORE/AFTER SLIDER ===== */
function initBeforeAfter() {
  const container = document.getElementById('beforeAfter');
  const after = document.getElementById('baAfter');
  const slider = document.getElementById('baSlider');
  if (!container || !after || !slider) return;

  let dragging = false;

  function syncOscillation() {
    if (dragging || slider.classList.contains('dragged')) return;
    const sliderRect = slider.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const pct = ((sliderRect.left + sliderRect.width / 2 - containerRect.left) / containerRect.width) * 100;
    after.style.clipPath = `inset(0 0 0 ${pct}%)`;
    requestAnimationFrame(syncOscillation);
  }
  requestAnimationFrame(syncOscillation);

  function setPosition(x) {
    const rect = container.getBoundingClientRect();
    let pct = ((x - rect.left) / rect.width) * 100;
    pct = Math.max(5, Math.min(95, pct));
    after.style.clipPath = `inset(0 0 0 ${pct}%)`;
    slider.style.left = `${pct}%`;
    slider.classList.add('dragged');
    slider.style.animation = 'none';
  }

  container.addEventListener('mousedown', (e) => { dragging = true; setPosition(e.clientX); });
  window.addEventListener('mouseup', () => { dragging = false; });
  window.addEventListener('mousemove', (e) => { if (dragging) setPosition(e.clientX); });

  container.addEventListener('touchstart', (e) => { dragging = true; setPosition(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend', () => { dragging = false; });
  window.addEventListener('touchmove', (e) => { if (dragging) setPosition(e.touches[0].clientX); }, { passive: true });
}

/* ===== TESTIMONIALS ===== */
function initTestimonials() {
  const testimonials = document.querySelectorAll('.testimonial');
  const dotsContainer = document.getElementById('testimonialDots');
  if (!testimonials.length || !dotsContainer) return;

  let current = 0;
  const total = testimonials.length;

  // Create dots
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

  // Auto-cycle
  let auto = setInterval(() => go(current < total - 1 ? current + 1 : 0), 5000);
  const parent = testimonials[0].parentElement;
  parent.addEventListener('mouseenter', () => clearInterval(auto));
  parent.addEventListener('mouseleave', () => {
    auto = setInterval(() => go(current < total - 1 ? current + 1 : 0), 5000);
  });
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

/* ===== CONTACT FORM → WhatsApp ===== */
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
