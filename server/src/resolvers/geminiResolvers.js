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
const dictionaryCache = new Map();

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
            const cleanKeyword = keyword.trim();
            const cacheKey = `${lang}_${cleanKeyword.toLowerCase()}`;
            if (dictionaryCache.has(cacheKey)) {
                return { result: dictionaryCache.get(cacheKey), error: null };
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
                if (text) { dictionaryCache.set(cacheKey, text); }
                return { result: text, error: null };
            } catch (err) {
                return { result: '', error: `⚠️ Error: ${err.message}` };
            }
        },

        generateQuiz: async (_, { categories, level, lang = 'id', unit = 1, topicDetail = '', refresh = false }) => {
            const isEn = lang === 'en';
            const cleanCategories = Array.isArray(categories) ? categories : [categories || 'General'];
            const topicStr = cleanCategories.sort().join('_');
            const cacheKey = `${lang}_${level}_${topicStr}_u${unit}_${topicDetail || ''}`;

            if (refresh && quizCache.has(cacheKey)) {
                quizCache.delete(cacheKey);
            } else if (!refresh && quizCache.has(cacheKey)) {
                const cached = [...quizCache.get(cacheKey)];
                return cached.sort(() => Math.random() - 0.5);
            }

            const unitFocusMap = {
                1: isEn ? "Unit 1 (Core Foundations, Key Vocabulary, Basic Syntax)" : "Bab 1 (Fondasi Dasar, Kosakata Esensial, Sintaksis Awal)",
                2: isEn ? "Unit 2 (Sentence Structure, Core Grammar, Loops & Logic Flow)" : "Bab 2 (Struktur Kalimat, Tata Bahasa Inti, Perulangan & Alur Logika)",
                3: isEn ? "Unit 3 (Practical Real-world Dialogue, Everyday Situations, Functions & Collections)" : "Bab 3 (Percakapan Sehari-hari, Situasi Nyata, Fungsi & Pengolahan Data)",
                4: isEn ? "Unit 4 (Idiomatic Expressions, Slang & Nuances, Algorithm Debugging)" : "Bab 4 (Idiom, Bahasa Gaul, Nuansa Kontekstual, Debugging & Studi Kasus)",
                5: isEn ? "Unit 5 (Advanced Mastery, Complex Text Comprehension, Architecture & Best Practices)" : "Bab 5 (Penguasaan Mahir, Pemahaman Kalimat Kompleks, Pola Desain & Optimasi)"
            };

            const selectedFocus = topicDetail || unitFocusMap[unit] || `Unit ${unit}`;
            const seed = Math.floor(Math.random() * 9000) + 1000;

            const prompt = isEn
                ? `You are an expert curriculum designer. Create 5 FRESH, ENGAGING, and UNIQUE multiple-choice questions for ${level || 'Beginner'} level on: ${cleanCategories.join(', ')}.\n` +
                  `Focus specifically on ${selectedFocus}.\n` +
                  `Question Variety Seed #${seed}: Make sure questions are practical, varied, and not repetitive clichés. For coding, include real short code snippets. For languages, test realistic contextual usage.\n\n` +
                  `Format as exact JSON Array:\n` +
                  `[\n` +
                  `  {\n` +
                  `    "instruction": "Short context instruction (e.g. Choose the correct phrase / What is the output of this code?)",\n` +
                  `    "question": "Question text in English",\n` +
                  `    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],\n` +
                  `    "answer": "A"\n` +
                  `  }\n` +
                  `]\n` +
                  `CRITICAL RULES:\n` +
                  `- In 'options', provide ONLY pure option text without 'A.', 'B.', '1.', etc.\n` +
                  `- 'answer' MUST be a single capital letter ('A', 'B', 'C', or 'D') matching the correct option index.\n` +
                  `- Replace double quotes (") inside questions/options with single quotes ('). Output ONLY valid JSON.`
                : `Kamu adalah kurator materi edukasi profesional. Buat 5 soal kuis pilihan ganda yang SEGAR, MENARIK, dan TIDAK MONOTON (Anti-Repetisi) tingkat ${level || 'Pemula'} materi: ${cleanCategories.join(', ')}.\n` +
                  `Fokus khusus materi: ${selectedFocus}.\n` +
                  `Variasi Soal #${seed}: Buat soal yang aplikatif dan kaya konteks (bukan pertanyaan hafalan klise yang membosankan). Untuk koding, sertakan potongan kode nyata atau tebak alur. Untuk bahasa dunia, uji pemahaman konteks percakapan nyata.\n\n` +
                  `Format JSON Array persis ini:\n` +
                  `[\n` +
                  `  {\n` +
                  `    "instruction": "Instruksi singkat (contoh: Pilihlah kalimat yang paling tepat / Apa keluaran kode berikut?)",\n` +
                  `    "question": "Kalimat soal lengkap",\n` +
                  `    "options": ["Opsi pertama", "Opsi kedua", "Opsi ketiga", "Opsi keempat"],\n` +
                  `    "answer": "A"\n` +
                  `  }\n` +
                  `]\n` +
                  `ATURAN PENTING:\n` +
                  `- Di array "options", tulis teks pilihannya saja secara murni tanpa awalan huruf seperti "A.", "B.", "1." dsb.\n` +
                  `- Nilai "answer" HARUS berupa satu huruf kapital ("A", "B", "C", atau "D") yang sesuai dengan urutan opsi yang benar.\n` +
                  `- GANTI tanda kutip ganda (") di dalam teks soal/opsi dengan kutip tunggal ('). Output HANYA array JSON yang valid.`;

            try {
                const raw = await generateSafeContent(prompt);
                const quizList = parseSafeJson(raw);
                if (Array.isArray(quizList) && quizList.length > 0) {
                    quizCache.set(cacheKey, quizList);
                    return quizList;
                }
            } catch (err) {
                console.warn(`⚠️ [Gemini Quiz Fallback] Gagal memuat soal AI (${err.message}). Menggunakan bank soal darurat.`);
                return [
                    {
                        instruction: isEn ? `Review Exercise - ${selectedFocus}` : `Latihan Mandiri - ${selectedFocus}`,
                        question: isEn
                            ? `Which statement represents the core principle of ${cleanCategories[0]} in ${selectedFocus}?`
                            : `Manakah konsep yang paling tepat merepresentasikan materi ${cleanCategories[0]} pada ${selectedFocus}?`,
                        options: isEn
                            ? ["Understanding structured core fundamentals", "Random unverified assumptions", "Skipping syntax logic", "Ignoring execution contexts"]
                            : ["Memahami fondasi struktur dan konteks dengan tepat", "Asumsi acak tanpa verifikasi", "Mengabaikan logika sintaksis", "Melewatkan konteks penggunaan"],
                        answer: "A"
                    },
                    {
                        instruction: isEn ? "Concept Check" : "Pemahaman Konsep",
                        question: isEn
                            ? `In ${cleanCategories[0]}, how is continuous mastery best achieved across learning units?`
                            : `Dalam ${cleanCategories[0]}, bagaimana cara terbaik meningkatkan penguasaan materi secara bertahap?`,
                        options: isEn
                            ? ["Step-by-step progressive practice & real application", "Cramming without context", "Only memorizing static questions", "Never reviewing mistakes"]
                            : ["Latihan bertahap, variasi soal, dan penerapan kontekstual", "Menghafal tanpa konteks", "Hanya mengulang soal yang sama", "Tidak mengevaluasi kesalahan"],
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
