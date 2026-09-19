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

        dictionary: async (_, { keyword, lang = 'id' }) => {
            if (!keyword || !keyword.trim()) {
                return { result: '', error: lang === 'en' ? 'Search keyword cannot be empty!' : 'Kata kunci pencarian tidak boleh kosong!' };
            }
            try {
                const isEn = lang === 'en';
                const prompt = isEn
                    ? `Explain the word or term "${keyword}" in the context of an educational language & programming dictionary in a natural, fluent, and warm manner, like an expert human mentor speaking directly to a student.

Writing Guidelines:
- Do NOT include words like "AI Dictionary" or horizontal lines "---".
- Start directly with its essential definition/function in clear, accessible English.
- Include:
  1. Core Definition & Concept: explain what it means and its primary purpose.
  2. Real-world Example: a natural example sentence (for languages) or a clean code snippet (for programming).
  3. Quick Tip / Best Practice: helpful practical context.
- Politely decline only if completely outside education, languages, science, or technology.`
                    : `Jelaskan kata atau istilah "${keyword}" dalam konteks kamus edukasi bahasa & pemrograman secara alami, mengalir, dan ramah seperti seorang mentor manusia yang sedang menjelaskan langsung (human-like).

Pedoman Penulisan:
- JANGAN menuliskan kata "Kamus AI", "Kamus Pintar AI", atau garis pemisah "---".
- Mulai langsung dengan definisi/fungsi esensialnya dengan bahasa yang enak dibaca.
- Cantumkan:
  1. Definisi & Konsep Utama: jelaskan apa arti dan tujuannya.
  2. Contoh Nyata: kalimat contoh (jika kosakata bahasa) atau contoh kode sederhana (jika pemrograman).
  3. Tips Singkat: konteks penggunaan yang berguna.
- Tolak dengan sopan hanya jika topik benar-benar di luar edukasi, bahasa, sains, atau teknologi.`;

                const text = await generateSafeContent(prompt);
                return { result: text, error: null };
            } catch (err) {
                return { result: '', error: `⚠️ Error: ${err.message}` };
            }
        },

        generateQuiz: async (_, { categories, level, lang = 'id' }) => {
            const isEn = lang === 'en';
            const cacheKey = `${lang}_${level}_${categories.sort().join('_')}`;
            if (quizCache.has(cacheKey)) {
                const cached = [...quizCache.get(cacheKey)];
                return cached.sort(() => Math.random() - 0.5);
            }

            const prompt = isEn
                ? `Create 5 educational multiple-choice quiz questions for ${level || 'Beginner'} level on the topics: ${categories.join(', ')}.\n` +
                  `Format as exact JSON Array:\n` +
                  `[\n` +
                  `  {\n` +
                  `    "instruction": "Short prompt instruction (e.g., Choose the correct answer)",\n` +
                  `    "question": "Complete question text in English",\n` +
                  `    "options": ["First option", "Second option", "Third option", "Fourth option"],\n` +
                  `    "answer": "A"\n` +
                  `  }\n` +
                  `]\n` +
                  `IMPORTANT:\n` +
                  `- In the 'options' array, write ONLY clean option text without 'A.', 'B.', etc.\n` +
                  `- The 'answer' value MUST be a single capital letter ('A', 'B', 'C', or 'D') corresponding to the correct option index.\n` +
                  `- Replace double quotes (") inside questions/options with single quotes ('). Return ONLY a valid JSON array.`
                : `Buat 5 soal kuis edukatif tingkat ${level || 'Pemula'} materi: ${categories.join(', ')}.\n` +
                  `Format JSON Array persis ini:\n` +
                  `[\n` +
                  `  {\n` +
                  `    "instruction": "Perintah singkat (contoh: Pilihlah jawaban yang paling tepat)",\n` +
                  `    "question": "Kalimat soal lengkap",\n` +
                  `    "options": ["Opsi pertama", "Opsi kedua", "Opsi ketiga", "Opsi keempat"],\n` +
                  `    "answer": "A"\n` +
                  `  }\n` +
                  `]\n` +
                  `PENTING:\n` +
                  `- Di array "options", tulis teks pilihannya saja secara murni. JANGAN menambahkan awalan huruf seperti "A.", "B.", "C.", "D." di awal teks.\n` +
                  `- Nilai "answer" HARUS berupa satu huruf kapital ("A", "B", "C", atau "D") yang sesuai dengan urutan opsi yang benar.\n` +
                  `- GANTI tanda kutip ganda (") di dalam teks soal/opsi dengan kutip tunggal ('). Output HANYA array JSON yang valid.`;

            try {
                const raw = await generateSafeContent(prompt);
                const quizList = parseSafeJson(raw);
                quizCache.set(cacheKey, quizList);
                return quizList;
            } catch (err) {
                return [
                    {
                        instruction: isEn ? "🚨 SYSTEM ERROR" : "🚨 SISTEM ERROR",
                        question: `Detail: ${err.message}`,
                        options: isEn ? ["Check API Key", "Wait", "Refresh", "Ok"] : ["Cek API Key", "Tunggu", "Refresh", "Ok"],
                        answer: "A"
                    }
                ];
            }
        },

        generateChallenge: async (_, { category, lang = 'id' }) => {
            const isEn = lang === 'en';
            const prompt = isEn
                ? `Create 3 challenging exam questions on the topic: ${category || 'General'}.\n` +
                  `Format as exact JSON Array:\n` +
                  `[\n` +
                  `  {\n` +
                  `    "instruction": "Advanced Challenge",\n` +
                  `    "question": "Complete question text in English",\n` +
                  `    "options": ["First option", "Second option", "Third option", "Fourth option"],\n` +
                  `    "answer": "A"\n` +
                  `  }\n` +
                  `]\n` +
                  `IMPORTANT:\n` +
                  `- In the 'options' array, provide ONLY clean option text without 'A.', 'B.' prefixes.\n` +
                  `- The 'answer' MUST be a single capital letter ('A', 'B', 'C', or 'D') corresponding to the correct option index.\n` +
                  `- Replace double quotes (") with single quotes ('). Return ONLY a valid JSON array.`
                : `Buat 3 soal ujian tantangan materi: ${category || 'General'}.\n` +
                  `Format JSON Array persis ini:\n` +
                  `[\n` +
                  `  {\n` +
                  `    "instruction": "Tantangan Khusus",\n` +
                  `    "question": "Kalimat soal lengkap",\n` +
                  `    "options": ["Opsi pertama", "Opsi kedua", "Opsi ketiga", "Opsi keempat"],\n` +
                  `    "answer": "A"\n` +
                  `  }\n` +
                  `]\n` +
                  `PENTING:\n` +
                  `- Di array "options", tulis teks pilihannya saja secara murni tanpa awalan huruf seperti "A.", "B.".\n` +
                  `- Nilai "answer" HARUS berupa satu huruf kapital ("A", "B", "C", atau "D") sesuai opsi yang benar.\n` +
                  `- GANTI tanda kutip ganda (") di dalam teks soal/opsi dengan kutip tunggal ('). Output HANYA array JSON yang valid.`;

            try {
                const raw = await generateSafeContent(prompt);
                return parseSafeJson(raw);
            } catch (err) {
                return [
                    {
                        instruction: isEn ? "🚨 SYSTEM ERROR" : "🚨 SISTEM ERROR",
                        question: `Detail: ${err.message}`,
                        options: isEn ? ["Check API", "Wait", "Ok", "Cancel"] : ["Cek API", "Tunggu", "Ok", "Batal"],
                        answer: "A"
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
                ? `You are a supportive, warm, and expert human mentor in ${category}.\n` +
                  `Question: ${question}\n` +
                  `Student's chosen answer: ${userAnswer}\n` +
                  `Correct answer: ${correctAnswer}\n\n` +
                  `Write a friendly, encouraging, and human explanation in 2 clear, helpful points:\n` +
                  `1. Why "${userAnswer}" is a tricky slip and why it is not the right fit here.\n` +
                  `2. Why "${correctAnswer}" is the correct answer, with the key concept or mnemonic to remember it easily.\n` +
                  `Do NOT use robotic openings like "As an AI". Keep it conversational, encouraging, and easy to understand.`
                : `Kamu adalah guru/mentor belajar yang hangat, ramah, dan suportif dalam materi ${category}.\n` +
                  `Soal: ${question}\n` +
                  `Jawaban yang dipilih pemelajar: ${userAnswer}\n` +
                  `Kunci jawaban yang benar: ${correctAnswer}\n\n` +
                  `Berikan penjelasan yang mengalir bersahabat (seperti kakak membimbing adiknya):\n` +
                  `1. Kenapa pilihan "${userAnswer}" kurang tepat dan di mana letak kekeliruannya.\n` +
                  `2. Kenapa pilihan "${correctAnswer}" adalah jawaban yang benar serta konsep/aturan kuncinya agar mudah dipahami.\n` +
                  `JANGAN menggunakan kalimat kaku seperti "Sebagai AI". Tulis langsung dengan gaya bertutur yang hangat dan membimbing.`;

            try {
                const explanation = await generateSafeContent(prompt);
                return { explanation, error: null };
            } catch (err) {
                return {
                    explanation: '',
                    error: `⚠️ Gagal memuat penjelasan: ${err.message}`
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
