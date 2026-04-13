// ─── Nav: shadow on scroll ───────────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ─── Nav: active link highlighting ───────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');

function setActiveNav() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}
window.addEventListener('scroll', setActiveNav, { passive: true });
setActiveNav();

// ─── Mobile burger menu ───────────────────────────────────────────────────────
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav__links');

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  burger.classList.toggle('open');
  burger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
  });
});

// ─── Hero parallax ───────────────────────────────────────────────────────────
const heroGrid = document.querySelector('.hero__bg-grid');
const heroBolt = document.querySelector('.hero__bolt');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (heroGrid) heroGrid.style.transform = `translateY(${y * 0.25}px)`;
  if (heroBolt) heroBolt.style.transform = `translateY(${y * 0.15}px)`;
}, { passive: true });

// ─── Animated stat counters ──────────────────────────────────────────────────
function animateCounter(el, target, suffix, duration = 1200) {
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    // ease out quart
    const ease = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.round(ease * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterMap = {
  'Years Experience':        { val: 3,   suffix: '+' },
  'Hours Saved / Quarter':   { val: 100, suffix: '+' },
  'Reporting Effort Reduced':{ val: 25,  suffix: '%' },
};

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const label = entry.target.querySelector('.stat-card__label')?.textContent.trim();
    const numEl = entry.target.querySelector('.stat-card__num');
    if (label && numEl && counterMap[label]) {
      const { val, suffix } = counterMap[label];
      animateCounter(numEl, val, suffix);
    }
    statObserver.unobserve(entry.target);
  });
}, { threshold: 0.6 });

document.querySelectorAll('.stat-card').forEach(el => statObserver.observe(el));

// ─── Scroll-triggered fade-ins with stagger ──────────────────────────────────
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

// Stagger children of these containers
function staggerChildren(selector, childSelector, delayStep = 80) {
  document.querySelectorAll(selector).forEach(parent => {
    parent.querySelectorAll(childSelector).forEach((child, i) => {
      child.classList.add('fade-in');
      child.style.transitionDelay = `${i * delayStep}ms`;
      fadeObserver.observe(child);
    });
  });
}

// Individual fade-ins for sections / cards
document.querySelectorAll('.section__heading, .section__label, .timeline__card, .about__text, .contact__sub, .contact__links')
  .forEach(el => {
    el.classList.add('fade-in');
    fadeObserver.observe(el);
  });

// Staggered groups
staggerChildren('.skills__grid',    '.skill-group',    100);
staggerChildren('.projects__grid',  '.project-card',   110);
staggerChildren('.about__stats',    '.stat-card',       80);
