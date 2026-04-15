/**
 * Glossary Data Endpoint — serves glossary-index.json at build time
 * so the smart-linking tooltip system can fetch it in production builds.
 */
import type { APIRoute } from 'astro';
import glossary from '../data/glossary-index.json';

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(glossary), {
    headers: { 'Content-Type': 'application/json' },
  });
};
