/**
 * Architect.solutions - Minimal JavaScript
 * Frank Goortani - Thought Leadership Platform
 */

// Dark Mode Toggle
(function() {
  var toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;

  var saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  }

  function updateToggle() {
    var theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
      toggle.textContent = '\u2609';
      toggle.setAttribute('aria-label', 'Switch to light mode');
    } else if (theme === 'light') {
      toggle.textContent = '\u263E';
      toggle.setAttribute('aria-label', 'Switch to dark mode');
    } else {
      // OS preference
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      toggle.textContent = prefersDark ? '\u2609' : '\u263E';
      toggle.setAttribute('aria-label', prefersDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  updateToggle();

  toggle.addEventListener('click', function() {
    var current = document.documentElement.getAttribute('data-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    var next;
    if (!current) {
      next = prefersDark ? 'light' : 'dark';
    } else if (current === 'dark') {
      next = 'light';
    } else {
      next = 'dark';
    }

    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateToggle();
  });
})();

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  var menuToggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('mobile-open');
      var isExpanded = nav.classList.contains('mobile-open');
      menuToggle.setAttribute('aria-expanded', isExpanded);
    });
  }

  // Close mobile menu when anchor links are clicked (smooth scroll handled by CSS)
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function() {
      if (nav && menuToggle && nav.classList.contains('mobile-open')) {
        nav.classList.remove('mobile-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Email Form Submission
  var emailForm = document.querySelector('.email-form');
  if (emailForm) {
    emailForm.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!this.checkValidity()) {
        this.reportValidity();
        return;
      }

      var email = this.querySelector('input[type="email"]').value;

      // TODO: Replace with actual email capture service (Mailchimp, ConvertKit, etc.)
      console.log('Email submitted:', email);

      // Show success message
      var button = this.querySelector('button');
      var originalText = button.textContent;
      button.textContent = 'Thanks! You\'re on the list.';
      button.disabled = true;

      this.reset();

      setTimeout(function() {
        button.textContent = originalText;
        button.disabled = false;
      }, 3000);
    });
  }

  // Keyboard Navigation Enhancement
  document.body.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.body.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
  });
});
