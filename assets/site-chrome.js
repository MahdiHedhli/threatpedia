/**
 * Threatpedia Site Chrome
 * Centralizes header (nav + hamburger menu) and footer injection.
 *
 * Usage: Add these two elements to any page, then include this script:
 *   <div id="site-header"></div>   <!-- place at top of <body> -->
 *   <div id="site-footer"></div>   <!-- place at bottom of <body> -->
 *   <script src="assets/site-chrome.js"></script>  <!-- adjust path for subdirs -->
 *
 * The script auto-detects the page depth for correct relative paths.
 */
(function () {
  'use strict';

  // ── Path detection ──────────────────────────────────────────────────
  var path = window.location.pathname;
  var base = '';
  if (path.includes('/incidents/') || path.includes('/threat-actors/')) {
    base = '../';
  }
  // Deeper nesting (e.g. threat-actors/subdir/) would need '../../../' etc.
  // Adjust as needed when adding deeper page hierarchies.

  // ── Inject CSS ──────────────────────────────────────────────────────
  var css = document.createElement('style');
  css.textContent = '' +
    '/* ── Nav ── */' +
    'nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border);background:rgba(8,11,16,0.88);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}' +
    '@media(min-width:768px){nav{padding:20px 48px}}' +
    '.nav-logo{display:flex;align-items:center;text-decoration:none;gap:10px;flex-shrink:0}' +
    '.nav-logo-icon{width:32px;height:32px;border-radius:4px;flex-shrink:0}' +
    '.nav-logo-text{font-family:"IBM Plex Mono",monospace;font-size:0.85rem;letter-spacing:0.22em;color:var(--amber);text-transform:uppercase}' +
    '.nav-logo-text span{color:var(--muted)}' +
    '@media(max-width:767px){.nav-logo-text{display:none}}' +
    '.nav-status{display:none;align-items:center;gap:8px;font-family:"IBM Plex Mono",monospace;font-size:0.68rem;color:var(--muted);letter-spacing:0.1em}' +
    '@media(min-width:768px){.nav-status{display:flex}}' +
    '.status-dot{width:6px;height:6px;border-radius:50%;background:var(--amber);animation:pulse 2s ease-in-out infinite;flex-shrink:0}' +
    '@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.25}}' +

    '/* ── Hamburger ── */' +
    '.hamburger{display:flex;flex-direction:column;justify-content:center;gap:5px;width:28px;height:28px;background:none;border:1px solid var(--border);padding:5px;cursor:pointer;transition:border-color 0.2s;flex-shrink:0}' +
    '.hamburger:hover{border-color:var(--amber)}' +
    '.hamburger span{display:block;width:100%;height:1.5px;background:var(--amber);transition:transform 0.3s,opacity 0.3s}' +
    '.hamburger.open span:nth-child(1){transform:translateY(3.25px) rotate(45deg)}' +
    '.hamburger.open span:nth-child(2){opacity:0}' +
    '.hamburger.open span:nth-child(3){transform:translateY(-3.25px) rotate(-45deg)}' +

    '/* ── Slide-out menu ── */' +
    '.menu-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:199;opacity:0;pointer-events:none;transition:opacity 0.3s}' +
    '.menu-overlay.open{opacity:1;pointer-events:auto}' +
    '.menu-panel{position:fixed !important;top:0;right:0;bottom:0;width:320px;max-width:85vw;background:var(--surface);border-left:1px solid var(--border);z-index:200;transform:translateX(100%);transition:transform 0.3s ease;display:flex;flex-direction:column;padding:80px 32px 32px;overflow-y:auto}' +
    '.menu-panel.open{transform:translateX(0)}' +
    '.menu-search{width:100%;background:var(--bg);border:1px solid var(--border);color:var(--white);font-family:"IBM Plex Sans",sans-serif;font-size:0.88rem;padding:12px 16px;outline:none;transition:border-color 0.2s,box-shadow 0.2s;margin-bottom:28px;border-radius:0}' +
    '.menu-search::placeholder{color:var(--muted)}' +
    '.menu-search:focus{border-color:var(--amber);box-shadow:0 0 0 1px var(--amber)}' +
    '.menu-label{font-family:"IBM Plex Mono",monospace;font-size:0.6rem;letter-spacing:0.3em;color:var(--amber-dim);text-transform:uppercase;margin-bottom:14px}' +
    '.menu-links{list-style:none;display:flex;flex-direction:column;gap:0;margin-bottom:28px}' +
    '.menu-links a{display:block;font-family:"IBM Plex Mono",monospace;font-size:0.78rem;letter-spacing:0.12em;color:var(--text);text-decoration:none;text-transform:uppercase;padding:14px 0;border-bottom:1px solid var(--border);transition:color 0.2s,padding-left 0.2s}' +
    '.menu-links a:first-child{border-top:1px solid var(--border)}' +
    '.menu-links a:hover{color:var(--amber);padding-left:8px}' +
    '.menu-links a.active{color:var(--amber)}' +
    '.menu-cta{display:block;text-align:center;font-family:"IBM Plex Mono",monospace;font-size:0.72rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--bg);background:var(--amber);padding:14px 0;text-decoration:none;margin-top:auto;transition:background 0.2s}' +
    '.menu-cta:hover{background:#d4911a}' +

    '/* ── Footer ── */' +
    'footer{text-align:center;padding:48px 24px;border-top:1px solid var(--border);margin-top:80px}' +
    '.footer-logo{font-family:"IBM Plex Mono",monospace;font-size:0.9rem;letter-spacing:0.3em;color:var(--amber);margin-bottom:16px}' +
    '.footer-domains{display:flex;justify-content:center;gap:24px;flex-wrap:wrap;margin-bottom:12px}' +
    '.footer-domain{font-family:"IBM Plex Mono",monospace;font-size:0.65rem;letter-spacing:0.1em;color:var(--muted)}' +
    '.footer-copy{font-family:"IBM Plex Sans",sans-serif;font-size:0.7rem;color:var(--muted)}';
  document.head.appendChild(css);

  // ── Inject Header HTML ──────────────────────────────────────────────
  var headerEl = document.getElementById('site-header');
  if (headerEl) {
    headerEl.innerHTML =
      '<nav>' +
        '<a class="nav-logo" href="' + base + 'index.html">' +
        '<svg class="nav-logo-icon" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' +
          '<rect width="120" height="120" rx="6" fill="#0a0a0a"/>' +
          '<rect x="2" y="2" width="116" height="116" rx="5" fill="none" stroke="#1e2733" stroke-width="2"/>' +
          '<line x1="96" y1="4" x2="96" y2="116" stroke="#e8a020" stroke-width="2" opacity="0.6"/>' +
          '<text x="18" y="92" font-family="Georgia,serif" font-size="82" font-weight="700" fill="#e8a020">T</text>' +
          '<text x="62" y="92" font-family="Georgia,serif" font-size="82" font-weight="700" fill="#5a6a7e">P</text>' +
        '</svg>' +
        '<span class="nav-logo-text">Threat<span>pedia</span></span>' +
      '</a>' +
        '<div class="nav-status">' +
          '<div class="status-dot"></div>' +
          'COMING SOON \u2014 FOUNDING MEMBER REGISTRATION OPEN' +
        '</div>' +
        '<button class="hamburger" id="hamburger-btn" aria-label="Open menu">' +
          '<span></span><span></span><span></span>' +
        '</button>' +
      '</nav>' +
      '<div class="menu-overlay" id="menu-overlay"></div>' +
      '<div class="menu-panel" id="menu-panel">' +
        '<div class="menu-label">Search</div>' +
        '<input class="menu-search" type="text" placeholder="Search Threatpedia..." id="menu-search" />' +
        '<div class="menu-label">Navigate</div>' +
        '<div class="menu-links">' +
          '<a href="' + base + 'glossary.html">Glossary</a>' +
          '<a href="' + base + 'threat-actors.html">Threat Actors</a>' +
          '<a href="' + base + 'incidents/index.html">Incidents</a>' +
          '<a href="' + base + 'roadmap.html">Roadmap</a>' +
        '</div>' +
        '<a class="menu-cta" href="' + base + 'index.html#signup">Register Interest</a>' +
      '</div>';
  }

  // ── Inject Footer HTML ──────────────────────────────────────────────
  var footerEl = document.getElementById('site-footer');
  if (footerEl) {
    footerEl.innerHTML =
      '<footer>' +
        '<div class="footer-logo">THREATPEDIA</div>' +
        '<div class="footer-domains">' +
          '<div class="footer-domain">threatpedia.wiki</div>' +
          '<div class="footer-domain">threatpedia.net</div>' +
          '<div class="footer-domain">threatopedia.wiki</div>' +
          '<div class="footer-domain">threatopedia.net</div>' +
        '</div>' +
        '<div class="footer-copy">\u00A9 2026 \u2014 All Rights Reserved</div>' +
      '</footer>';
  }

  // ── Hamburger menu behavior ─────────────────────────────────────────
  var btn     = document.getElementById('hamburger-btn');
  var overlay = document.getElementById('menu-overlay');
  var panel   = document.getElementById('menu-panel');
  var search  = document.getElementById('menu-search');

  if (btn && overlay && panel) {
    function toggle() {
      var isOpen = panel.classList.toggle('open');
      overlay.classList.toggle('open');
      btn.classList.toggle('open');
      if (isOpen && search) search.focus();
    }

    function close() {
      panel.classList.remove('open');
      overlay.classList.remove('open');
      btn.classList.remove('open');
    }

    btn.addEventListener('click', toggle);
    overlay.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  // ── Highlight active nav link ───────────────────────────────────────
  var links = document.querySelectorAll('.menu-links a');
  var loc = window.location.pathname;
  links.forEach(function (a) {
    if (loc.indexOf(a.getAttribute('href').replace('../', '').replace('.html', '')) > -1) {
      a.classList.add('active');
    }
  });
})();
