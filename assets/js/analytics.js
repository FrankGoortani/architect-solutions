/**
 * Umami analytics wrapper for architect.solutions
 *
 * The Umami script itself is loaded via a <script> tag in each page's <head>.
 * This file wires custom events (email form, CTAs, outbound clicks, blog read
 * completion, etc.) on top of the base tracker.
 */
(function () {
  // Small helper that no-ops if umami hasn't loaded yet.
  function track(name, data) {
    try {
      if (window.umami && typeof window.umami.track === 'function') {
        window.umami.track(name, data || {});
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
})();
