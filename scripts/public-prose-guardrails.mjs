const PUBLIC_PROSE_GUARDRAILS = [
  {
    label: 'internal article/report framing',
    regex: /\bthis\s+(article|report|assessment|write[- \u2013\u2014]?up)\b|\bthis\s+Threatpedia\s+entry\b/i,
  },
  {
    label: 'editorial workflow leakage',
    regex: /\b(editorial\s+(workflow|process|scor(?:e|ing))|reviewStatus|draft_ai|draft_human|under_review)\b/i,
  },
  {
    label: 'confidence label leakage',
    regex: /\b(attribution confidence|confidence grade)\b/i,
  },
];

export function maskTextPreservingNewlines(value) {
  return value.replace(/[^\n]/g, ' ');
}

export function stripCodeBlocksPreservingLines(body) {
  return body.replace(/```[\s\S]*?```/g, maskTextPreservingNewlines);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findH2Section(bodyWithoutCodeBlocks, heading) {
  const headingRegex = new RegExp(`^## ${escapeRegex(heading)}\\s*$`, 'm');
  const headingMatch = headingRegex.exec(bodyWithoutCodeBlocks);
  if (!headingMatch) return null;

  const start = headingMatch.index;
  const contentStart = start + headingMatch[0].length;
  const afterHeading = bodyWithoutCodeBlocks.slice(contentStart);
  const nextH2 = afterHeading.search(/^## /m);
  const end = nextH2 === -1 ? bodyWithoutCodeBlocks.length : contentStart + nextH2;

  return { start, end };
}

export function getAuthoredBodyWithoutSources(body) {
  const bodyWithoutCodeBlocks = stripCodeBlocksPreservingLines(body);
  const sourcesSection = findH2Section(bodyWithoutCodeBlocks, 'Sources & References');
  if (!sourcesSection) return bodyWithoutCodeBlocks;

  const maskedSources = maskTextPreservingNewlines(
    bodyWithoutCodeBlocks.slice(sourcesSection.start, sourcesSection.end),
  );

  return [
    bodyWithoutCodeBlocks.slice(0, sourcesSection.start),
    maskedSources,
    bodyWithoutCodeBlocks.slice(sourcesSection.end),
  ].join('');
}

export function getPublicProseGuardrailIssues(body) {
  const authoredBody = getAuthoredBodyWithoutSources(body);
  const issues = [];
  const lines = authoredBody.split('\n');

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim() || line.startsWith('#')) continue;

    for (const guardrail of PUBLIC_PROSE_GUARDRAILS) {
      const match = guardrail.regex.exec(line);
      if (match) {
        issues.push({
          line: i + 1,
          label: guardrail.label,
          phrase: match[0],
        });
      }
    }
  }

  return issues;
}
