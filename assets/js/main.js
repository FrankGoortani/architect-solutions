/**
 * Architect.solutions - Minimal JavaScript
 * Frank Goortani - Thought Leadership Platform
 */

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('mobile-open');
      const isExpanded = nav.classList.contains('mobile-open');
      menuToggle.setAttribute('aria-expanded', isExpanded);
    });
  }

  // Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        // Close mobile menu if open
        if (nav && nav.classList.contains('mobile-open')) {
          nav.classList.remove('mobile-open');
        }
      }
    });
  });

  // Email Form Submission
  const emailForm = document.querySelector('.email-form');
  if (emailForm) {
    emailForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value;

      // Simple client-side validation
      if (!email || !email.includes('@')) {
        alert('Please enter a valid email address');
        return;
      }

      // TODO: Replace with actual email capture service (Mailchimp, ConvertKit, etc.)
      console.log('Email submitted:', email);

      // Show success message
      const button = this.querySelector('button');
      const originalText = button.textContent;
      button.textContent = 'Thanks! You\'re on the list.';
      button.disabled = true;

      // Reset form
      this.reset();

      // Reset button after 3 seconds
      setTimeout(() => {
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
