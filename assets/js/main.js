/**
 * Krishna Singh — Developer Portfolio
 * Main JavaScript
 *
 * Author: Krishna Singh
 * Purpose: All interactivity for the portfolio — animations, navigation,
 *          theming, form validation, and scroll behaviour.
 *
 * Modules:
 *   1. Preloader
 *   2. Theme Toggle (dark / light + localStorage)
 *   3. Navbar (scroll style + active section + mobile menu)
 *   4. Typing Animation (custom typewriter, no library)
 *   5. Scroll Reveal (IntersectionObserver)
 *   6. Skill Bars Animation
 *   7. Counter Animation (stats)
 *   8. Project Filter
 *   9. Card 3D Tilt Effect
 *  10. Lightbox (simple inline)
 *  11. Contact Form (validation + web3forms)
 *  12. Scroll-to-Top Button
 *  13. Footer Year
 */

'use strict';

/* ============================================================
   1. PRELOADER
   ============================================================ */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('loaded');
      // Remove from DOM after transition
      preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
    }, 400);
  });
}

/* ============================================================
   2. THEME TOGGLE
   ============================================================ */
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const root = document.documentElement;

  // Load persisted preference; default is dark
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  root.setAttribute('data-theme', savedTheme);

  btn.setAttribute('aria-pressed', savedTheme === 'light');
  btn.setAttribute('aria-label', savedTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');

  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    btn.setAttribute('aria-pressed', next === 'light');
    btn.setAttribute('aria-label', next === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
  });
}

/* ============================================================
   3. NAVBAR
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  if (!navbar) return;

  // Single rAF-gated scroll handler — prevents multiple handlers competing
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 40) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        updateScrollTop();
        updateActiveNavLink();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile hamburger
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      navMenu.classList.toggle('open', !isOpen);
      hamburger.classList.toggle('active', !isOpen);
      hamburger.setAttribute('aria-expanded', String(!isOpen));
    });

    // Close on nav link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target)) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active section highlighting via IntersectionObserver
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    let current = '';
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      if (scrollY >= section.offsetTop) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      const matches = link.getAttribute('data-section') === current;
      link.classList.toggle('active', matches);
    });
  }

  // Smooth scroll on nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Initial call
  onScroll();
}

/* ============================================================
   4. TYPING ANIMATION
   ============================================================ */
function initTypingAnimation() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Full Stack Java Developer',
    'Spring Boot Engineer',
    'Microservices Architect',
    'API Designer',
    'Code Artist',
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingTimeout;

  function type() {
    const currentPhrase = phrases[phraseIndex];
    const displayText = isDeleting
      ? currentPhrase.substring(0, charIndex - 1)
      : currentPhrase.substring(0, charIndex + 1);

    el.textContent = displayText;

    if (!isDeleting) {
      charIndex++;
    } else {
      charIndex--;
    }

    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === currentPhrase.length + 1) {
      // Pause at end
      isDeleting = true;
      delay = 1800;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    typingTimeout = setTimeout(type, delay);
  }

  // Start after a short delay (let page load)
  setTimeout(type, 900);
}

/* ============================================================
   5. SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger within same parent
          const siblings = entry.target.parentElement
            ? [...entry.target.parentElement.querySelectorAll('.reveal')]
            : [];
          const siblingIndex = siblings.indexOf(entry.target);
          const delay = Math.min(siblingIndex * 80, 320);

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ============================================================
   6. SKILL BARS ANIMATION
   ============================================================ */
