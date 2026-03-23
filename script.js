/* =====================================================
   TEDISANXD PORTFOLIO — script.js
   Made by Tedisanxd | Original Work
   ===================================================== */

'use strict';

/* =====================================================
   LOADER
   ===================================================== */
document.body.style.overflow = 'hidden';

window.addEventListener('load', () => {
  // Wait for the loader bar to finish, then hide
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    document.body.style.overflow = '';
    // Kick off scroll-triggered animations
    initReveal();
    initSkillBars();
    initCounters();
  }, 1700);
});

/* =====================================================
   THEME TOGGLE
   ===================================================== */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = document.getElementById('theme-icon');
const html        = document.documentElement;

// Load saved preference
const savedTheme = localStorage.getItem('tedisTheme') || 'dark';
html.setAttribute('data-theme', savedTheme);
applyThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('tedisTheme', next);
  applyThemeIcon(next);
});

function applyThemeIcon(theme) {
  if (!themeIcon) return;
  themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

/* =====================================================
   CUSTOM CURSOR
   ===================================================== */
const cursor         = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');
let   mouseX = 0, mouseY = 0;
let   fX = 0,     fY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursor) {
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  }
});

(function followCursor() {
  fX += (mouseX - fX) * 0.11;
  fY += (mouseY - fY) * 0.11;
  if (cursorFollower) {
    cursorFollower.style.left = fX + 'px';
    cursorFollower.style.top  = fY + 'px';
  }
  requestAnimationFrame(followCursor);
})();

// Hover effects on interactive elements
const interactiveSelectors = 'a, button, .skill-card, .project-card, .service-card, .why-card, .contact-card, .filter-btn, .tag';

document.querySelectorAll(interactiveSelectors).forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor?.classList.add('hovering');
    cursorFollower?.classList.add('hovering');
  });
  el.addEventListener('mouseleave', () => {
    cursor?.classList.remove('hovering');
    cursorFollower?.classList.remove('hovering');
  });
});

/* =====================================================
   NAVBAR — scroll & mobile
   ===================================================== */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  // Sticky glass effect
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateScrollProgress();
  updateActiveNav();
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

/* =====================================================
   SCROLL PROGRESS BAR
   ===================================================== */
function updateScrollProgress() {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  const bar        = document.getElementById('scroll-progress');
  if (bar) bar.style.width = pct + '%';
}

/* =====================================================
   ACTIVE NAV HIGHLIGHTING
   ===================================================== */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const offset   = window.scrollY + 130;

  sections.forEach(section => {
    const id     = section.getAttribute('id');
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;

    if (offset >= top && offset < bottom) {
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.section === id);
      });
    }
  });
}

/* =====================================================
   HERO CANVAS — particle network
   ===================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h, particles;

  function resize() {
    w = canvas.width  = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  resize();

  window.addEventListener('resize', () => {
    resize();
    buildParticles();
  }, { passive: true });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * w;
      this.y  = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.38;
      this.vy = (Math.random() - 0.5) * 0.38;
      this.r  = Math.random() * 1.8 + 0.4;
      this.a  = Math.random() * 0.45 + 0.08;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${this.a})`;
      ctx.fill();
    }
  }

  function buildParticles() {
    const count = Math.min(Math.floor((w * h) / 16000), 90);
    particles = Array.from({ length: count }, () => new Particle());
  }

  function drawConnections() {
    const MAX = 140;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${(1 - dist / MAX) * 0.12})`;
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function drawGrid() {
    const S = 64;
    ctx.strokeStyle = 'rgba(0,212,255,0.025)';
    ctx.lineWidth   = 1;
    for (let x = 0; x <= w; x += S) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y <= h; y += S) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
  }

  function drawGlow() {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.min(w, h) * 0.55);
    g.addColorStop(0,   'rgba(0,212,255,0.035)');
    g.addColorStop(0.5, 'rgba(139,92,246,0.018)');
    g.addColorStop(1,   'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    drawGrid();
    drawGlow();
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }

  buildParticles();
  animate();
}

/* =====================================================
   TYPED TEXT EFFECT
   ===================================================== */
