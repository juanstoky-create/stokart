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
  initRowArrows();
  initCarousel();
  initFAB();
  initForm();
  initHeroParallax();
  initBioModal();
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

/* ===== ROW ARROWS (Netflix scroll) ===== */
function initRowArrows() {
  document.querySelectorAll('.row-container').forEach(container => {
    const track = container.querySelector('.row-track');
    const left = container.querySelector('.row-arrow-left');
    const right = container.querySelector('.row-arrow-right');
    if (!track) return;

    const scrollAmount = () => track.clientWidth * 0.75;

    if (left) left.addEventListener('click', () => {
      track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });
    if (right) right.addEventListener('click', () => {
      track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    });
  });
}

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

/* ===== FORM → WhatsApp ===== */
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
