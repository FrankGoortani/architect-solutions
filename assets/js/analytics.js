/**
 * Analytics JavaScript for Architect Solutions
 * This file handles Google Analytics integration and event tracking
 */

document.addEventListener('DOMContentLoaded', function() {
  initAnalytics();
});

/**
 * Initialize analytics tracking
 */
function initAnalytics() {
  // Check if Google Analytics is loaded
  if (typeof gtag !== 'function') {
    console.warn('Google Analytics not available');
    return;
  }

  // Track CTA button clicks
  trackCTAButtons();

  // Track form submissions
  trackFormSubmissions();

  // Track navigation clicks
  trackNavigation();

  // Track section visibility
  trackSectionVisibility();

  // Track external links
  trackExternalLinks();

  // Track Calendly events
  trackCalendlyEvents();

  // Track time spent on page
  trackTimeOnPage();
}

/**
 * Track CTA button clicks
 */
function trackCTAButtons() {
  const ctaButtons = document.querySelectorAll('.btn[data-track]');

  ctaButtons.forEach(button => {
    button.addEventListener('click', () => {
      const label = button.dataset.track || button.textContent.trim();

      trackEvent('Engagement', 'CTA_Click', label);
    });
  });
}

/**
 * Track form submissions
 */
function trackFormSubmissions() {
  const forms = document.querySelectorAll('form[data-track]');

  forms.forEach(form => {
    form.addEventListener('submit', () => {
      const formName = form.dataset.track || 'Form';

      trackEvent('Conversion', 'Form_Submit', formName);
    });
  });
}

/**
 * Track navigation menu clicks
 */
function trackNavigation() {
  const navLinks = document.querySelectorAll('nav a, .mobile-menu a');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const linkText = link.textContent.trim();
      const linkHref = link.getAttribute('href');

      trackEvent('Navigation', 'Menu_Click', `${linkText} (${linkHref})`);
    });
  });
}

/**
 * Track section visibility using Intersection Observer
 */
function trackSectionVisibility() {
  const sections = document.querySelectorAll('section[id]');

  if (!sections.length) return;

  // Create a map to store which sections have been viewed
  const viewedSections = new Map();
  sections.forEach(section => {
    viewedSections.set(section.id, false);
  });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;

        // Only track the first time a section becomes visible
        if (!viewedSections.get(sectionId)) {
          viewedSections.set(sectionId, true);
          trackEvent('Engagement', 'Section_View', sectionId);
        }
      }
    });
  }, {
    threshold: 0.5 // Track when at least 50% of the section is visible
  });

  sections.forEach(section => {
    sectionObserver.observe(section);
  });
}

/**
 * Track clicks on external links
 */
function trackExternalLinks() {
  const allLinks = document.querySelectorAll('a');
  const hostname = window.location.hostname;

  allLinks.forEach(link => {
    const href = link.getAttribute('href');

    // Skip if href is not a fully qualified URL or is a same-domain link
    if (!href || !href.startsWith('http') || href.includes(hostname)) return;

    link.addEventListener('click', function(e) {
      const linkText = link.textContent.trim() || href;

      trackEvent('Outbound', 'Link_Click', linkText);
    });
  });
}

/**
 * Track Calendly events
 */
function trackCalendlyEvents() {
  // Listen for Calendly events
  window.addEventListener('message', function(e) {
    if (e.data.event && e.data.event.indexOf('calendly') === 0) {
      switch (e.data.event) {
        case 'calendly.event_scheduled':
          trackEvent('Conversion', 'Meeting_Scheduled', 'Calendly');
          break;
        case 'calendly.profile_page_viewed':
          trackEvent('Engagement', 'Calendly_Profile_Viewed', 'Calendly');
          break;
        case 'calendly.date_and_time_selected':
          trackEvent('Engagement', 'Calendly_Time_Selected', 'Calendly');
          break;
      }
    }
  });
}

/**
 * Track time spent on page
 */
function trackTimeOnPage() {
  let startTime = new Date();
  let timeSpent = 0;

  // Update time spent every minute
  const interval = setInterval(() => {
    timeSpent = Math.floor((new Date() - startTime) / 1000);

    // Track engagement at various time intervals
    if (timeSpent === 30) {
      trackEvent('Engagement', 'Time_On_Page', '30 seconds');
    } else if (timeSpent === 60) {
      trackEvent('Engagement', 'Time_On_Page', '1 minute');
    } else if (timeSpent === 180) {
      trackEvent('Engagement', 'Time_On_Page', '3 minutes');
    } else if (timeSpent === 300) {
      trackEvent('Engagement', 'Time_On_Page', '5 minutes');
    }
  }, 1000);

  // Clear interval when page is unloaded
  window.addEventListener('beforeunload', () => {
    clearInterval(interval);

    // Final time on page tracking
    timeSpent = Math.floor((new Date() - startTime) / 1000);
    trackEvent('Engagement', 'Total_Time_On_Page', `${timeSpent} seconds`);
  });
}

/**
 * Helper function to track events in Google Analytics
 * @param {string} category Event category
 * @param {string} action Event action
 * @param {string} label Event label
 */
function trackEvent(category, action, label) {
  if (typeof gtag !== 'function') return;

  gtag('event', action, {
    'event_category': category,
    'event_label': label
  });

  console.log(`Analytics event tracked: ${category} / ${action} / ${label}`);
}
