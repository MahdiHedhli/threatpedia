# Universal Search Integration Guide

The universal search module (`assets/universal-search.js`) replaces the glossary-only search across all Threatpedia pages.

## Integration

Add this single script tag to every HTML page, just before the closing `</body>` tag:

```html
<script src="assets/universal-search.js"></script>
```

For pages in subdirectories (like `/incidents/`), use:

```html
<script src="../assets/universal-search.js"></script>
```

The module automatically detects page location and computes relative paths to JSON files.

## How It Works

1. **Auto-initialization**: The script automatically finds the `menu-search` input and sets up the dropdown
2. **Three data sources**:
   - `glossary-index.json` — 718 glossary terms with definitions, acronyms, roles
   - `threat-actor-index.json` — 78 threat actors with aliases, affiliations, motivations
   - `incidents/manifest.json` — 11 incidents with titles, dates, severity, threat actors

3. **Behavior**:
   - Type to search (200ms debounce for performance)
   - Results appear in 3 categories: GLOSSARY, THREAT ACTORS, INCIDENTS
   - Max 5 results per category (15 total)
   - Arrow keys navigate, Enter selects, Escape closes
   - Click outside to dismiss

## Result Types

### Glossary
- Shows: Term name + acronym
- Link: `glossary.html?q=TERM`

### Threat Actors
- Shows: Primary name + nation + motivation
- Link: `threat-actors.html?actor=NAME`

### Incidents
- Shows: Title + organization + date + severity badge
- Links: `incidents/SLUG.html`

## Features

- **Intelligent scoring**: Results ranked by match position (prefix > contains)
- **Smart aliases**: Threat actor aliases are searchable and resolve to canonical name
- **Dark theme**: Styling matches existing dossier design with amber accents
- **Keyboard accessible**: Full keyboard navigation support
- **No dependencies**: Pure vanilla JavaScript, no external libraries
- **Cached loading**: JSON files are fetched once and cached for performance

## Styling

Results use existing CSS variables from the theme:
- `--surface` or `#0d1117` for backgrounds
- `--border` or `#1e2733` for borders
- `--white` for text
- `--amber-dim` for category headers
- Dynamic severity colors: Critical (red), High (orange), Medium (yellow)

No additional CSS is required — all styles are embedded in the JavaScript.

## Files Modified

- Created: `/threatpedia/assets/universal-search.js` (16KB, 535 lines)

## Testing

To test:
1. Include the script tag in an HTML page
2. Open the page and use the menu search
3. Type a glossary term, threat actor name, or incident title
4. Results should appear below the input
5. Use arrow keys to navigate, Enter to select
