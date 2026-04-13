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
  initFeaturedCarousel();
  initCardClicks();
  initTestimonials();
  initFAB();
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

/* ===== FEATURED CAROUSEL ===== */
function initFeaturedCarousel() {
  const slides = document.querySelectorAll('.featured-slide');
  const prev = document.getElementById('featuredPrev');
  const next = document.getElementById('featuredNext');
  const dotsContainer = document.getElementById('featuredDots');
  if (!slides.length || !dotsContainer) return;

  let current = 0;
  const total = slides.length;

  // Create dots
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    dot.classList.add('f-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => go(i));
    dotsContainer.appendChild(dot);
  }

  function go(n) {
    slides[current].classList.remove('active');
    current = n;
    slides[current].classList.add('active');
    dotsContainer.querySelectorAll('.f-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prev.addEventListener('click', () => go(current > 0 ? current - 1 : total - 1));
  next.addEventListener('click', () => go(current < total - 1 ? current + 1 : 0));

  // Slide clicks → WhatsApp
  slides.forEach(slide => {
    if (slide.dataset.wa) {
      slide.addEventListener('click', () => {
        window.open(`https://wa.me/5491161592163?text=${encodeURIComponent(slide.dataset.wa)}`, '_blank');
      });
    }
  });

  // Auto-cycle
  let auto = setInterval(() => go(current < total - 1 ? current + 1 : 0), 5000);
  const carousel = document.getElementById('featuredCarousel');
  carousel.addEventListener('mouseenter', () => clearInterval(auto));
  carousel.addEventListener('mouseleave', () => {
    auto = setInterval(() => go(current < total - 1 ? current + 1 : 0), 5000);
  });

  // Touch swipe
  let tx = 0;
  carousel.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const d = tx - e.changedTouches[0].clientX;
    if (Math.abs(d) > 50) d > 0 ? next.click() : prev.click();
  });
}

/* ===== CARD CLICKS → WhatsApp (mosaic + featured) ===== */
function initCardClicks() {
  document.querySelectorAll('.mosaic-card[data-wa]').forEach(card => {
    card.addEventListener('click', () => {
      const msg = encodeURIComponent(card.dataset.wa);
      window.open(`https://wa.me/5491161592163?text=${msg}`, '_blank');
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

