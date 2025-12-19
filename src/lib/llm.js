import slugify from './slugify';

/**
 * Generate an SEO-friendly slug using the Gemini LLM (Generative Language API).
 * Requires env var `GEMINI_API_KEY`. Optional `GEMINI_MODEL` (default: gemini-flash-lite-latest).
 * Returns the slug string or null on failure.
 */
export default async function generateSlugWithLLM(title) {
  if (!title) return null;

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';
  if (!apiKey) return null;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  // Combine system and user prompt into a single instruction
  const fullPrompt = `You are an SEO expert specializing in the Orthodox Jewish job market in Brooklyn (Boro Park, Williamsburg, etc.).
Your task is to convert blog titles into highly optimized, SEO-friendly URL slugs.

Guidelines:
1. Target Keywords: Prioritize terms like "jewish-jobs", "brooklyn", "boro-park", "yiddish", "kosher-employment", "frum-jobs" if they fit the context.
2. Format: Produce a short, lowercase, hyphen-separated slug.
3. Cleaning: Remove common stopwords (the, a, an, in, on, at, for, you, can, find, etc.) and all punctuation.
4. Length: Keep it concise (max 5-6 words).
5. Intent: Ensure the slug reflects the value for Jewish job seekers or employers in Brooklyn.

Title: "${(title || '').replace(/"/g, '')}"

Slug:`;

  const payload = {
    contents: [
      {
        parts: [
          { text: fullPrompt }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 50,
      topP: 0.95,
      topK: 40
    }
  };

  try {
    // Intentionally no verbose logging here to avoid leaking sensitive information.
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      // Avoid printing body or API key contents. Return null so caller falls back.
      return null;
    }

    const json = await res.json().catch(() => null);
    let raw = null;

    if (json) {
      // Correct Gemini API response structure: candidates[0].content.parts[0].text
      if (Array.isArray(json.candidates) && json.candidates[0]?.content?.parts) {
        const parts = json.candidates[0].content.parts;
        if (Array.isArray(parts) && parts[0]?.text) {
          raw = parts[0].text;
        }
      }
      // Legacy fallbacks
      if (!raw && Array.isArray(json.candidates) && json.candidates[0]?.content) {
        const c = json.candidates[0].content;
        if (typeof c === 'string') raw = c;
        if (Array.isArray(c) && c[0]?.text) raw = c[0].text;
      }
      if (!raw && typeof json.outputText === 'string') raw = json.outputText;
      if (!raw && typeof json.output_text === 'string') raw = json.output_text;
    }

    if (!raw) {
      return null;
    }

    if (!raw) return null;

    // Do not log raw LLM responses (may contain sensitive content)

    // Extract first line and clean it
    let firstLine = (raw.split(/\r?\n/)[0] || '').trim();
    
    // Remove common prefixes/suffixes that LLM might add
    firstLine = firstLine
      .replace(/^slug:\s*/i, '')
      .replace(/^answer:\s*/i, '')
      .replace(/^result:\s*/i, '')
      .replace(/^```.*$/gm, '')
      .replace(/["`]/g, '')
      .trim();
    
    if (!firstLine) {
      console.error('[LLM] Empty result after cleanup');
      return null;
    }

    // cleaned text kept internal

    // Normalize via slugify util to ensure allowed characters
    const s = slugify(firstLine);
    return s || null;
  } catch (err) {
    // suppress error details to avoid leaking sensitive info
    return null;
  }
}
