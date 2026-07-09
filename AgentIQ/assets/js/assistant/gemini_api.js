import { getGeminiApiKey } from '../settings_store.js';

const GEMINI_MODELS = [
  'gemini-3.5-flash',
  'gemini-3-flash',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite'
];

let cachedGenerateContentModels = null;

function normalizeModelName(name) {
  return String(name || '').replace(/^models\//, '');
}

function sortByPreference(models) {
  const preferred = new Map(GEMINI_MODELS.map((model, index) => [model, index]));
  return [...models].sort((a, b) => {
    const aRank = preferred.has(a) ? preferred.get(a) : 100;
    const bRank = preferred.has(b) ? preferred.get(b) : 100;
    return aRank === bRank ? a.localeCompare(b) : aRank - bRank;
  });
}

async function listGenerateContentModels(key) {
  if (cachedGenerateContentModels) {
    return { ok: true, models: cachedGenerateContentModels };
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`
  );

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const message = errData.error?.message || `HTTP ${response.status}`;
    return { ok: false, message, status: response.status };
  }

  const data = await response.json();
  const models = (data.models || [])
    .filter(model => (model.supportedGenerationMethods || []).includes('generateContent'))
    .map(model => normalizeModelName(model.name))
    .filter(model => model && !model.includes('embedding'));

  cachedGenerateContentModels = sortByPreference(models);
  return { ok: true, models: cachedGenerateContentModels };
}

async function callGeminiModel(model, key, fullPrompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.45,
          maxOutputTokens: 1400
        }
      })
    }
  );

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const message = errData.error?.message || `HTTP ${response.status}`;
    return { ok: false, message, status: response.status };
  }

  const data = await response.json();
  const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (replyText) {
    const formattedText = replyText
      .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      .replace(/\n/g, '<br>');
    return { ok: true, text: formattedText };
  }
  return { ok: false, message: 'The model returned an empty reply.' };
}

export async function askGemini(systemPrompt, userQuestion) {
  const key = getGeminiApiKey();
  if (!key) {
    return { error: 'no_key' };
  }

  const fullPrompt = `${systemPrompt}\n\nUser Question: ${userQuestion}`;
  let lastError = 'Could not reach Gemini API.';
  let modelsToTry = GEMINI_MODELS;

  try {
    const listedModels = await listGenerateContentModels(key);
    if (listedModels.ok && listedModels.models.length) {
      modelsToTry = listedModels.models;
    } else if (!listedModels.ok) {
      lastError = listedModels.message;
    }
  } catch (e) {
    lastError = e.message || lastError;
  }

  for (const model of modelsToTry) {
    try {
      const result = await callGeminiModel(model, key, fullPrompt);
      if (result.ok) {
        return { success: true, text: result.text, model };
      }
      lastError = result.message;
      if (result.status === 401 || result.status === 403) break;
    } catch (e) {
      lastError = e.message || 'Network request failed.';
    }
  }

  return { error: 'api_error', message: lastError };
}
