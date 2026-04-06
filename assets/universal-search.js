/**
 * Universal Site Search Module for Threatpedia
 * Searches across glossary, threat actors, and incidents
 * No dependencies - vanilla JavaScript
 */

(function () {
  'use strict';

  // Cache for loaded JSON data
  const cache = {
    glossary: null,
    threatActors: null,
    incidents: null,
  };

  // DOM elements
  let searchInput = null;
  let resultsContainer = null;
  let selectedIndex = -1;
  let allResults = [];

  /**
   * Determine the base path for relative URLs based on current page location
   */
  function getBasePath() {
    const pathname = window.location.pathname;
    if (pathname.includes('/incidents/')) {
      return '../';
    }
    if (pathname.includes('/threat-actors/')) {
      return '../';
    }
    return './';
  }

  /**
   * Fetch JSON files with caching
   */
  async function fetchJSON(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      return null;
    }
  }

  /**
   * Load all data sources
   */
  async function loadDataSources() {
    const basePath = getBasePath();

    if (!cache.glossary) {
      cache.glossary = await fetchJSON(`${basePath}glossary-index.json`);
    }
    if (!cache.threatActors) {
      cache.threatActors = await fetchJSON(`${basePath}threat-actor-index.json`);
    }
    if (!cache.incidents) {
      cache.incidents = await fetchJSON(`${basePath}incidents/manifest.json`);
    }
  }

  /**
   * Search glossary terms
   */
  function searchGlossary(query) {
    if (!cache.glossary || !cache.glossary.terms) return [];

    const lowerQuery = query.toLowerCase();
    const results = [];

    for (const [key, term] of Object.entries(cache.glossary.terms)) {
      const name = key;
      const acronym = term.acronym || '';
      const definition = term.definition || '';

      // Score based on match position and relevance
      let score = 0;
      if (name.startsWith(lowerQuery)) score += 100;
      else if (name.includes(lowerQuery)) score += 50;

      if (acronym && acronym.toLowerCase().includes(lowerQuery)) score += 75;

      if (definition.toLowerCase().includes(lowerQuery)) score += 10;

      if (score > 0) {
        results.push({
          score,
          type: 'glossary',
          name,
          acronym,
          definition: definition.substring(0, 80) + (definition.length > 80 ? '...' : ''),
          slug: term.slug || key.replace(/\s+/g, '-'),
        });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Search threat actors
   */
  function searchThreatActors(query) {
    if (!cache.threatActors || !cache.threatActors.actors) return [];

    const lowerQuery = query.toLowerCase();
    const results = [];
    const seenActors = new Set();

    for (const [key, actor] of Object.entries(cache.threatActors.actors)) {
      // Skip alias entries
      if (actor.isAlias || !actor.name) continue;

      const canonicalName = actor.name;
      if (seenActors.has(canonicalName)) continue;
      seenActors.add(canonicalName);

      let score = 0;
      const name = canonicalName.toLowerCase();

      if (name.startsWith(lowerQuery)) score += 100;
      else if (name.includes(lowerQuery)) score += 50;

      // Check aliases
      if (actor.aliases && Array.isArray(actor.aliases)) {
        for (const alias of actor.aliases) {
          const aliasLower = alias.toLowerCase();
          if (aliasLower.startsWith(lowerQuery)) score += 75;
          else if (aliasLower.includes(lowerQuery)) score += 25;
        }
      }

      if (score > 0) {
        results.push({
          score,
          type: 'threat-actor',
          name: canonicalName,
          nation: actor.affiliation || 'Unknown',
          motivation: actor.motivation || '',
          status: actor.status || 'Unknown',
          aliases: actor.aliases || [],
        });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Search incidents
   */
  function searchIncidents(query) {
    if (!cache.incidents || !cache.incidents.incidents) return [];

    const lowerQuery = query.toLowerCase();
    const results = [];

    for (const incident of cache.incidents.incidents) {
      let score = 0;
      const title = incident.title.toLowerCase();
      const org = (incident.org || '').toLowerCase();
      const tags = incident.tags || [];

      if (title.startsWith(lowerQuery)) score += 100;
      else if (title.includes(lowerQuery)) score += 50;

      if (org.includes(lowerQuery)) score += 25;

      for (const tag of tags) {
        if (tag.toLowerCase().includes(lowerQuery)) score += 15;
      }

      if (score > 0) {
        results.push({
          score,
          type: 'incident',
          title: incident.title,
          org: incident.org || 'Unknown',
          date: incident.date || '',
          severity: incident.severity || 'Medium',
          slug: incident.slug,
          threatActor: incident.threatActor || '',
        });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Escape HTML to prevent injection
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Get severity badge color
   */
  function getSeverityColor(severity) {
    const sevLower = severity.toLowerCase();
    if (sevLower === 'critical') return '#e04040';
    if (sevLower === 'high') return '#e08020';
    if (sevLower === 'medium') return '#e0c020';
    return '#4080e0';
  }

  /**
   * Render results dropdown
   */
  function renderResults(glossaryResults, actorResults, incidentResults) {
    resultsContainer.innerHTML = '';

    // Limit to top 5 per category
    const maxPerCategory = 5;
    const glossaryTop = glossaryResults.slice(0, maxPerCategory);
    const actorTop = actorResults.slice(0, maxPerCategory);
    const incidentTop = incidentResults.slice(0, maxPerCategory);

    allResults = [];
    selectedIndex = -1;

    // Helper to create result item
    function createResultItem(result) {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.style.cssText = `
        padding: 10px 16px;
        border-bottom: 1px solid #1e2733;
        cursor: pointer;
        font-family: 'IBM Plex Sans', sans-serif;
        font-size: 0.85rem;
        color: white;
        transition: background-color 0.15s;
      `;

      item.addEventListener('mouseenter', () => {
        item.style.backgroundColor = '#1e2733';
      });
      item.addEventListener('mouseleave', () => {
        item.style.backgroundColor = 'transparent';
      });

      // Render based on type
      if (result.type === 'glossary') {
        const acronym = result.acronym ? ` [${result.acronym}]` : '';
        item.innerHTML = `
          <div style="font-weight: 500;">${escapeHtml(result.name)}${escapeHtml(acronym)}</div>
          <div style="font-size: 0.75rem; color: #8b949e; margin-top: 2px;">${escapeHtml(result.definition)}</div>
        `;
        item.addEventListener('click', () => {
          navigateToGlossary(result.slug);
        });
      } else if (result.type === 'threat-actor') {
        item.innerHTML = `
          <div style="font-weight: 500;">${escapeHtml(result.name)}</div>
          <div style="font-size: 0.75rem; color: #8b949e; margin-top: 2px;">${escapeHtml(result.nation)} • ${escapeHtml(result.motivation)}</div>
        `;
        item.addEventListener('click', () => {
          navigateToActor(result.name);
        });
      } else if (result.type === 'incident') {
        const dateStr = result.date ? new Date(result.date).toLocaleDateString() : '';
        const severityColor = getSeverityColor(result.severity);
        item.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <div>
              <div style="font-weight: 500;">${escapeHtml(result.title)}</div>
              <div style="font-size: 0.75rem; color: #8b949e; margin-top: 2px;">${escapeHtml(result.org)} • ${dateStr}</div>
            </div>
            <div style="background-color: ${severityColor}; color: white; font-size: 0.65rem; padding: 2px 6px; border-radius: 2px; white-space: nowrap; margin-left: 8px;">${escapeHtml(result.severity)}</div>
          </div>
        `;
        item.addEventListener('click', () => {
          navigateToIncident(result.slug);
        });
      }

      return item;
    }

    // Add category headers and results
    if (glossaryTop.length > 0) {
      const header = document.createElement('div');
      header.style.cssText = `
        padding: 8px 16px;
        font-family: 'IBM Plex Mono', monospace;
        font-size: 0.6rem;
        letter-spacing: 0.3em;
        color: #d4a574;
        text-transform: uppercase;
        background-color: #0d1117;
        border-bottom: 1px solid #1e2733;
      `;
      header.textContent = 'GLOSSARY';
      resultsContainer.appendChild(header);

      for (const result of glossaryTop) {
        const item = createResultItem(result);
        resultsContainer.appendChild(item);
        allResults.push(item);
      }
    }

    if (actorTop.length > 0) {
      const header = document.createElement('div');
      header.style.cssText = `
        padding: 8px 16px;
        font-family: 'IBM Plex Mono', monospace;
        font-size: 0.6rem;
        letter-spacing: 0.3em;
        color: #d4a574;
        text-transform: uppercase;
        background-color: #0d1117;
        border-bottom: 1px solid #1e2733;
      `;
      header.textContent = 'THREAT ACTORS';
      resultsContainer.appendChild(header);

      for (const result of actorTop) {
        const item = createResultItem(result);
        resultsContainer.appendChild(item);
        allResults.push(item);
      }
    }

    if (incidentTop.length > 0) {
      const header = document.createElement('div');
      header.style.cssText = `
        padding: 8px 16px;
        font-family: 'IBM Plex Mono', monospace;
        font-size: 0.6rem;
        letter-spacing: 0.3em;
        color: #d4a574;
        text-transform: uppercase;
        background-color: #0d1117;
        border-bottom: 1px solid #1e2733;
      `;
      header.textContent = 'INCIDENTS';
      resultsContainer.appendChild(header);

      for (const result of incidentTop) {
        const item = createResultItem(result);
        resultsContainer.appendChild(item);
        allResults.push(item);
      }
    }

    // Show container if there are results
    if (allResults.length > 0) {
      resultsContainer.style.display = 'block';
    } else {
      resultsContainer.style.display = 'none';
    }
  }

  /**
   * Navigate to glossary term
   */
  function navigateToGlossary(slug) {
    const basePath = getBasePath();
    window.location.href = `${basePath}glossary.html?q=${encodeURIComponent(slug)}`;
  }

  /**
   * Navigate to threat actor
   */
  function navigateToActor(name) {
    const basePath = getBasePath();
    window.location.href = `${basePath}threat-actors.html?actor=${encodeURIComponent(name)}`;
  }

  /**
   * Navigate to incident
   */
  function navigateToIncident(slug) {
    const basePath = getBasePath();
    window.location.href = `${basePath}incidents/${slug}.html`;
  }

  /**
   * Handle keyboard navigation in results
   */
  function handleKeyboard(event) {
    if (!resultsContainer || resultsContainer.style.display === 'none' || allResults.length === 0) {
      if (event.key === 'Enter') {
        // Fallback to glossary search
        const query = searchInput.value.trim();
        if (query) {
          navigateToGlossary(query);
        }
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, allResults.length - 1);
      updateSelection();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, -1);
      updateSelection();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < allResults.length) {
        allResults[selectedIndex].click();
      }
    } else if (event.key === 'Escape') {
      event.preventDefault();
      closeResults();
    }
  }

  /**
   * Update visual selection in results
   */
  function updateSelection() {
    allResults.forEach((item, index) => {
      if (index === selectedIndex) {
        item.style.backgroundColor = '#1e2733';
      } else {
        item.style.backgroundColor = 'transparent';
      }
    });

    if (selectedIndex >= 0 && selectedIndex < allResults.length) {
      allResults[selectedIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  /**
   * Close results dropdown
   */
  function closeResults() {
    if (resultsContainer) {
      resultsContainer.style.display = 'none';
    }
    selectedIndex = -1;
    allResults = [];
  }

  /**
   * Debounced search handler
   */
  let searchTimeout;
  function handleSearch() {
    clearTimeout(searchTimeout);

    const query = searchInput.value.trim();

    if (!query) {
      closeResults();
      return;
    }

    searchTimeout = setTimeout(async () => {
      await loadDataSources();

      const glossaryResults = searchGlossary(query);
      const actorResults = searchThreatActors(query);
      const incidentResults = searchIncidents(query);

      renderResults(glossaryResults, actorResults, incidentResults);
    }, 200);
  }

  /**
   * Initialize the search module
   */
  function init() {
    searchInput = document.getElementById('menu-search');
    if (!searchInput) {
      console.warn('Universal search: menu-search input not found');
      return;
    }

    // Create results container
    resultsContainer = document.createElement('div');
    resultsContainer.id = 'search-results-container';
    resultsContainer.style.cssText = `
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background-color: #0d1117;
      border: 1px solid #1e2733;
      border-top: none;
      max-height: 400px;
      overflow-y: auto;
      z-index: 1000;
      display: none;
      margin-top: -1px;
    `;

    // Wrap search input + results in a relative container so the absolute
    // dropdown positions correctly WITHOUT setting position on the menu-panel
    // (which would break its position:fixed).
    var wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    searchInput.parentNode.insertBefore(wrapper, searchInput);
    wrapper.appendChild(searchInput);
    wrapper.appendChild(resultsContainer);

    // Event listeners
    searchInput.addEventListener('input', handleSearch);
    searchInput.addEventListener('keydown', handleKeyboard);
    searchInput.addEventListener('focus', () => {
      if (searchInput.value.trim() && allResults.length > 0) {
        resultsContainer.style.display = 'block';
      }
    });

    // Close on outside click
    document.addEventListener('click', (event) => {
      if (event.target !== searchInput && !resultsContainer.contains(event.target)) {
        closeResults();
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
