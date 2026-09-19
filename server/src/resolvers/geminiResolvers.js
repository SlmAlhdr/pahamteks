import { generateSafeContent, transcribeAudioSafe } from '../config/gemini.js';

export const LANGUAGES_MAP = {
    "afrikaans": "af", "albanian": "sq", "amharic": "am", "arabic": "ar", "armenian": "hy", "azerbaijani": "az",
    "basque": "eu", "belarusian": "be", "bengali": "bn", "bosnian": "bs", "bulgarian": "bg", "catalan": "ca",
    "cebuano": "ceb", "chichewa": "ny", "chinese (simplified)": "zh-cn", "chinese (traditional)": "zh-tw",
    "corsican": "co", "croatian": "hr", "czech": "cs", "danish": "da", "dutch": "nl", "english": "en",
    "esperanto": "eo", "estonian": "et", "filipino": "tl", "finnish": "fi", "french": "fr", "frisian": "fy",
    "galician": "gl", "georgian": "ka", "german": "de", "greek": "el", "gujarati": "gu", "haitian creole": "ht",
    "hausa": "ha", "hawaiian": "haw", "hebrew": "he", "hindi": "hi", "hmong": "hmn", "hungarian": "hu",
    "icelandic": "is", "igbo": "ig", "indonesian": "id", "irish": "ga", "italian": "it", "japanese": "ja",
    "javanese": "jw", "kannada": "kn", "kazakh": "kk", "khmer": "km", "korean": "ko", "kurdish (kurmanji)": "ku",
    "kyrgyz": "ky", "lao": "lo", "latin": "la", "latvian": "lv", "lithuanian": "lt", "luxembourgish": "lb",
    "macedonian": "mk", "malagasy": "mg", "malay": "ms", "malayalam": "ml", "maltese": "mt", "maori": "mi",
    "marathi": "mr", "mongolian": "mn", "myanmar (burmese)": "my", "nepali": "ne", "norwegian": "no",
    "pashto": "ps", "persian": "fa", "polish": "pl", "portuguese": "pt", "punjabi": "pa", "romanian": "ro",
    "russian": "ru", "samoan": "sm", "scots gaelic": "gd", "serbian": "sr", "sesotho": "st", "shona": "sn",
    "sindhi": "sd", "sinhala": "si", "slovak": "sk", "slovenian": "sl", "somali": "so", "spanish": "es",
    "sundanese": "su", "swahili": "sw", "swedish": "sv", "tajik": "tg", "tamil": "ta", "telugu": "te",
    "thai": "th", "turkish": "tr", "ukrainian": "uk", "urdu": "ur", "uzbek": "uz", "vietnamese": "vi",
    "welsh": "cy", "xhosa": "xh", "yiddish": "yi", "yoruba": "yo", "zulu": "zu"
};

const quizCache = new Map();

function parseSafeJson(rawText) {
    try {
        let cleaned = rawText.replace(/```[a-zA-Z]*\n?/g, '').replace(/```/g, '').trim();
        const start = cleaned.indexOf('[');
        const end = cleaned.lastIndexOf(']') + 1;
        if (start !== -1 && end !== 0) {
            cleaned = cleaned.substring(start, end);
        }
        return JSON.parse(cleaned);
    } catch (e) {
        throw new Error(`Gagal membedah format JSON AI: ${e.message}. Teks mentah: ${rawText}`);
    }
}

