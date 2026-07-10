#!/usr/bin/env node
import assert from 'node:assert/strict';
import { evaluateIncidentItem } from './pipeline-discover.mjs';

const currentFeedCases = [
  {
    sourceKey: 'microsoft_security_blog',
    title: 'GigaWiper: Anatomy of a destructive backdoor assembled from multiple malware',
    summary: 'GigaWiper is a destructive backdoor that combines multiple wiping and ransomware-like capabilities into a single operational platform. This blog provides guidance to help defenders detect and defend against similar threats.',
  },
  {
    sourceKey: 'microsoft_security_blog',
    title: 'Chromium extension uses AI-related branding to redirect browser search',
    summary: 'A malicious Chromium-based extension that spoofs the AI-powered answer engine Perplexity AI redirects browser search traffic using MV3 APIs and intermediary infrastructure.',
  },
  {
    sourceKey: 'ncsc_news',
    title: 'Alert: NCSC issues advice following global targeting of Fortinet firewalls and VPN gateways',
    summary: 'Organisations using Fortinet services are being urged to take action following a campaign affecting firewalls and VPN gateways.',
    link: 'https://www.ncsc.gov.uk/news/advice-following-global-targeting-of-fortinet-firewalls-and-vpn-gateways',
  },
];

for (const item of currentFeedCases) {
  const evaluation = evaluateIncidentItem(item.sourceKey, item);
  assert.equal(evaluation.accepted, true, `${item.title}: ${evaluation.reason}`);
  assert.ok(evaluation.positiveHits.length > 0, `${item.title}: missing strong signal`);
  assert.ok(evaluation.boundaryHits.length > 0, `${item.title}: missing incident boundary`);
}

const genericGuidance = evaluateIncidentItem('microsoft_security_blog', {
  title: 'Defending against cyber threats with security best practices',
  summary: 'Guidance for organizations and users on improving security posture.',
});
assert.equal(genericGuidance.accepted, false);
assert.match(genericGuidance.reason, /Hard reject/);

const kevChurn = evaluateIncidentItem('cisa_alerts', {
  title: 'CISA Adds Three Known Exploited Vulnerabilities to Catalog',
  summary: 'CISA added three vulnerabilities affecting users and organizations.',
  link: 'https://www.cisa.gov/news-events/alerts/2026/07/07/cisa-adds-three-known-exploited-vulnerabilities-catalog',
});
assert.equal(kevChurn.accepted, false);
assert.match(kevChurn.reason, /kev catalog churn/);

const icsAdvisory = evaluateIncidentItem('cisa_alerts', {
  title: 'Example industrial control system advisory',
  summary: 'A vulnerability affects users of an industrial product.',
  link: 'https://www.cisa.gov/news-events/ics-advisories/icsa-26-190-01',
});
assert.equal(icsAdvisory.accepted, false);
assert.equal(icsAdvisory.reason, 'ICS advisory excluded');

console.log('pipeline incident discovery tests passed');
