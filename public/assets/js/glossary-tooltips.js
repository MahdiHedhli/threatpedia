/**
 * Threatpedia Glossary Tooltip Module
 * Auto-links cybersecurity terms in incident reports to the glossary with hover definitions.
 * Fetches glossary-index.json on load, scans article content, wraps first occurrence per section.
 */
(function () {
  'use strict';

  var GLOSSARY_INDEX_PATH = '../glossary-index.json';
  var GLOSSARY_PAGE = '../glossary.html';
  var MIN_TERM_LENGTH = 4;
  var SKIP_TAGS = { A:1, PRE:1, CODE:1, H1:1, H2:1, H3:1, H4:1, H5:1, H6:1, SCRIPT:1, STYLE:1, TEXTAREA:1, INPUT:1 };
  var ROLE_LABELS = {
    'ciso':'CISO','grc':'GRC','soc':'SOC','threat-intel':'Threat Intel',
    'appsec-devsecops':'AppSec / DevSecOps','network-infra':'Network & Infra',
    'cloud-sec':'Cloud Security','iam':'IAM','dfir':'DFIR','red-team':'Red Team'
  };

  var glossaryData = null;
  var tooltipEl = null;
  var hideTimer = null;

  function loadGlossary() {
    return fetch(GLOSSARY_INDEX_PATH).then(function(r) {
      if (!r.ok) return null;
      return r.json();
    }).then(function(data) {
      if (!data) return null;
      data.sort(function(a,b){ return b.t.length - a.t.length; });
      return data;
    }).catch(function(e) {
      console.warn('[glossary-tooltips] Failed to load glossary index:', e);
      return null;
    });
  }

  function termRegex(term) {
    var escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp('\\b(' + escaped + ')\\b', 'i');
  }

  function isInsideSkipTag(node) {
    var el = node.parentElement;
    while (el) {
      if (SKIP_TAGS[el.tagName]) return true;
      if (el.classList && el.classList.contains('glossary-tooltip-link')) return true;
      if (el.classList && el.classList.contains('sources-section')) return true;
      if (el.classList && el.classList.contains('sidebar')) return true;
      if (el.tagName === 'NAV') return true;
      el = el.parentElement;
    }
    return false;
  }

  function getSectionId(node) {
    var el = node.parentElement;
    while (el) {
      if (el.tagName === 'SECTION' || el.tagName === 'ARTICLE') return el.id || el.tagName;
      if (el.classList && el.classList.contains('report-section')) return el.id || el.className;
      if (el.classList && el.classList.contains('sidebar-box')) return 'sidebar';
      el = el.parentElement;
    }
    return 'main';
  }

  function linkTerms(entries) {
    var article = document.querySelector('main') || document.querySelector('article') || document.querySelector('.container');
    if (!article) return 0;

    var termMap = {};
    var acronyms = {};
    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      var key = entry.t.toLowerCase();
      if (!termMap[key]) termMap[key] = entry;
      if (entry.a) {
        var aKey = entry.a.toLowerCase();
        if (!termMap[aKey]) termMap[aKey] = entry;
        acronyms[entry.a] = true;
      }
    }

    var allTerms = Object.keys(termMap).sort(function(a,b){ return b.length - a.length; });
    var matchTerms = allTerms.filter(function(t) {
      if (t.length >= MIN_TERM_LENGTH) return true;
      var e = termMap[t];
      if (e && e.a && e.a.length < MIN_TERM_LENGTH && e.a === e.a.toUpperCase()) return true;
      return acronyms[t.toUpperCase()] || false;
    });

    var linkedPerSection = {};
    var linkCount = 0;

    var walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT, {
      acceptNode: function(node) {
        if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
        if (isInsideSkipTag(node)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    var textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    for (var n = 0; n < textNodes.length; n++) {
      var textNode = textNodes[n];
      var sectionId = getSectionId(textNode);
      if (!linkedPerSection[sectionId]) linkedPerSection[sectionId] = {};
      var sectionLinked = linkedPerSection[sectionId];

      for (var m = 0; m < matchTerms.length; m++) {
        var termKey = matchTerms[m];
        if (sectionLinked[termKey]) continue;

        var ent = termMap[termKey];
        var re = termRegex(termKey);
        var match = re.exec(textNode.textContent);
        if (!match) continue;

        var before = textNode.textContent.substring(0, match.index);
        var matched = match[1];
        var after = textNode.textContent.substring(match.index + matched.length);

        var frag = document.createDocumentFragment();
        if (before) frag.appendChild(document.createTextNode(before));

        var link = document.createElement('a');
        link.href = GLOSSARY_PAGE + '#' + ent.s;
        link.className = 'glossary-tooltip-link';
        link.textContent = matched;
        link.setAttribute('data-term', ent.t);
        link.setAttribute('data-def', ent.d);
        link.setAttribute('data-roles', (ent.r || []).join(','));
        link.setAttribute('data-slug', ent.s);
        if (ent.a) link.setAttribute('data-acronym', ent.a);
        frag.appendChild(link);

        if (after) frag.appendChild(document.createTextNode(after));

        textNode.parentNode.replaceChild(frag, textNode);
        sectionLinked[termKey] = true;
        linkCount++;
        break;
      }
    }
    return linkCount;
  }

  function createTooltip() {
    if (tooltipEl) return tooltipEl;
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'glossary-tooltip';
    tooltipEl.innerHTML = '<div class="glossary-tooltip-term"></div><div class="glossary-tooltip-def"></div><div class="glossary-tooltip-roles"></div><div class="glossary-tooltip-footer"><a class="glossary-tooltip-goto">View in Glossary \u2192</a></div>';
    tooltipEl.style.display = 'none';
    document.body.appendChild(tooltipEl);
    tooltipEl.addEventListener('mouseenter', function(){ clearTimeout(hideTimer); });
    tooltipEl.addEventListener('mouseleave', function(){ hideTimer = setTimeout(function(){ tooltipEl.style.display = 'none'; }, 200); });
    return tooltipEl;
  }

  function showTooltip(target) {
    clearTimeout(hideTimer);
    var tip = createTooltip();
    var term = target.getAttribute('data-term');
    var def = target.getAttribute('data-def');
    var roles = target.getAttribute('data-roles') ? target.getAttribute('data-roles').split(',') : [];
    var slug = target.getAttribute('data-slug');
    var acronym = target.getAttribute('data-acronym');

    tip.querySelector('.glossary-tooltip-term').textContent = acronym ? term + ' (' + acronym + ')' : term;
    tip.querySelector('.glossary-tooltip-def').textContent = def.length > 280 ? def.substring(0, 277) + '\u2026' : def;

    var rolesEl = tip.querySelector('.glossary-tooltip-roles');
    rolesEl.innerHTML = '';
    roles.forEach(function(r) {
      if (!r) return;
      var pill = document.createElement('span');
      pill.className = 'glossary-tooltip-role';
      pill.textContent = ROLE_LABELS[r] || r;
      rolesEl.appendChild(pill);
    });

    tip.querySelector('.glossary-tooltip-goto').href = GLOSSARY_PAGE + '#' + slug;
    tip.style.display = 'block';

    var rect = target.getBoundingClientRect();
    var tipRect = tip.getBoundingClientRect();
    var top = rect.bottom + window.scrollY + 8;
    var left = rect.left + window.scrollX + (rect.width / 2) - (tipRect.width / 2);
    if (left < 8) left = 8;
    if (left + tipRect.width > window.innerWidth - 8) left = window.innerWidth - tipRect.width - 8;
    if (top + tipRect.height > window.scrollY + window.innerHeight) top = rect.top + window.scrollY - tipRect.height - 8;
    tip.style.top = top + 'px';
    tip.style.left = left + 'px';
  }

  function scheduleHide() {
    hideTimer = setTimeout(function(){ if (tooltipEl) tooltipEl.style.display = 'none'; }, 300);
  }

  function attachEvents() {
    document.addEventListener('mouseover', function(e) {
      var link = e.target.closest('.glossary-tooltip-link');
      if (link) showTooltip(link);
    });
    document.addEventListener('mouseout', function(e) {
      var link = e.target.closest('.glossary-tooltip-link');
      if (link) scheduleHide();
    });
    document.addEventListener('focusin', function(e) {
      if (e.target.classList && e.target.classList.contains('glossary-tooltip-link')) showTooltip(e.target);
    });
    document.addEventListener('focusout', function(e) {
      if (e.target.classList && e.target.classList.contains('glossary-tooltip-link')) scheduleHide();
    });
  }

  function init() {
    loadGlossary().then(function(data) {
      glossaryData = data;
      if (!glossaryData || glossaryData.length === 0) return;
      var count = linkTerms(glossaryData);
      if (count > 0) attachEvents();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      if (window.requestIdleCallback) requestIdleCallback(init, { timeout: 2000 });
      else setTimeout(init, 100);
    });
  } else {
    if (window.requestIdleCallback) requestIdleCallback(init, { timeout: 2000 });
    else setTimeout(init, 100);
  }
})();
