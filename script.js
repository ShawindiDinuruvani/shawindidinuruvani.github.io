/**
 * Shawindi Dinuruvani — Personal Portfolio JavaScript
 * Features:
 * - Accessible mobile navigation toggle with keyboard trap & ESC handler
 * - Active section navigation highlight on scroll via IntersectionObserver
 * - Header blur and backdrop style enhancements on scroll
 * - Back-to-top button with smooth scroll
 * - One-click email copy button with visual "Copied" confirmation
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initActiveNavOnScroll();
  initBackToTop();
  initEmailCopy();
  initHeaderScroll();
});

/**
 * Mobile Navigation Drawer & Toggle Handler
 */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const primaryNav = document.getElementById('primaryNav');

  if (!toggleBtn || !primaryNav) return;

  const navLinks = primaryNav.querySelectorAll('.nav-link, .btn-ghost-nav');

  function closeMenu() {
    toggleBtn.setAttribute('aria-expanded', 'false');
    primaryNav.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function openMenu() {
    toggleBtn.setAttribute('aria-expanded', 'true');
    primaryNav.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Auto-close menu on link selection
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 768) {
        closeMenu();
      }
    });
  });

  // Close when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggleBtn.focus();
    }
  });

  // Close when tapping outside the menu
  document.addEventListener('click', (e) => {
    if (window.innerWidth < 768) {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded && !primaryNav.contains(e.target) && !toggleBtn.contains(e.target)) {
        closeMenu();
      }
    }
  });

  // Reset menu if window resized to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && toggleBtn.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });
}

/**
 * Header Styling on Scroll
 */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 25) {
      header.style.borderBottomColor = 'rgba(45, 212, 191, 0.2)';
    } else {
      header.style.borderBottomColor = 'rgba(255, 255, 255, 0.07)';
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * Active Navigation Link Highlighter based on scroll position
 */
function initActiveNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-25% 0px -65% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/**
 * Back to Top Button
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  const checkScroll = () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('is-visible');
    } else {
      backToTopBtn.classList.remove('is-visible');
    }
  };

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * One-Click Email Copy with Visual Confirmation Feedback
 */
function initEmailCopy() {
  const copyBtn = document.getElementById('copyEmailBtn');
  if (!copyBtn) return;

  const emailToCopy = 'shawindidinuruvani@gmail.com';
  const copyBtnText = copyBtn.querySelector('.copy-btn-text');
  let resetTimer = null;

  copyBtn.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(emailToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = emailToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      // Visual feedback
      copyBtn.classList.add('is-copied');
      if (copyBtnText) {
        copyBtnText.textContent = 'Copied!';
      }

      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        copyBtn.classList.remove('is-copied');
        if (copyBtnText) {
          copyBtnText.textContent = 'Copy email';
        }
      }, 2200);
    } catch (err) {
      console.error('Failed to copy email address', err);
    }
  });
}