export const geminiResolvers = {
    Query: {
        languages: () => {
            return Object.entries(LANGUAGES_MAP).map(([name, code]) => ({
                code,
                name: name.charAt(0).toUpperCase() + name.slice(1)
            }));
        },

        dictionary: async (_, { keyword }) => {
            if (!keyword || !keyword.trim()) {
                return { result: '', error: 'Kata kunci pencarian tidak boleh kosong!' };
            }
            try {
                const prompt = `Kamus AI. Cari: '${keyword}'. Berikan Definisi & contoh kalimat (jika bahasa) atau Fungsi & contoh (jika IT). Tolak jika di luar topik edukasi.`;
                const text = await generateSafeContent(prompt);
                return { result: text, error: null };
            } catch (err) {
                return { result: '', error: `⚠️ AI Error: ${err.message}` };
            }
        },

        generateQuiz: async (_, { categories, level }) => {
            const cacheKey = `${level}_${categories.sort().join('_')}`;
            if (quizCache.has(cacheKey)) {
                const cached = [...quizCache.get(cacheKey)];
                // Shuffle agar urutan variatif
                return cached.sort(() => Math.random() - 0.5);
            }

            const prompt = `Buat 5 soal kuis tingkat ${level || 'Pemula'} materi: ${categories.join(', ')}.\n` +
                `Format JSON Array persis ini:\n` +
                `[ { "instruction": "Perintah", "question": "Soal lengkap", "options": ["A", "B", "C", "D"], "answer": "A" } ]\n` +
                `GANTI tanda kutip ganda (") di dalam soal/opsi dengan kutip tunggal ('). Output JSON saja.`;

            try {
                const raw = await generateSafeContent(prompt);
                const quizList = parseSafeJson(raw);
                quizCache.set(cacheKey, quizList);
                return quizList;
            } catch (err) {
                return [
                    {
                        instruction: "🚨 SISTEM ERROR",
                        question: `Detail: ${err.message}`,
                        options: ["Cek API Key", "Tunggu", "Refresh", "Ok"],
                        answer: "Cek API Key"
                    }
                ];
            }
        },

        generateChallenge: async (_, { category }) => {
            const prompt = `Buat 3 soal ujian SULIT topik: ${category || 'General'}.\n` +
                `Format JSON Array persis ini:\n` +
                `[ { "instruction": "Tantangan", "question": "Soal lengkap", "options": ["A", "B", "C", "D"], "answer": "A" } ]\n` +
                `GANTI tanda kutip ganda (") di dalam soal/opsi dengan kutip tunggal ('). Output JSON saja.`;

            try {
                const raw = await generateSafeContent(prompt);
                return parseSafeJson(raw);
            } catch (err) {
                return [
                    {
                        instruction: "🚨 SISTEM ERROR",
                        question: `Detail: ${err.message}`,
                        options: ["Cek API", "Tunggu", "Ok", "Batal"],
                        answer: "Ok"
                    }
                ];
            }
        }
    },

    Mutation: {
        translate: async (_, { text, source, target }) => {
            if (!text || !text.trim()) {
                return { translatedText: '', error: null };
            }
            const sourceName = Object.keys(LANGUAGES_MAP).find(k => LANGUAGES_MAP[k] === source) || "Auto Detect";
            const targetName = Object.keys(LANGUAGES_MAP).find(k => LANGUAGES_MAP[k] === target) || "English";

            try {
                const prompt = `Translate exactly from ${sourceName} to ${targetName}:\n${text}\n\nONLY output the translation.`;
                const translated = await generateSafeContent(prompt);
                return {
                    translatedText: translated.replace(/^["']|["']$/g, ''),
                    error: null
                };
            } catch (err) {
                return {
                    translatedText: '',
                    error: `⚠️ AI Error: ${err.message}`
                };
            }
        },

        explainAnswer: async (_, { question, userAnswer, correctAnswer, category = 'General', lang = 'id' }) => {
            if (!question || !question.trim()) {
                return { explanation: '', error: 'Pertanyaan tidak boleh kosong!' };
            }

            const isEn = lang === 'en';
            const prompt = isEn
                ? `You are a friendly, expert tutor in ${category}.\n` +
                  `Question: ${question}\n` +
                  `User's chosen answer (Incorrect): ${userAnswer}\n` +
                  `Correct answer: ${correctAnswer}\n\n` +
                  `Explain clearly and concisely in 2-3 short bullet points:\n` +
                  `1. Why the user's answer ('${userAnswer}') is incorrect or what misconception it has.\n` +
                  `2. Why the correct answer ('${correctAnswer}') is right, including the underlying rule/concept.\n` +
                  `Keep the tone encouraging, educational, and direct.`
                : `Kamu adalah tutor edukasi yang ramah dan ahli dalam topik ${category}.\n` +
                  `Pertanyaan: ${question}\n` +
                  `Pilihan jawaban pengguna (Salah): ${userAnswer}\n` +
                  `Kunci jawaban yang benar: ${correctAnswer}\n\n` +
                  `Jelaskan secara ringkas, padat, dan jelas dalam 2-3 poin:\n` +
                  `1. Mengapa pilihan '${userAnswer}' kurang tepat / salah (jelaskan kekeliruannya).\n` +
                  `2. Mengapa pilihan '${correctAnswer}' adalah jawaban yang benar (jelaskan konsep/aturan dasarnya).\n` +
                  `Gunakan bahasa yang bersahabat, mendidik, dan langsung pada intinya.`;

            try {
                const explanation = await generateSafeContent(prompt);
                return { explanation, error: null };
            } catch (err) {
                return {
                    explanation: '',
                    error: `⚠️ Gagal memuat penjelasan AI: ${err.message}`
                };
            }
        },

        transcribeAudio: async (_, { audioBase64, mimeType = 'audio/webm', lang = 'id' }) => {
            if (!audioBase64 || !audioBase64.trim()) {
                return { text: '', error: 'Data audio tidak ditemukan!' };
            }
            try {
                const text = await transcribeAudioSafe(audioBase64, mimeType, lang);
                return { text, error: null };
            } catch (err) {
                return { text: '', error: `Gagal mentranskripsi audio: ${err.message}` };
            }
        }
    }
};