function initSkillBars() {
  const skillCards = document.querySelectorAll('.skill-card');
  if (!skillCards.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillCards.forEach(card => observer.observe(card));
}

/* ============================================================
   7. COUNTER ANIMATION (stats)
   ============================================================ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  function animateCounter(el, target) {
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-count'), 10);
          animateCounter(entry.target, target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach(counter => observer.observe(counter));
}

/* ============================================================
   8. PROJECT FILTER
   ============================================================ */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show/hide cards with animation
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const matches = filter === 'all' || category === filter;

        if (matches) {
          card.style.display = '';
          // Re-trigger reveal
          setTimeout(() => {
            card.classList.remove('visible');
            void card.offsetWidth; // reflow
            card.classList.add('visible');
          }, 10);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ============================================================
   9. CARD 3D TILT EFFECT (project cards only)
   ============================================================ */
function initCardTilt() {
  // Only apply to project cards (not ALL cards — was causing too many mousemove listeners)
  const cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;

  // Disable on touch / reduced-motion devices
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  cards.forEach(card => {
    let rect;
    let tiltRaf;

    card.addEventListener('mouseenter', () => {
      rect = card.getBoundingClientRect();
    }, { passive: true });

    card.addEventListener('mousemove', e => {
      if (!rect) return;
      // Throttle via rAF
      if (tiltRaf) return;
      tiltRaf = requestAnimationFrame(() => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const dx = (x - cx) / cx;
        const dy = (y - cy) / cy;
        const rotateX = -dy * 4;
        const rotateY = dx * 4;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        tiltRaf = null;
      });
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      if (tiltRaf) { cancelAnimationFrame(tiltRaf); tiltRaf = null; }
      card.style.transform = '';
    }, { passive: true });
  });
}

/* ============================================================
   10. LIGHTBOX
   ============================================================ */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const triggerLinks = document.querySelectorAll('[data-lightbox="true"]');

  if (!lightbox || !lightboxImg) return;

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Project preview';
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => lightbox.focus?.(), 10);
  }

  function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  triggerLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      openLightbox(link.getAttribute('href'), link.getAttribute('aria-label'));
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.style.display === 'flex') {
      closeLightbox();
    }
  });
}

/* ============================================================
   11. CONTACT FORM
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = {
    name:    { el: document.getElementById('contact-name'),    error: document.getElementById('error-name') },
    email:   { el: document.getElementById('contact-email'),   error: document.getElementById('error-email') },
    subject: { el: document.getElementById('contact-subject'), error: document.getElementById('error-subject') },
    message: { el: document.getElementById('contact-message'), error: document.getElementById('error-message') },
  };

  const submitBtn = document.getElementById('form-submit-btn');
  const successMsg = document.getElementById('form-success');
  const errorMsg = document.getElementById('form-error-msg');

  const validators = {
    name: v => {
      if (!v.trim()) return 'Name is required.';
      if (v.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    },
    email: v => {
      if (!v.trim()) return 'Email is required.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'Please enter a valid email address.';
      return '';
    },
    subject: v => {
      if (!v.trim()) return 'Subject is required.';
      if (v.trim().length < 4) return 'Subject is too short.';
      return '';
    },
    message: v => {
      if (!v.trim()) return 'Message is required.';
      if (v.trim().length < 20) return 'Message must be at least 20 characters.';
      return '';
    },
  };

  function setFieldState(key, errorText) {
    const { el, error } = fields[key];
    if (errorText) {
      el.classList.add('error');
      error.textContent = errorText;
    } else {
      el.classList.remove('error');
      error.textContent = '';
    }
  }

  function validateField(key) {
    const value = fields[key].el.value;
    const msg = validators[key](value);
    setFieldState(key, msg);
    return !msg;
  }

  // Live validation on blur
  Object.keys(fields).forEach(key => {
    const input = fields[key].el;
    if (!input) return;
    input.addEventListener('blur', () => validateField(key));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(key);
    });
  });

  function setLoading(loading) {
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('.btn-icon');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    submitBtn.disabled = loading;

    if (loading) {
      btnText.textContent = 'Sending…';
      if (btnIcon) btnIcon.style.display = 'none';
      if (btnSpinner) btnSpinner.style.display = '';
    } else {
      btnText.textContent = 'Send Message';
      if (btnIcon) btnIcon.style.display = '';
      if (btnSpinner) btnSpinner.style.display = 'none';
    }
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Validate all fields
    const valid = Object.keys(fields).every(key => validateField(key));
    if (!valid) return;

    // Hide old messages
    successMsg.style.display = 'none';
    errorMsg.style.display = 'none';

    setLoading(true);

    try {
      const data = new FormData(form);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        form.reset();
        // Clear error states
        Object.keys(fields).forEach(k => setFieldState(k, ''));
        successMsg.style.display = 'flex';
        setTimeout(() => { successMsg.style.display = 'none'; }, 7000);
      } else {
        errorMsg.style.display = 'block';
        setTimeout(() => { errorMsg.style.display = 'none'; }, 7000);
      }
    } catch (err) {
      errorMsg.style.display = 'block';
      setTimeout(() => { errorMsg.style.display = 'none'; }, 7000);
    } finally {
      setLoading(false);
    }
  });
}

/* ============================================================
   12. SCROLL-TO-TOP BUTTON
   ============================================================ */
