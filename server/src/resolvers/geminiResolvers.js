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

// Ambil JSON dari keluaran AI yang mungkin dibungkus markdown.
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

// Terima hanya soal objektif dengan empat opsi dan kunci jawaban yang cocok.
function filterKnowledgeQuestions(items, lang = 'id') {
    if (!Array.isArray(items)) return [];

    const metaQuestionPattern = lang === 'en'
        ? /\b(?:what do you think|in your opinion|what is your opinion|what is your experience|how do you feel|how do you learn|how do you study|best way (?:to )?learn|chapter\s+\d+|unit\s+\d+)\b/i
        : /\b(?:menurut (?:kamu|anda)|apa pendapat|pendapatmu|pengalaman(?:mu| anda)?|bagaimana perasaan|cara (?:terbaik )?(?:untuk )?(?:belajar|menguasai)|bab\s+\d+|unit\s+\d+)\b/i;
    const normalize = (value) => String(value || '').trim().replace(/^[A-D][.)]\s*/i, '').toLocaleLowerCase();
    const seenQuestions = new Set();

    return items.filter((item) => {
        if (!item || typeof item.question !== 'string' || !item.question.trim()) return false;
        if (metaQuestionPattern.test(item.question)) return false;
        if (!Array.isArray(item.options) || item.options.length !== 4) return false;

        const options = item.options.map((option) => typeof option === 'string' ? option.trim() : '');
        if (options.some((option) => !option) || new Set(options.map(normalize)).size !== 4) return false;

        const answer = String(item.answer || '').trim();
        const answerIsLetter = /^[A-D]$/i.test(answer) || /^[A-D][.)]\s*/i.test(answer);
        const answerIsOption = options.some((option) => normalize(option) === normalize(answer));
        if (!answerIsLetter && !answerIsOption) return false;

        const questionKey = normalize(item.question);
        if (seenQuestions.has(questionKey)) return false;
        seenQuestions.add(questionKey);
        return true;
    });
}

