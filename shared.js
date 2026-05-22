/* ============================================
   STACKLY FARM — SHARED.JS
   Loader · Header · Mobile Menu · Animations
============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════
     PAGE LOADER — 2s minimum
  ══════════════════════════════ */
  const loader = document.getElementById('page-loader');
  if (loader) {
    const startTime = Date.now();
    const minDuration = 2000; // 2 seconds minimum

    function hideLoader() {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDuration - elapsed);
      setTimeout(() => {
        loader.classList.add('hide');
        // Remove from DOM after transition
        loader.addEventListener('transitionend', () => {
          loader.remove();
        }, { once: true });
      }, remaining);
    }

    // Hide after page + min duration
    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader);
    }
  }

  /* ══════════════════════════════
     DESKTOP HEADER SCROLL
  ══════════════════════════════ */
  const siteHeader = document.querySelector('.site-header');
  function updateHeader() {
    if (!siteHeader) return;
    siteHeader.classList.toggle('scrolled', window.scrollY > 60);
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* ══════════════════════════════
     MOBILE MENU
  ══════════════════════════════ */
  const hamburger   = document.querySelector('.site-hamburger');
  const mobileMenu  = document.querySelector('.site-mobile-menu');
  const closeBtn    = document.querySelector('.site-close-menu');
  const mobileLinks = document.querySelectorAll('.site-mobile-nav a');

  function openMobileMenu() {
    hamburger?.classList.add('active');
    mobileMenu?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    hamburger?.classList.remove('active');
    mobileMenu?.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileMenu?.classList.contains('active') ? closeMobileMenu() : openMobileMenu();
  });

  closeBtn?.addEventListener('click', closeMobileMenu);

  mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

  mobileMenu?.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMobileMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  /* ══════════════════════════════
     SCROLL REVEAL
  ══════════════════════════════ */
  const revealEls = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .will-reveal'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ══════════════════════════════
     STAGGER CHILDREN
  ══════════════════════════════ */
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    const delay = parseFloat(parent.dataset.stagger) || 0.1;
    [...parent.children].forEach((child, i) => {
      child.style.transitionDelay = `${i * delay}s`;
    });
  });

  /* ══════════════════════════════
     COUNT-UP ANIMATION
  ══════════════════════════════ */
  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-target') || el.textContent);
    if (isNaN(target)) return;
    let start = 0;
    const duration = 1800;
    const step = timestamp => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(step);
  }

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.count-up').forEach(el => countObserver.observe(el));

  /* ══════════════════════════════
     SMOOTH SCROLL ANCHORS
  ══════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      closeMobileMenu();
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    });
  });

  /* ══════════════════════════════
     NEWSLETTER
  ══════════════════════════════ */
  const nlBtn = document.getElementById('nlBtn');
  const nlEmail = document.getElementById('nlEmail');
  const nlSuccess = document.getElementById('nlSuccess');
  nlBtn?.addEventListener('click', () => {
    if (nlEmail?.value.includes('@')) {
      if (nlSuccess) {
        nlSuccess.style.display = 'flex';
        nlSuccess.classList.add('show');
      }
      nlEmail.value = '';
    }
  });

  console.log('✅ Stackly Farm — Shared JS Loaded');
});