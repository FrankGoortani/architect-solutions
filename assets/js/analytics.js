/**
 * Umami analytics wrapper for architect.solutions
 *
 * Loads Umami after initial rendering and wires custom events (email form,
 * CTAs, outbound clicks, blog read completion, etc.) on top of the base tracker.
 */
(function () {
  var UMAMI_HOST = 'https://goortani.synology.me:3100';
  var WEBSITE_ID = 'bf058809-0072-446b-8523-3591391d4038';
  var trackerRequested = false;
  var queue = [];

  function flushQueue() {
    if (!window.umami || typeof window.umami.track !== 'function' || !queue) return;
    queue.forEach(function (args) {
      try { window.umami.track.apply(window.umami, args); } catch (_) {}
    });
    queue = null;
  }

  function loadTracker() {
    if (trackerRequested) return;
    trackerRequested = true;

    var script = document.createElement('script');
    script.defer = true;
    script.src = UMAMI_HOST + '/script.js';
    script.setAttribute('data-website-id', WEBSITE_ID);
    script.setAttribute('data-domains', 'architect.solutions');
    script.addEventListener('load', flushQueue, { once: true });
    document.head.appendChild(script);
  }

  function scheduleTracker() {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadTracker, { timeout: 2500 });
    } else {
      setTimeout(loadTracker, 1200);
    }
  }

  function track(name, data) {
    try {
      if (window.umami && typeof window.umami.track === 'function') {
        window.umami.track(name, data || {});
      } else if (queue) {
        queue.push([name, data || {}]);
        scheduleTracker();
      }
    } catch (_) {}
  }

  // ---------- Outbound click tracking ----------
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (!/^https?:\/\//i.test(href)) return;
    try {
      var url = new URL(href);
      if (url.hostname === window.location.hostname) return;
      track('outbound_click', { href: href, host: url.hostname });
    } catch (_) {}
  }, { capture: true });

  // ---------- Section CTA click tracking ----------
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.btn, .cta, .connect-link');
    if (!btn) return;
    var label = (btn.textContent || '').trim().slice(0, 80);
    var href = btn.getAttribute('href') || '';
    track('section_cta_click', { label: label, href: href });
  }, { capture: true });

  // ---------- Email form submit ----------
  document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('.email-form');
    if (form) {
      form.addEventListener('submit', function () {
        // main.js handles validation + UX; we only fire the event.
        track('email_form_submit', { path: window.location.pathname });
      }, { capture: true });
    }

    // ---------- Blog post read completion (writing/**/*.html) ----------
    // Fires once when the footer comes into view on article pages.
    var article = document.querySelector('article, main#main-content');
    var footer = document.querySelector('footer');
    if (article && footer && /\/writing\//.test(window.location.pathname)) {
      var fired = false;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !fired) {
            fired = true;
            track('blog_read_complete', { path: window.location.pathname });
            io.disconnect();
          }
        });
      }, { threshold: 0.5 });
      io.observe(footer);
    }

    // ---------- Scroll depth on home + writing index ----------
    var thresholds = [25, 50, 75, 100];
    var fired = {};
    window.addEventListener('scroll', function () {
      var h = document.documentElement;
      var pct = Math.round(((h.scrollTop + window.innerHeight) / h.scrollHeight) * 100);
      thresholds.forEach(function (t) {
        if (pct >= t && !fired[t]) {
          fired[t] = true;
          track('scroll_depth', { depth: t });
        }
      });
    }, { passive: true });
  });

  // ---------- Calendly open (if Calendly widget is present) ----------
  window.addEventListener('message', function (e) {
    if (!e || !e.data || typeof e.data !== 'object') return;
    if (e.data.event && e.data.event.indexOf('calendly.') === 0) {
      track('calendly_' + e.data.event.replace('calendly.', ''), {});
    }
  });

  if (document.readyState === 'complete') {
    scheduleTracker();
  } else {
    window.addEventListener('load', scheduleTracker, { once: true });
  }
})();
