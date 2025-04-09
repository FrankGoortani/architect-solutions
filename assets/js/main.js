/**
 * Main JavaScript for Architect Solutions
 * This file handles navigation, animations, and general site functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initNavigation();
  initAnimations();
  initSmoothScrolling();
  initLazyLoading();
  initScheduleButton();
  initCalendly();
});

/**
 * Navigation functionality
 * Handles mobile menu toggle and active state for navigation links
 */
function initNavigation() {
  // Mobile navigation toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('#mobile-menu');
  const mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  if (menuToggle && mobileMenu) {
    // Toggle mobile menu function that can be called from both click and keyboard events
    const toggleMobileMenu = () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      const newExpandedState = !expanded;

      menuToggle.setAttribute('aria-expanded', newExpandedState);
      mobileMenu.classList.toggle('hidden');
      mobileMenu.classList.toggle('active');

      // If opening the menu, set focus on the first menu item
      if (newExpandedState && mobileMenuLinks.length > 0) {
        // Small delay to ensure the menu is visible before focusing
        setTimeout(() => {
          mobileMenuLinks[0].focus();
        }, 100);
      }
    };

    // Click event listener
    menuToggle.addEventListener('click', toggleMobileMenu);

    // Keyboard event listener for the toggle button
    menuToggle.addEventListener('keydown', (e) => {
      // Enter or Space key
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMobileMenu();
      }
    });

    // Add keyboard navigation within the mobile menu
    mobileMenu.addEventListener('keydown', (e) => {
      // If Escape key is pressed while menu is open, close the menu and focus toggle button
      if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        e.preventDefault();
        toggleMobileMenu();
        menuToggle.focus();
      }
    });

    // Add keyboard support to mobile menu links
    mobileMenuLinks.forEach((link, index) => {
      link.addEventListener('keydown', (e) => {
        // Handle arrow keys for navigation between menu items
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();

          const nextIndex = e.key === 'ArrowDown'
            ? (index + 1) % mobileMenuLinks.length
            : (index - 1 + mobileMenuLinks.length) % mobileMenuLinks.length;

          mobileMenuLinks[nextIndex].focus();
        }

        // Tab without shift should loop within the menu
        // Shift+Tab is handled naturally by the browser
      });
    });
  }

  // Active navigation state based on scroll position
  const sections = document.querySelectorAll('section[id]');

  function setActiveNavLink() {
    const scrollPosition = window.scrollY;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const navigationLink = document.querySelector(`a[href="#${sectionId}"]`);

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navigationLink?.classList.add('active');
      } else {
        navigationLink?.classList.remove('active');
      }
    });
  }

  // Header background change on scroll
  const header = document.querySelector('header');

  function updateHeaderBackground() {
    if (window.scrollY > 0) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }

  // Update navigation and header on scroll
  window.addEventListener('scroll', () => {
    setActiveNavLink();
    updateHeaderBackground();
  });

  // Initial check to set active states
  setActiveNavLink();
  updateHeaderBackground();
}

/**
 * Smooth scrolling for navigation links
 */
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');

      // Skip if it's a non-navigation link
      if (targetId === '#' || !targetId.startsWith('#')) return;

      e.preventDefault();

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      const headerOffset = 80; // Account for fixed header
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Close mobile menu if open
      const mobileMenu = document.querySelector('#mobile-menu');
      const menuToggle = document.querySelector('.menu-toggle');

      if (mobileMenu?.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        mobileMenu.classList.add('hidden');
        menuToggle?.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/**
 * Scroll animations using Intersection Observer
 */
function initAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (animatedElements.length === 0) return;

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        // Optionally, unobserve after animation is triggered
        // animationObserver.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  });

  animatedElements.forEach(element => {
    animationObserver.observe(element);
  });
}

/**
 * Lazy loading for images
 */
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img[data-src]');

  if (lazyImages.length === 0) return;

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => {
    imageObserver.observe(img);
  });
}

/**
 * Initialize Calendly widget
 */
function initCalendly() {
  if (typeof Calendly === 'undefined') return;

  const calendlyContainer = document.getElementById('calendly-container');
  if (!calendlyContainer) return;

  Calendly.initInlineWidget({
    url: 'https://calendly.com/architect-solutions/consultation',
    parentElement: calendlyContainer,
    prefill: {}
  });
}

/**
 * Helper function for prefilling Calendly widget with form data
 */
function updateCalendlyPrefill() {
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');

  if (typeof Calendly === 'undefined' || !nameInput || !emailInput) return;

  Calendly.initInlineWidget({
    url: 'https://calendly.com/architect-solutions/consultation',
    parentElement: document.getElementById('calendly-container'),
    prefill: {
      name: nameInput.value,
      email: emailInput.value
    }
  });
}

/**
 * Add event listener for "Schedule Consultation" button
 */
function initScheduleButton() {
  const scheduleButton = document.querySelector('[data-schedule-button]');
  if (!scheduleButton) return;

  scheduleButton.addEventListener('click', () => {
    const calendlyContainer = document.getElementById('calendly-container');
    if (calendlyContainer) {
      // Scroll to calendly container
      calendlyContainer.scrollIntoView({ behavior: 'smooth' });
      // Initialize or update Calendly with current form data
      updateCalendlyPrefill();
    }
  });
}
