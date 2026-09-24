import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

// Kumpulkan pool API Key (Round Robin GEMINI_API_KEY_1 s/d GEMINI_API_KEY_9)
const apiKeysPool = [];

for (let i = 1; i <= 9; i++) {
    const k = process.env[`GEMINI_API_KEY_${i}`];
    if (k && k.trim()) {
        apiKeysPool.push(k.trim());
    }
}

if (apiKeysPool.length === 0) {
    const single = process.env.GEMINI_API_KEY;
    if (single && single.trim()) {
        apiKeysPool.push(single.trim());
    }
}

let currentKeyIndex = 0;

export function getNextApiKey() {
    if (apiKeysPool.length === 0) {
        throw new Error('API Key Gemini belum terpasang di server/.env (Gunakan GEMINI_API_KEY_1 atau GEMINI_API_KEY).');
    }
    const key = apiKeysPool[currentKeyIndex];
    currentKeyIndex = (currentKeyIndex + 1) % apiKeysPool.length;
    return key;
}

export function getApiKeyPoolStatus() {
    return {
        totalKeys: apiKeysPool.length,
        currentIndex: currentKeyIndex
    };
}

const MODELS_TO_TRY = ['gemini-3.5-flash-lite', 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];

/**
 * Menjalankan generate content teks dengan sistem failover antar-model dan rotasi API Key jika kuota habis.
 */
export async function generateSafeContent(prompt) {
    if (apiKeysPool.length === 0) {
        throw new Error('API Key Gemini belum disetel. Harap isi GEMINI_API_KEY_1 di server/.env.');
    }

    const maxAttempts = Math.max(apiKeysPool.length * 2, 4);
    let lastError = null;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const apiKey = getNextApiKey();
        const ai = new GoogleGenAI({ apiKey });

        for (const modelName of MODELS_TO_TRY) {
            try {
                const response = await ai.models.generateContent({
                    model: modelName,
                    contents: prompt
                });
                return response.text ? response.text.trim() : '';
            } catch (err) {
                lastError = err;
                const errStr = (err.message || '').toLowerCase();
                if (errStr.includes('404') || errStr.includes('not found')) {
                    // Coba model berikutnya dalam daftar fallback
                    continue;
                } else if (errStr.includes('429') || errStr.includes('quota') || errStr.includes('resource_exhausted')) {
                    console.warn(`[ROUND ROBIN] Kuota kunci index ${(currentKeyIndex - 1 + apiKeysPool.length) % apiKeysPool.length} limit. Beralih ke kunci berikutnya...`);
                    break; // Keluar dari loop model untuk mengambil kunci API berikutnya
                } else {
                    continue;
                }
            }
        }
    }

    if (lastError && !(lastError.message || '').toLowerCase().includes('429') && !(lastError.message || '').toLowerCase().includes('quota')) {
        throw new Error(`AI Error: ${lastError.message}`);
    }

    throw new Error('Seluruh kuota dari semua API Key Anda telah habis. Mohon tunggu beberapa saat.');
}

/**
 * Mentranskripsi audio (Speech-to-Text) menggunakan multimodal Gemini AI.
 */
export async function transcribeAudioSafe(audioBase64, mimeType = 'audio/webm', lang = 'id') {
    if (apiKeysPool.length === 0) {
        throw new Error('API Key Gemini belum disetel. Harap isi GEMINI_API_KEY_1 di server/.env.');
    }

    let cleanMime = (mimeType || 'audio/webm').split(';')[0].trim();
    if (!cleanMime) cleanMime = 'audio/webm';

    // Bersihkan header Base64 jika disertakan
    let rawBase64 = audioBase64;
    if (rawBase64.includes(',')) {
        rawBase64 = rawBase64.split(',')[1];
    }

    const promptText = lang === 'en'
        ? "Please transcribe the speech in this audio verbatim into text. ONLY return the plain transcribed words, with no extra commentary, notes, or quotes."
        : "Transkripsikan ucapan yang terdengar di dalam audio ini ke dalam teks secara akurat dan persis. HANYA berikan teks hasil transkripsinya saja, tanpa tanda petik atau penjelasan tambahan.";

    const contents = [
        {
            role: 'user',
            parts: [
                {
                    inlineData: {
                        mimeType: cleanMime,
                        data: rawBase64
                    }
                },
                { text: promptText }
            ]
        }
    ];

    const maxAttempts = Math.max(apiKeysPool.length * 2, 4);
    let lastError = null;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const apiKey = getNextApiKey();
        const ai = new GoogleGenAI({ apiKey });

        for (const modelName of MODELS_TO_TRY) {
            try {
                const response = await ai.models.generateContent({
                    model: modelName,
                    contents
                });
                const text = (response.text || '').trim().replace(/^["']|["']$/g, '');
                return text;
            } catch (err) {
                lastError = err;
                const errStr = (err.message || '').toLowerCase();
                if (errStr.includes('404') || errStr.includes('not found')) {
                    continue;
                } else if (errStr.includes('429') || errStr.includes('quota') || errStr.includes('resource_exhausted')) {
                    console.warn(`[ROUND ROBIN] Kuota kunci audio limit. Beralih ke kunci berikutnya...`);
                    break;
                } else {
                    continue;
                }
            }
        }
    }

    if (lastError && !(lastError.message || '').toLowerCase().includes('429')) {
        throw new Error(`Gagal mentranskripsi audio: ${lastError.message}`);
    }

    throw new Error('Gagal mentranskripsi audio karena kuota API Key habis.');
}