const scrollTopBtn = document.getElementById('scroll-top');

function updateScrollTop() {
  if (!scrollTopBtn) return;
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}

function initScrollTop() {
  if (!scrollTopBtn) return;
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   13. FOOTER YEAR
   ============================================================ */
function initFooterYear() {
  const el = document.getElementById('current-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ============================================================
   SKILLS TAB SWITCHING
   ============================================================ */
function initSkillsTabs() {
  const tabs = document.querySelectorAll('.skill-tab');
  const panels = document.querySelectorAll('.skills-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      panels.forEach(panel => {
        const isTarget = panel.id === `panel-${target}`;
        panel.classList.toggle('active', isTarget);
        panel.hidden = !isTarget;

        if (isTarget) {
          // Animate skill bars in newly-shown panel
          panel.querySelectorAll('.skill-card').forEach(card => {
            card.classList.remove('animate');
            void card.offsetWidth;
            setTimeout(() => card.classList.add('animate'), 50);
          });

          // Re-run reveal on newly-shown cards
          panel.querySelectorAll('.reveal').forEach(el => {
            el.classList.remove('visible');
            void el.offsetWidth;
            setTimeout(() => el.classList.add('visible'), 50);
          });
        }
      });
    });
  });
}

/* ============================================================
   HERO SECTION PARALLAX — REMOVED (was causing layout thrash on scroll)
   ============================================================ */
function initParallax() {
  // Intentionally no-op: parallax on scroll was firing on every scroll event
  // causing expensive layout reads (getBoundingClientRect / offsetTop).
  // The static hero image looks just as clean without it.
}

/* ============================================================
   RIPPLE EFFECT on Buttons
   ============================================================ */
function initRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute; border-radius:50%;
        width:8px; height:8px;
        background:rgba(255,255,255,0.4);
        left:${x - 4}px; top:${y - 4}px;
        transform:scale(0); pointer-events:none;
        animation:ripple-expand 0.5s ease forwards;
      `;

      if (!document.querySelector('#ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = '@keyframes ripple-expand { to { transform:scale(30); opacity:0; } }';
        document.head.appendChild(style);
      }

      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}

/* ============================================================
   LINKEDIN POST EXPANDERS
   ============================================================ */
function initLinkedInExpanders() {
  const seeMoreBtns = document.querySelectorAll('.li-see-more-btn');
  seeMoreBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const postBody = this.closest('.li-post-body');
      if (postBody) {
        const textElement = postBody.querySelector('.li-post-text');
        if (textElement) {
          const isExpanded = textElement.classList.toggle('is-expanded');
          if (isExpanded) {
            this.textContent = 'see less';
          } else {
            this.textContent = '...see more';
            // Smoothly scroll the card header back into view if it moved off-screen
            const card = this.closest('.li-post-card');
            if (card) {
              card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }
        }
      }
    });
  });
}

/* ============================================================
   INIT ALL
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initThemeToggle();
  initNavbar();
  initTypingAnimation();
  initScrollReveal();
  initSkillBars();
  initCounters();
  initProjectFilter();
  initCardTilt();
  initLightbox();
  initContactForm();
  initScrollTop();
  initFooterYear();
  initSkillsTabs();
  initParallax();
  initRipple();
  initLinkedInExpanders();
});