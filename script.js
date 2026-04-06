/* ===== LOADER ===== */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    document.body.style.overflow = '';
    initAnimations();
  }, 900);
});
document.body.style.overflow = 'hidden';

/* ===== NAV ===== */
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
let lastScroll = 0;

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 100) {
    nav.classList.toggle('hidden', currentScroll > lastScroll && currentScroll > 300);
  } else {
    nav.classList.remove('hidden');
  }
  lastScroll = currentScroll;
}, { passive: true });

/* ===== HERO CANVAS — Subtle particle field ===== */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.min(60, Math.floor(w * h / 20000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.3 + 0.1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const scrollFade = Math.max(0, 1 - window.scrollY / (h * 0.8));

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 169, 110, ${p.opacity * scrollFade})`;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(201, 169, 110, ${0.06 * (1 - dist / 150) * scrollFade})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener('resize', () => { resize(); createParticles(); });
}

/* ===== INIT ALL ANIMATIONS ===== */
function initAnimations() {
  initHeroCanvas();
  initScrollReveal();
  initWordReveal();
  initObrasScroll();
  initCarousel();
  initFAB();
  initFilters();
  initForm();
}

/* --- Scroll Reveal (fade, slide, scale) --- */
function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-fade, .scroll-reveal-up, .scroll-scale');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseFloat(entry.target.style.animationDelay || 0) * 1000;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px',
  });

  elements.forEach(el => observer.observe(el));
}

/* --- Word-by-word reveal (Statement section) --- */
function initWordReveal() {
  const words = document.querySelectorAll('.word-reveal');
  if (!words.length) return;

  const section = document.querySelector('.statement');

  function updateWords() {
    const rect = section.getBoundingClientRect();
    const sectionHeight = rect.height;
    const viewportHeight = window.innerHeight;

    const start = viewportHeight;
    const end = -sectionHeight;
    const range = start - end;
    const progress = (start - rect.top) / range;

    words.forEach((word, i) => {
      const wordProgress = i / words.length;
      const threshold = wordProgress * 0.6 + 0.15;

      if (progress > threshold) {
        word.classList.add('active');
      } else {
        word.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateWords, { passive: true });
  updateWords();
}

/* --- Obras horizontal scroll with drag --- */
function initObrasScroll() {
  const container = document.querySelector('.obras-scroll-container');
  if (!container) return;

  let isDown = false, startX, scrollLeft;

  container.addEventListener('mousedown', (e) => {
    isDown = true;
    container.style.cursor = 'grabbing';
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });
  container.addEventListener('mouseleave', () => { isDown = false; container.style.cursor = 'grab'; });
  container.addEventListener('mouseup', () => { isDown = false; container.style.cursor = 'grab'; });
  container.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    container.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });

  container.style.cursor = 'grab';

  // Animate cards as they scroll into view
  const cards = container.querySelectorAll('.obra-card');
  let staggerIndex = 0;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, staggerIndex * 100);
        staggerIndex++;
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => observer.observe(card));
}

/* --- Carousel --- */
function initCarousel() {
  const track = document.getElementById('clientesTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');
  if (!track) return;

  const cards = track.querySelectorAll('.cliente-card');
  let current = 0;
  const total = cards.length;

  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('carousel-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  prevBtn.addEventListener('click', () => goTo(current > 0 ? current - 1 : total - 1));
  nextBtn.addEventListener('click', () => goTo(current < total - 1 ? current + 1 : 0));

  let autoplay = setInterval(() => goTo(current < total - 1 ? current + 1 : 0), 5000);
  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoplay));
  track.parentElement.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => goTo(current < total - 1 ? current + 1 : 0), 5000);
  });

  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextBtn.click() : prevBtn.click();
    }
  });
}

/* --- FAB WhatsApp --- */
function initFAB() {
  const fab = document.getElementById('fabWa');
  if (!fab) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      fab.classList.toggle('visible', !entry.isIntersecting);
    });
  }, { threshold: 0.5 });

  observer.observe(document.getElementById('hero'));
}

/* --- Filters --- */
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.obra-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          setTimeout(() => card.classList.add('visible'), 50);
        } else {
          card.classList.remove('visible');
          setTimeout(() => { card.style.display = 'none'; }, 400);
        }
      });
    });
  });
}

/* --- Form → WhatsApp --- */
function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = form.querySelector('#nombre').value;
    const email = form.querySelector('#email').value;
    const asunto = form.querySelector('#asunto').value;
    const mensaje = form.querySelector('#mensaje').value;

    const text = encodeURIComponent(
      `Hola Juan! Soy ${nombre} (${email}).\n\nAsunto: ${asunto}\n\n${mensaje}`
    );
    window.open(`https://wa.me/5491161592163?text=${text}`, '_blank');
    form.reset();
  });
}
