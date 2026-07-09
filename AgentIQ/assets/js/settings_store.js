/* ============================================================
   settings_store.js — App preferences
   Gemini key is configured in assets/js/config.js only.
   ============================================================ */

import { CONFIG } from './config.js';

// Legacy: Settings UI stored a masked/invalid key — ignore it so config.js is used.
try {
  localStorage.removeItem('agentiq_gemini_key');
} catch (_) { /* ignore */ }

export function getGeminiApiKey() {
  return (CONFIG.GEMINI_API_KEY || '').trim();
}

export function hasGeminiApiKey() {
  return !!getGeminiApiKey();
}
