/**
 * Threatpedia Incident Ticker
 * Replaces the "COMING SOON" nav-status message with a scrolling
 * marquee of the latest zero-days and incidents after a 5-second delay.
 *
 * Usage: Include this script on any page AFTER the nav is rendered:
 *   <script src="assets/incident-ticker.js"></script>
 *
 * Requires: .nav-status element in the nav bar.
 * Reads: zero-days/manifest.json (priority) + incidents/manifest.json.
 * Display order: up to 5 most recent zero-days first, then incidents.
 */
(function () {
  'use strict';

  var DISPLAY_DELAY = 5000;  // ms to show "COMING SOON" before transition
  var SCROLL_SPEED = 40;     // px per second for marquee

  // ── Detect base path ──────────────────────────────────────────────
  var path = window.location.pathname;
  var base = '';
  if (path.includes('/incidents/') || path.includes('/threat-actors/') || path.includes('/zero-days/')) {
    base = '../';
  }

  // ── Severity badge colors ─────────────────────────────────────────
  var severityColors = {
    'Critical': { bg: '#ff4444', text: '#fff' },
    'High':     { bg: '#e8a020', text: '#080b10' },
    'Medium':   { bg: '#5a6a7e', text: '#f0f4f8' },
    'Low':      { bg: '#1e2733', text: '#cdd5e0' }
  };

  // ── Inject ticker CSS ─────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent =
    '.nav-status{position:relative;overflow:hidden;flex:1;margin:0 24px;height:20px;pointer-events:none}' +
    '.nav-status a,.nav-status .ticker-item{pointer-events:auto}' +
    '.hamburger{position:relative;z-index:102}' +
    '.ticker-coming-soon{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:8px;transition:transform 0.6s cubic-bezier(0.4,0,0.2,1),opacity 0.6s}' +
    '.ticker-coming-soon.slide-up{transform:translateY(-100%);opacity:0}' +
    '.ticker-marquee-wrap{position:absolute;inset:0;display:flex;align-items:center;overflow:hidden;transform:translateY(100%);opacity:0;transition:transform 0.6s cubic-bezier(0.4,0,0.2,1),opacity 0.6s}' +
    '.ticker-marquee-wrap.slide-in{transform:translateY(0);opacity:1}' +
    '.ticker-track{display:flex;gap:40px;white-space:nowrap;animation:ticker-scroll var(--ticker-duration,60s) linear infinite}' +
    '.ticker-track:hover{animation-play-state:paused}' +
    '@keyframes ticker-scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}' +
    '.ticker-item{display:inline-flex;align-items:center;gap:8px;text-decoration:none;color:var(--muted);font-family:"IBM Plex Mono",monospace;font-size:0.62rem;letter-spacing:0.06em;transition:color 0.2s;cursor:pointer}' +
    '.ticker-item:hover{color:var(--white)}' +
    '.ticker-badge{display:inline-block;padding:1px 6px;font-size:0.52rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;border-radius:2px;line-height:1.4}' +
    '.ticker-sep{color:var(--border);font-size:0.5rem;user-select:none}';
  document.head.appendChild(style);

  // ── Find the nav-status element ───────────────────────────────────
  var statusEl = document.querySelector('.nav-status');
  if (!statusEl) return;

  // Wrap existing content in a container for the slide animation
  var comingSoon = document.createElement('div');
  comingSoon.className = 'ticker-coming-soon';
  comingSoon.innerHTML = statusEl.innerHTML;
  statusEl.innerHTML = '';
  statusEl.appendChild(comingSoon);

  // Create marquee wrapper (hidden, slides in later)
  var marqueeWrap = document.createElement('div');
  marqueeWrap.className = 'ticker-marquee-wrap';
  statusEl.appendChild(marqueeWrap);

  // ── Fetch zero-days + incidents and build ticker ───────────────────
  var zdFetch = fetch(base + 'zero-days/manifest.json')
    .then(function (r) { return r.json(); })
    .catch(function () { return { exploits: [] }; });

  var incFetch = fetch(base + 'incidents/manifest.json')
    .then(function (r) { return r.json(); })
    .catch(function () { return { incidents: [] }; });

  Promise.all([zdFetch, incFetch])
    .then(function (results) {
      var exploits  = results[0].exploits  || [];
      var incidents = results[1].incidents || [];

      // Sort zero-days by disclosed date descending, take top 5
      exploits.sort(function (a, b) {
        return (b.disclosedDate || '').localeCompare(a.disclosedDate || '');
      });
      exploits = exploits.slice(0, 5);

      // Sort incidents by date descending, fill remaining slots (up to 12 total)
      incidents.sort(function (a, b) {
        return (b.date || '').localeCompare(a.date || '');
      });
      var remainingSlots = Math.max(0, 12 - exploits.length);
      incidents = incidents.slice(0, remainingSlots);

      if (exploits.length === 0 && incidents.length === 0) return;

      // Build ticker items HTML — zero-days first, then incidents
      var itemsHTML = '';

      exploits.forEach(function (exp) {
        var sev = severityColors[exp.severity] || severityColors['High'];
        var href = base + 'zero-days/' + exp.slug + '.html';
        var statusLabel = exp.status === 'Active Exploitation' ? '0-DAY' : exp.status || 'EXPLOIT';
        itemsHTML +=
          '<a class="ticker-item" href="' + href + '">' +
            '<span class="ticker-badge" style="background:' + sev.bg + ';color:' + sev.text + '">' + statusLabel + '</span>' +
            '<span>' + exp.title + '</span>' +
          '</a>' +
          '<span class="ticker-sep">\u26A0</span>';
      });

      incidents.forEach(function (inc) {
        var sev = severityColors[inc.severity] || severityColors['Medium'];
        var href = base + 'incidents/' + inc.slug + '.html';
        itemsHTML +=
          '<a class="ticker-item" href="' + href + '">' +
            '<span class="ticker-badge" style="background:' + sev.bg + ';color:' + sev.text + '">' + (inc.severity || 'Info') + '</span>' +
            '<span>' + inc.title + '</span>' +
          '</a>' +
          '<span class="ticker-sep">\u2022</span>';
      });

      // Create track with duplicate content for seamless scrolling
      var track = document.createElement('div');
      track.className = 'ticker-track';
      track.innerHTML = itemsHTML + itemsHTML;
      marqueeWrap.appendChild(track);

      // Calculate scroll duration based on content width
      requestAnimationFrame(function () {
        var halfWidth = track.scrollWidth / 2;
        var duration = halfWidth / SCROLL_SPEED;
        track.style.setProperty('--ticker-duration', duration + 's');
      });

      // ── Transition: COMING SOON → Ticker ────────────────────────
      setTimeout(function () {
        comingSoon.classList.add('slide-up');
        marqueeWrap.classList.add('slide-in');
      }, DISPLAY_DELAY);
    })
    .catch(function () {
      // If both manifests fail, just keep showing COMING SOON
    });
})();
