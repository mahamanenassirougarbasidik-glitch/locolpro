/* LocolPro — interactions & animations v2 */
(function () {
  'use strict';

  // ---- Sticky nav shadow ----
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---- Scroll reveal ----
  const revealEls = document.querySelectorAll('.reveal-on-view');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // ---- Count-up stats ----
  const counters = document.querySelectorAll('[data-count]');
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = (el.dataset.count.split('.')[1] || '').length;
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const dur = 1600;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = (target * eased).toFixed(decimals);
      el.textContent = prefix + Number(val).toLocaleString('fr-FR') + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target.toLocaleString('fr-FR') + suffix;
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window && counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach((el) => cio.observe(el));
  }

  // ---- Subtle parallax on hero bg ----
  const hero = document.querySelector('.hero');
  if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        hero.style.setProperty('--parallax', (y * 0.18) + 'px');
      }
    }, { passive: true });
  }

  // ---- Language toggle FR/EN ----
  const langButtons = document.querySelectorAll('.lang-toggle button');
  const setLang = (lang) => {
    document.documentElement.setAttribute('lang', lang);
    document.querySelectorAll('[data-fr]').forEach((el) => {
      const val = el.getAttribute('data-' + lang);
      if (val == null) return;
      if (el.hasAttribute('data-attr')) el.setAttribute(el.getAttribute('data-attr'), val);
      else el.innerHTML = val;
    });
    langButtons.forEach((b) => b.classList.toggle('active', b.dataset.lang === lang));
    try { localStorage.setItem('locolpro-lang', lang); } catch (e) {}
  };
  langButtons.forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));
  let saved = 'fr';
  try { saved = localStorage.getItem('locolpro-lang') || 'fr'; } catch (e) {}
  if (saved === 'en') setLang('en');

  // ---- Mobile menu ----
  const burger = document.querySelector('.nav-burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
})();