function initTyped() {
  const el = document.querySelector('.typed-text');
  if (!el) return;

  const phrases = [
    'performance tools.',
    'system optimizers.',
    'custom software.',
    'game utilities.',
    'automation scripts.',
    'desktop applications.',
    'tracking tools.',
  ];

  let pIdx = 0, cIdx = 0, deleting = false, delay = 120;

  function tick() {
    const cur = phrases[pIdx];
    if (deleting) {
      el.textContent = cur.slice(0, --cIdx);
      delay = 55;
    } else {
      el.textContent = cur.slice(0, ++cIdx);
      delay = 115;
    }

    if (!deleting && cIdx === cur.length) {
      delay     = 2200;
      deleting  = true;
    } else if (deleting && cIdx === 0) {
      deleting = false;
      pIdx     = (pIdx + 1) % phrases.length;
      delay    = 380;
    }

    setTimeout(tick, delay);
  }

  setTimeout(tick, 900);
}

/* =====================================================
   COUNTER ANIMATION
   ===================================================== */
function animateCount(el, target) {
  let val  = 0;
  const inc = target / 45;
  const t = setInterval(() => {
    val += inc;
    if (val >= target) { val = target; clearInterval(t); }
    el.textContent = Math.floor(val);
  }, 36);
}

function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target, +entry.target.dataset.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  counters.forEach(c => obs.observe(c));
}

/* =====================================================
   SCROLL REVEAL
   ===================================================== */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -55px 0px' });
  els.forEach(el => obs.observe(el));
}

/* =====================================================
   SKILL BAR ANIMATION
   ===================================================== */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  const obs  = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.width = entry.target.dataset.width + '%';
        }, 180);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(b => obs.observe(b));
}

/* =====================================================
   PROJECT FILTERS
   ===================================================== */
function initFilters() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        const cats = card.dataset.categories || '';
        const show = filter === 'all' || cats.includes(filter);
        card.classList.toggle('hidden', !show);
        if (show) {
          card.style.animation = 'none';
          card.offsetHeight;   // force reflow
          card.style.animation = 'fadeUpAnim 0.4s ease forwards';
        }
      });
    });
  });
}

/* =====================================================
   SMOOTH SCROLL (fallback for older browsers)
   ===================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* =====================================================
   STAGGER DELAYS FOR GRID CARDS
   ===================================================== */
function applyStaggerDelays() {
  const configs = [
    { selector: '.skills-grid .skill-card',   ms: 75 },
    { selector: '.services-grid .service-card', ms: 55 },
    { selector: '.why-grid .why-card',         ms: 80 },
    { selector: '.projects-grid .project-card', ms: 90 },
  ];
  configs.forEach(({ selector, ms }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.style.transitionDelay = (i * ms) + 'ms';
    });
  });
}

/* =====================================================
   FOOTER YEAR
   ===================================================== */
function setYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* =====================================================
   HOVER GLOW EFFECT — project cards follow mouse
   ===================================================== */
function initCardGlow() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x     = e.clientX - rect.left;
      const y     = e.clientY - rect.top;
      const glow  = card.querySelector('.project-glow');
      if (glow) {
        glow.style.top  = (y - 90) + 'px';
        glow.style.left = (x - 90) + 'px';
      }
    });
  });
}

/* =====================================================
   INIT
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvas();
  initTyped();
  initFilters();
  initSmoothScroll();
  applyStaggerDelays();
  initCardGlow();
  setYear();

  // Register hover cursor tracking for dynamically added elements
  document.querySelectorAll(
    'a, button, .skill-card, .project-card, .service-card, .why-card, .contact-card, .filter-btn, .tag'
  ).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor?.classList.add('hovering');
      cursorFollower?.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursor?.classList.remove('hovering');
      cursorFollower?.classList.remove('hovering');
    });
  });
});