export const geminiResolvers = {
    Query: {
        languages: () => {
            return Object.entries(LANGUAGES_MAP).map(([name, code]) => ({
                code,
                name: name.charAt(0).toUpperCase() + name.slice(1)
            }));
        },

        // Cari definisi AI dan gunakan cache untuk kata yang pernah dicari.
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

        // Buat soal sesuai topik/unit dan gunakan cache kecuali diminta refresh.
        generateQuiz: async (_, { categories, level, lang = 'id', unit = 1, topicDetail = '', refresh = false, count = 5 }) => {
            const isEn = lang === 'en';
            const questionCount = Math.min(20, Math.max(1, Math.trunc(Number(count) || 5)));
            const cleanCategories = Array.isArray(categories) ? categories : [categories || 'General'];
            const topicStr = cleanCategories.sort().join('_');
            const cacheKey = `knowledge_v3_${lang}_${level}_${topicStr}_u${unit}_n${questionCount}_${topicDetail || ''}`;

            if (refresh && quizCache.has(cacheKey)) {
                quizCache.delete(cacheKey);
            } else if (!refresh && quizCache.has(cacheKey)) {
                const cached = [...quizCache.get(cacheKey)];
                if (cached.length === questionCount) {
                    return cached.sort(() => Math.random() - 0.5);
                }
                quizCache.delete(cacheKey);
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
                ? `You are an expert curriculum designer. Create exactly ${questionCount} FRESH, ENGAGING, and UNIQUE multiple-choice questions for ${level || 'Beginner'} level on: ${cleanCategories.join(', ')}.\n` +
                  `Focus specifically on ${selectedFocus}.\n` +
                  `Question Variety Seed #${seed}: Make questions varied and non-repetitive. Every question MUST assess objective knowledge of the subject and selected focus. Ask direct content questions, not questions about the chapter, learning strategies, or how to master the material. Do not ask about the learner's personal experiences, opinions, preferences, habits, or biography. A language scenario is allowed only when the answer tests vocabulary, grammar, meaning, or comprehension; coding questions should test concepts, syntax, code output, debugging, or logic. Ensure each question has one objectively correct answer and plausible distractors.\n\n` +
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
                  `- Questions must be answerable from subject knowledge, without relying on personal experience or opinion.\n` +
                  `- Replace double quotes (") inside questions/options with single quotes ('). Output ONLY valid JSON.`
                : `Kamu adalah kurator materi edukasi profesional. Buat tepat ${questionCount} soal kuis pilihan ganda yang SEGAR, MENARIK, dan TIDAK MONOTON (Anti-Repetisi) tingkat ${level || 'Pemula'} materi: ${cleanCategories.join(', ')}.\n` +
                  `Fokus khusus materi: ${selectedFocus}.\n` +
                  `Variasi Soal #${seed}: Buat soal yang bervariasi dan tidak monoton. Setiap soal WAJIB menguji pengetahuan objektif tentang isi materi dan fokus bab. Tanyakan langsung konsep/materi yang dipelajari, bukan tentang babnya, cara belajar, strategi belajar, atau cara menguasai materi. Jangan menanyakan pengalaman pribadi, pendapat, preferensi, kebiasaan, atau riwayat hidup pemelajar. Konteks percakapan bahasa hanya boleh digunakan jika jawabannya menguji kosakata, tata bahasa, makna, atau pemahaman; soal koding harus menguji konsep, sintaks, keluaran kode, debugging, atau logika. Setiap soal harus memiliki satu jawaban yang benar secara objektif dan opsi pengecoh yang masuk akal.\n\n` +
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
                  `- Soal harus dapat dijawab berdasarkan pengetahuan materi, tanpa bergantung pada pengalaman atau pendapat pribadi pemelajar.\n` +
                  `- GANTI tanda kutip ganda (") di dalam teks soal/opsi dengan kutip tunggal ('). Output HANYA array JSON yang valid.`;

            try {
                const raw = await generateSafeContent(prompt);
                let quizList = [];
                try {
                    quizList = filterKnowledgeQuestions(parseSafeJson(raw), lang);
                } catch (parseError) {
                    console.warn('[Gemini Quiz] Jawaban AI tidak valid; meminta soal pengganti:', parseError.message);
                }

                if (quizList.length < questionCount) {
                    const missingCount = questionCount - quizList.length;
                    const previousQuestions = JSON.stringify(quizList.map((item) => item.question));
                    const supplementPrompt = isEn
                        ? `The first response did not contain enough valid questions. Generate exactly ${missingCount} ADDITIONAL unique multiple-choice questions for ${level || 'Beginner'} level on ${cleanCategories.join(', ')}, focused on ${selectedFocus}. Ask direct, objectively answerable subject-knowledge questions. Do not ask about the chapter, study strategies, opinions, or personal experience. Do not repeat these questions: ${previousQuestions}. Return ONLY a JSON array with exactly ${missingCount} objects, each with instruction, question, exactly four string options, and an answer of A, B, C, or D.`
                        : `Respons pertama belum berisi cukup soal yang valid. Buat tepat ${missingCount} soal pilihan ganda TAMBAHAN yang unik untuk tingkat ${level || 'Pemula'}, materi ${cleanCategories.join(', ')}, fokus ${selectedFocus}. Tanyakan langsung pengetahuan materi yang objektif dan dapat dijawab dengan benar. Jangan bertanya tentang bab, strategi belajar, pendapat, atau pengalaman pribadi. Jangan mengulang soal berikut: ${previousQuestions}. Keluarkan HANYA array JSON dengan tepat ${missingCount} objek, setiap objek memiliki instruction, question, tepat empat opsi teks, dan answer berupa A, B, C, atau D.`;

                    const supplementRaw = await generateSafeContent(supplementPrompt);
                    const supplementQuestions = filterKnowledgeQuestions(parseSafeJson(supplementRaw), lang);
                    const knownQuestions = new Set(quizList.map((item) => item.question.trim().toLocaleLowerCase()));
                    const uniqueSupplements = supplementQuestions.filter((item) => {
                        const key = item.question.trim().toLocaleLowerCase();
                        if (knownQuestions.has(key)) return false;
                        knownQuestions.add(key);
                        return true;
                    });
                    quizList = [...quizList, ...uniqueSupplements];
                }

                if (quizList.length < questionCount) {
                    throw new Error(`AI only returned ${quizList.length} of ${questionCount} valid knowledge questions.`);
                }

                const selectedQuiz = quizList.slice(0, questionCount);
                quizCache.set(cacheKey, selectedQuiz);
                return selectedQuiz;
            } catch (err) {
                console.error(`[Gemini Quiz] Gagal membuat ${questionCount} soal pengetahuan (${lang}, ${topicStr}, unit ${unit}):`, err.message);
                throw new Error(isEn
                    ? `Could not generate exactly ${questionCount} knowledge questions. Please try again.`
                    : `Belum berhasil membuat tepat ${questionCount} soal pengetahuan. Silakan coba lagi.`);
            }
        },

        // Hasilkan soal tantangan untuk kategori yang dipilih.
        generateChallenge: async (_, { category, lang = 'id', count = 3 }) => {
            const isEn = lang === 'en';
            const questionCount = Math.min(20, Math.max(1, Math.trunc(Number(count) || 3)));
            const challengeTopic = category || 'General';
            const prompt = isEn
                ? `Create exactly ${questionCount} challenging multiple-choice questions that test objective knowledge of the topic: ${challengeTopic}. Ask direct content questions, not about the chapter, study strategies, opinions, or personal experience. Each question must have exactly one objectively correct answer.\n` +
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
                  `- Test concepts, rules, meaning, comprehension, syntax, or application of the topic; never ask about personal experiences or opinions.\n` +
                  `- Replace double quotes (") with single quotes ('). Return ONLY a valid JSON array.`
                : `Buat tepat ${questionCount} soal pilihan ganda tantangan yang menguji pengetahuan objektif tentang materi: ${challengeTopic}. Tanyakan langsung isi materi, bukan tentang bab, strategi belajar, pendapat, atau pengalaman pribadi. Setiap soal harus dapat dijawab berdasarkan pengetahuan materi dan memiliki tepat satu jawaban yang benar secara objektif.\n` +
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
                  `- Uji konsep, aturan, makna, pemahaman, sintaks, atau penerapan materi; jangan menanyakan pengalaman atau pendapat pribadi.\n` +
                  `- GANTI tanda kutip ganda (") di dalam teks soal/opsi dengan kutip tunggal ('). Output HANYA array JSON yang valid.`;

            try {
                const raw = await generateSafeContent(prompt);
                let questions = [];
                try {
                    questions = filterKnowledgeQuestions(parseSafeJson(raw), lang);
                } catch (parseError) {
                    console.warn('[Gemini Challenge] Jawaban AI tidak valid; meminta soal pengganti:', parseError.message);
                }

                if (questions.length < questionCount) {
                    const missingCount = questionCount - questions.length;
                    const previousQuestions = JSON.stringify(questions.map((item) => item.question));
                    const supplementPrompt = isEn
                        ? `Generate exactly ${missingCount} additional unique multiple-choice knowledge questions about ${challengeTopic}. Ask direct subject-content questions, not questions about study habits, opinions, or personal experience. Do not repeat these questions: ${previousQuestions}. Return only a JSON array with exactly ${missingCount} objects; each must have one question, exactly four string options, and an answer A, B, C, or D.`
                        : `Buat tepat ${missingCount} soal pilihan ganda pengetahuan tambahan yang unik tentang ${challengeTopic}. Tanyakan langsung isi materi, bukan kebiasaan belajar, pendapat, atau pengalaman pribadi. Jangan mengulang soal berikut: ${previousQuestions}. Keluarkan hanya array JSON dengan tepat ${missingCount} objek; setiap objek memiliki satu pertanyaan, tepat empat opsi teks, dan jawaban A, B, C, atau D.`;
                    const supplementRaw = await generateSafeContent(supplementPrompt);
                    const supplements = filterKnowledgeQuestions(parseSafeJson(supplementRaw), lang);
                    const knownQuestions = new Set(questions.map((item) => item.question.trim().toLocaleLowerCase()));
                    questions = [
                        ...questions,
                        ...supplements.filter((item) => {
                            const key = item.question.trim().toLocaleLowerCase();
                            if (knownQuestions.has(key)) return false;
                            knownQuestions.add(key);
                            return true;
                        })
                    ];
                }

                if (questions.length < questionCount) {
                    throw new Error(`AI only returned ${questions.length} of ${questionCount} valid challenge questions.`);
                }
                return questions.slice(0, questionCount);
            } catch (err) {
                console.error(`[Gemini Challenge] Gagal membuat ${questionCount} soal (${lang}, ${challengeTopic}):`, err.message);
                throw new Error(isEn
                    ? `Could not generate exactly ${questionCount} challenge questions. Please try again.`
                    : `Belum berhasil membuat tepat ${questionCount} soal tantangan. Silakan coba lagi.`);
            }
        }
    },

    Mutation: {
        // Terjemahkan teks sesuai bahasa sumber dan tujuan.
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

        // Jelaskan letak kesalahan dan konsep di balik jawaban yang benar.
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

        // Ubah data audio yang dikirim client menjadi teks.
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
