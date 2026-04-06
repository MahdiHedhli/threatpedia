/**
 * Threatpedia Analytics Loader
 * Centralizes Google Analytics injection so new pages only need:
 *   <script src="assets/analytics.js"></script>
 * (adjust path for subdirectories: ../assets/analytics.js)
 *
 * To change the GA Measurement ID, update the single value below.
 */
(function () {
  'use strict';

  var GA_ID = 'G-YTB9GQKXLH';

  // Inject the gtag.js script
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);
})();
