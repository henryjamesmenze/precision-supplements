document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNavbar();
  initMobileMenu();
  initParticles();
  initParallax();
  initScrollReveal();
  initTestimonialCarousel();
  initNewsletter();
  initSmoothAnchors();
});

/* ===== Custom Cursor ===== */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!cursor || !ring || window.innerWidth < 768) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const interactive = document.querySelectorAll('a, button, .product-card, .blog-card, .carousel-dot, input');
  interactive.forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('hover');
      cursor.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('hover');
      cursor.classList.remove('hover');
    });
  });
}

/* ===== Navbar Scroll ===== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');

  if (!toggle || !menu) return;

  const bars = toggle.querySelectorAll('.menu-bar');

  toggle.addEventListener('click', () => {

    const isOpen = !menu.classList.contains('hidden');

    menu.classList.toggle('hidden');

    toggle.setAttribute(
      'aria-expanded',
      String(!isOpen)
    );

    if (!isOpen) {

      // Abrir
      bars[0].classList.add('translate-y-2', 'rotate-45');
      bars[1].classList.add('opacity-0');
      bars[2].classList.add('-translate-y-2', '-rotate-45');

    } else {

      // Cerrar
      bars[0].classList.remove('translate-y-2', 'rotate-45');
      bars[1].classList.remove('opacity-0');
      bars[2].classList.remove('-translate-y-2', '-rotate-45');

    }
  });


  // Cerrar al seleccionar una opción
  menu.querySelectorAll('a').forEach(link => {

    link.addEventListener('click', () => {

      menu.classList.add('hidden');

      toggle.setAttribute(
        'aria-expanded',
        'false'
      );

      bars[0].classList.remove('translate-y-2', 'rotate-45');
      bars[1].classList.remove('opacity-0');
      bars[2].classList.remove('-translate-y-2', '-rotate-45');

    });

  });
}

/* ===== Particle Background ===== */
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticles() {
    const width = canvas.parentElement.clientWidth;
    const height = canvas.parentElement.clientHeight;

    const count = Math.min(Math.floor(width / 12), 80);

    particles = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }
  }

  function draw() {
    const width = canvas.parentElement.clientWidth;
    const height = canvas.parentElement.clientHeight;

    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;

      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(198, 255, 61, ${p.opacity})`;
      ctx.fill();

      // Connections
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];

        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);

          ctx.strokeStyle =
            `rgba(198, 255, 61, ${0.06 * (1 - dist / 120)})`;

          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    animationId = requestAnimationFrame(draw);
  }

  function restart() {
    cancelAnimationFrame(animationId);

    resize();
    createParticles();
    draw();
  }

  restart();

  window.addEventListener('resize', restart);
}

/* ===== Hero Parallax ===== */
function initParallax() {
  const bottle = document.getElementById('hero-bottle');
  const heroGlow = document.querySelector('.hero-glow');
  if (!bottle) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight;

    if (scrollY < heroHeight) {
      const progress = scrollY / heroHeight;
      bottle.style.transform = `translateY(${scrollY * 0.3}px) rotate(${progress * 2}deg)`;
      if (heroGlow) {
        heroGlow.style.transform = `translate(-50%, ${scrollY * 0.15}px)`;
      }
    }
  }, { passive: true });

  document.addEventListener('mousemove', (e) => {
    if (window.scrollY > window.innerHeight) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    bottle.style.marginLeft = x + 'px';
    bottle.style.marginTop = y + 'px';
  });
}

/* ===== Scroll Reveal ===== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  reveals.forEach(el => {
    observer.observe(el);
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    }
  });
}

/* ===== Testimonial Carousel ===== */
function initTestimonialCarousel() {
  const track = document.getElementById('testimonial-track');
  const prevBtn = document.getElementById('prev-testimonial');
  const nextBtn = document.getElementById('next-testimonial');
  const dotsContainer = document.getElementById('carousel-dots');
  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let currentIndex = 0;
  let autoplayInterval;

  function getVisibleCount() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - getVisibleCount());
  }

  function createDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const maxIndex = getMaxIndex();
    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function goTo(index) {
    currentIndex = Math.max(0, Math.min(index, getMaxIndex()));
    const card = cards[0];
    if (!card) return;

    const gap = 24;
    const cardWidth = card.offsetWidth + gap;
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    updateDots();
  }

  prevBtn.addEventListener('click', () => {
    goTo(currentIndex <= 0 ? getMaxIndex() : currentIndex - 1);
    resetAutoplay();
  });

  nextBtn.addEventListener('click', () => {
    goTo(currentIndex >= getMaxIndex() ? 0 : currentIndex + 1);
    resetAutoplay();
  });

  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      goTo(currentIndex >= getMaxIndex() ? 0 : currentIndex + 1);
    }, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  createDots();
  startAutoplay();

  window.addEventListener('resize', () => {
    createDots();
    goTo(Math.min(currentIndex, getMaxIndex()));
  });
}

/* ===== Newsletter ===== */
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const btn = form.querySelector('button');
    const originalText = btn.textContent;

    btn.textContent = 'Subscribed!';
    btn.style.background = '#A8E020';
    input.value = '';

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
    }, 3000);
  });
}

/* ===== Smooth Anchor Links ===== */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}
