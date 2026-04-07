# Threatpedia Incident Report — Template Notes

Reference document for agents generating or updating incident reports.

## Required Script & Style Includes

Every incident report must include before `</body>`:

```html
<link rel="stylesheet" href="../assets/css/glossary-tooltips.css">
<script src="../assets/js/glossary-tooltips.js" defer></script>
<script src="../assets/site-chrome.js"></script>
<script src="../assets/universal-search.js"></script>
<script src="../assets/incident-ticker.js"></script>
```

## Required Meta Tags

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="review-status" content="pending|reviewed">
<meta name="generated-by" content="task-name-here">
<meta name="generated-date" content="2026-04-07T12:00:00Z">
```

## CSS Variables (Theme)

| Variable | Value | Usage |
|---|---|---|
| `--bg` | `#080b10` | Page background |
| `--surface` | `#0d1117` | Cards, tooltips |
| `--border` | `#1e2733` | Borders |
| `--amber` | `#e8a020` | Primary accent |
| `--amber-dim` | `#a06a10` | Secondary accent |
| `--text` | `#cdd5e0` | Body text |
| `--muted` | `#5a6a7e` | Muted text |
| `--white` | `#f0f4f8` | Headings |

## Font Stacks

- Headings: `'Playfair Display', serif`
- Body: `'IBM Plex Sans', sans-serif`
- Code/terms: `'IBM Plex Mono', monospace`

## Report Structure

```
<body>
  <div class="container">
    <div class="content-grid">
      <main> ... article content ... </main>
      <aside class="sidebar"> ... related + takeaways ... </aside>
    </div>
  </div>
  <div id="site-footer"></div>
  <!-- includes -->
</body>
```

## Glossary Tooltip Behavior

- Fetches `../glossary-index.json`, scans `<main>` for terms
- First occurrence per section wrapped in `<a class="glossary-tooltip-link">`
- Hover shows definition tooltip; click navigates to glossary
- Skips: `<a>`, `<pre>`, `<code>`, headings, `.sources-section`, `.sidebar`, `<nav>`
- Min 4 chars (except uppercase acronyms); longest-first matching
