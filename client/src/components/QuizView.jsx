import React, { useState, useEffect, useRef } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GENERATE_QUIZ, GENERATE_CHALLENGE } from '../graphql/queries';
import { EXPLAIN_ANSWER_MUTATION } from '../graphql/mutations';
import HumanFormattedText from './HumanFormattedText';
import { LETTERS, cleanOptionText, isOptionCorrect } from '../utils/quizUtils';
import { speakText } from '../utils/speechUtils';
import TeksieCodingCard from './TeksieCodingCard';
import { getTopicIcon } from './TechLogos';

export { LETTERS, cleanOptionText, isOptionCorrect };

export const LANGUAGE_UNITS = [
  {
    unit: 1,
    level: 'Pemula',
    titleId: 'Bab 1: Fondasi & Kosakata Esensial',
    titleEn: 'Unit 1: Foundations & Essential Vocab',
    descId: 'Salam perkenalan, kata ganti, angka, dan kosakata benda penting sehari-hari.',
    descEn: 'Greetings, introductions, pronouns, numbers, and core daily nouns.'
  },
  {
    unit: 2,
    level: 'Pemula',
    titleId: 'Bab 2: Struktur Kalimat & Tata Bahasa Inti',
    titleEn: 'Unit 2: Sentence Structure & Core Grammar',
    descId: 'Pola kalimat dasar, konjugasi waktu (tenses), preposisi, dan kalimat tanya.',
    descEn: 'Basic syntax, verb tenses, prepositions, and question formulation.'
  },
  {
    unit: 3,
    level: 'Menengah',
    titleId: 'Bab 3: Situasi Nyata & Percakapan Tematik',
    titleEn: 'Unit 3: Real Situations & Everyday Dialogue',
    descId: 'Percakapan di kafe, belanja, transportasi harian, dan interaksi sosial.',
    descEn: 'Conversations at restaurants, shopping, commute, and daily interactions.'
  },
  {
    unit: 4,
    level: 'Menengah',
    titleId: 'Bab 4: Idiom, Slang & Nuansa Budaya',
    titleEn: 'Unit 4: Idioms, Slang & Cultural Nuance',
    descId: 'Ungkapan kiasan, bahasa gaul santai, dan ekspresi lokal alami.',
    descEn: 'Idiomatic expressions, casual slang, and natural colloquial phrases.'
  },
  {
    unit: 5,
    level: 'Mahir',
    titleId: 'Bab 5: Penguasaan Mahir & Analisis Teks',
    titleEn: 'Unit 5: Advanced Mastery & Complex Nuance',
    descId: 'Nuansa makna halus, pemahaman teks formal, dan argumen berbobot.',
    descEn: 'Subtle word nuances, formal comprehension, and advanced fluency.'
  }
];

export const CODING_UNITS = [
  {
    unit: 1,
    level: 'Pemula',
    titleId: 'Bab 1: Sintaksis, Variabel & Tipe Data',
    titleEn: 'Unit 1: Syntax, Variables & Data Types',
    descId: 'Deklarasi variabel, tipe data primitif, operator aritmatika & logika.',
    descEn: 'Variable declarations, primitive types, arithmetic & logical operators.'
  },
  {
    unit: 2,
    level: 'Pemula',
    titleId: 'Bab 2: Kontrol Alur & Logika Perulangan',
    titleEn: 'Unit 2: Control Flow & Looping Logic',
    descId: 'Percabangan if/else, perulangan for/while, switch case, break/continue.',
    descEn: 'Branching if/else, loops for/while, switch cases, break/continue.'
  },
  {
    unit: 3,
    level: 'Menengah',
    titleId: 'Bab 3: Fungsi, Koleksi Data & Modularitas',
    titleEn: 'Unit 3: Functions, Collections & Modularity',
    descId: 'Parameter & return, array methods (map, filter), objek/dictionary data.',
    descEn: 'Parameters & returns, array methods (map, filter), dictionaries/objects.'
  },
  {
    unit: 4,
    level: 'Menengah',
    titleId: 'Bab 4: Logika Algoritma & Debugging Nyata',
    titleEn: 'Unit 4: Algorithm Logic & Code Debugging',
    descId: 'Pelacakan output kode, manipulasi data kompleks, penanganan bug nyata.',
    descEn: 'Code output tracing, complex data handling, real-world bug fixing.'
  },
  {
    unit: 5,
    level: 'Mahir',
    titleId: 'Bab 5: Arsitektur, Best Practice & Optimasi',
    titleEn: 'Unit 5: Architecture, Patterns & Optimization',
    descId: 'Kompleksitas algoritma, asynchronous workflow, clean code & performa tinggi.',
    descEn: 'Time complexity, asynchronous patterns, clean code & performance.'
  }
];

const LEARN_CATEGORIES_ID = [
  { name: 'Populer (Indo & Inggris)', items: ['Indonesia (Baku)', 'Indonesia (Gaul)', 'Inggris (Grammar)', 'Inggris (Slang)'] },
  { name: 'Bahasa Nusantara', items: ['Jawa', 'Sunda', 'Minang', 'Bali'] },
  { name: 'Timur Tengah & Afrika', items: ['Arab', "Al-Qur'an", 'Ibrani', 'Turki', 'Persia'] },
  { name: 'Asia & Pasifik', items: ['Jepang', 'Korea', 'Mandarin', 'Hindi', 'Thai'] },
  { name: 'Benua Eropa', items: ['Spanyol', 'Prancis', 'Jerman', 'Rusia', 'Italia', 'Belanda'] }
];

const LEARN_CATEGORIES_EN = [
  { name: 'Popular (Indonesian & English)', items: ['Indonesian (Formal)', 'Indonesian (Slang)', 'English (Grammar)', 'English (Slang)'] },
  { name: 'Indonesian Regional Languages', items: ['Javanese', 'Sundanese', 'Minangkabau', 'Balinese'] },
  { name: 'Middle East & Africa', items: ['Arabic', "Quranic Arabic", 'Hebrew', 'Turkish', 'Persian'] },
  { name: 'Asia & Pacific', items: ['Japanese', 'Korean', 'Mandarin', 'Hindi', 'Thai'] },
  { name: 'Europe', items: ['Spanish', 'French', 'German', 'Russian', 'Italian', 'Dutch'] }
];

const CODING_CATEGORIES_ID = [
  { name: 'Situs & Naskah', items: ['HTML & CSS', 'JavaScript / TypeScript', 'Python', 'PHP', 'Ruby'] },
  { name: 'Aplikasi & Framework', items: ['React', 'Node.js', 'Flutter', 'Go (Golang)', 'Java', 'C / C++', 'SQL Database'] },
  { name: 'Sistem & Perangkat Lunak', items: ['Rust', 'C#', 'Struktur Data (Array, Tree)', 'Machine Learning'] },
  { name: 'Teori & Algoritma', items: ['Algoritma Sorting', 'Kriptografi & Keamanan', 'Design Patterns (OOP)', 'API & GraphQL'] }
];

const CODING_CATEGORIES_EN = [
  { name: 'Web & Scripting', items: ['HTML & CSS', 'JavaScript / TypeScript', 'Python', 'PHP', 'Ruby'] },
  { name: 'Apps & Frameworks', items: ['React', 'Node.js', 'Flutter', 'Go (Golang)', 'Java', 'C / C++', 'SQL Database'] },
  { name: 'Systems & Software', items: ['Rust', 'C#', 'Data Structures (Array, Tree)', 'Machine Learning'] },
  { name: 'Theory & Algorithms', items: ['Sorting Algorithms', 'Cryptography & Security', 'Design Patterns (OOP)', 'API & GraphQL'] }
];

// Baca progres topik dari penyimpanan akun atau sesi tamu.
function getProgressStorageKey(progressScope) {
  return `pahamteks_topic_progress_${progressScope || 'anonymous'}`;
}

function getSavedProgress(topic, progressScope, isGuest) {
  try {
    const storage = isGuest ? sessionStorage : localStorage;
    const raw = storage.getItem(getProgressStorageKey(progressScope));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed[topic]) return parsed[topic];
    }
  } catch (err) {
    console.warn('[QuizProgress] Failed to read saved progress:', err.message);
  }
  return { currentUnit: 1, completedUnits: [] };
}

// Simpan bab yang selesai dan bab berikutnya ke penyimpanan browser.
function saveProgress(topic, unitDone, nextUnit, progressScope, isGuest) {
  try {
    const storage = isGuest ? sessionStorage : localStorage;
    const storageKey = getProgressStorageKey(progressScope);
    const raw = storage.getItem(storageKey) || '{}';
    const parsed = JSON.parse(raw);
    const currentData = parsed[topic] || { currentUnit: 1, completedUnits: [] };

    const completed = new Set(currentData.completedUnits || []);
    if (unitDone) completed.add(unitDone);

    parsed[topic] = {
      currentUnit: nextUnit || currentData.currentUnit || 1,
      completedUnits: Array.from(completed)
    };

    storage.setItem(storageKey, JSON.stringify(parsed));
  } catch (err) {
    console.warn('[QuizProgress] Failed to save progress:', err.message);
  }
}

export default function QuizView({ mode = 'learn', t, currentLang, onFinishQuiz, progressScope, isGuest = false }) {
  const defaultTopic = mode === 'learn'
    ? (currentLang === 'en' ? 'English (Grammar)' : 'Inggris (Grammar)')
    : 'JavaScript / TypeScript';

  const [selectedTopic, setSelectedTopic] = useState(defaultTopic);
  const [level, setLevel] = useState('Pemula');
  const [questionCount, setQuestionCount] = useState(5);
  const [openGroup, setOpenGroup] = useState(0);

  // Progres Bab Pembelajaran
  const [currentUnit, setCurrentUnit] = useState(1);
  const [completedUnits, setCompletedUnits] = useState([]);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [userAnswersLog, setUserAnswersLog] = useState([]);
  const [explanation, setExplanation] = useState('');
  const [explaining, setExplaining] = useState(false);
  const [loadError, setLoadError] = useState('');

  const [fetchQuiz, { loading: quizLoading }] = useLazyQuery(GENERATE_QUIZ, { fetchPolicy: 'network-only' });
  const [fetchChallenge, { loading: challengeLoading }] = useLazyQuery(GENERATE_CHALLENGE, { fetchPolicy: 'network-only' });
  const [explainMutation] = useMutation(EXPLAIN_ANSWER_MUTATION);

  const learnCategories = currentLang === 'en' ? LEARN_CATEGORIES_EN : LEARN_CATEGORIES_ID;
  const codingCategories = currentLang === 'en' ? CODING_CATEGORIES_EN : CODING_CATEGORIES_ID;
  const categoriesData = mode === 'learn' ? learnCategories : codingCategories;
  const unitsList = mode === 'learn' ? LANGUAGE_UNITS : CODING_UNITS;

  // Sinkronisasi progres saat topik berganti
  useEffect(() => {
    const saved = getSavedProgress(selectedTopic, progressScope, isGuest);
    setCurrentUnit(saved.currentUnit || 1);
    setCompletedUnits(saved.completedUnits || []);
  }, [selectedTopic, progressScope, isGuest]);

  // Reset state saat mode atau bahasa berganti
  useEffect(() => {
    setQuestions([]);
    setIsFinished(false);
    setSelectedAnswerIndex(null);
    const newDefault = mode === 'learn'
      ? (currentLang === 'en' ? 'English (Grammar)' : 'Inggris (Grammar)')
      : 'JavaScript / TypeScript';
    setSelectedTopic(newDefault);
  }, [mode, currentLang]);

  const activeUnitObj = unitsList.find(u => u.unit === currentUnit) || unitsList[0];

  // Muat soal tantangan atau kuis reguler untuk bab yang dipilih.
  const handleStart = async ({ isChallengeMode = false, unitToLoad = currentUnit, forceRefresh = false } = {}) => {
    setCurrentIndex(0);
    setSelectedAnswerIndex(null);
    setScore(0);
    setIsFinished(false);
    setUserAnswersLog([]);
    setExplanation('');

    setLoadError('');
    const targetUnitObj = unitsList.find(u => u.unit === unitToLoad) || activeUnitObj;
    setCurrentUnit(targetUnitObj.unit);

    try {
      if (isChallengeMode) {
        const res = await fetchChallenge({ variables: { category: selectedTopic, lang: currentLang } });
        if (res.data?.generateChallenge) setQuestions(res.data.generateChallenge);
      } else {
        const res = await fetchQuiz({
          variables: {
            categories: [selectedTopic],
            level: targetUnitObj.level || level,
            lang: currentLang,
            unit: targetUnitObj.unit,
            topicDetail: currentLang === 'en' ? targetUnitObj.titleEn : targetUnitObj.titleId,
            refresh: forceRefresh,
            count: questionCount
          }
        });
        if (res.data?.generateQuiz) setQuestions(res.data.generateQuiz);
      }
    } catch (err) {
      console.warn('[QuizView] Gagal memuat soal:', err.message);
      setLoadError(currentLang === 'en' ? ('Failed to load questions: ' + err.message) : ('Gagal memuat soal: ' + err.message));
    }
  };

  // Lanjut ke bab berikutnya dan minta set soal baru.
  const handleContinueNextUnit = () => {
    const nextUnitNum = currentUnit < 5 ? currentUnit + 1 : 1;
    handleStart({ unitToLoad: nextUnitNum, forceRefresh: true });
  };

  const currentQ = questions[currentIndex];

  // Catat pilihan sekali dan perbarui skor serta ringkasan jawaban.
  const handleSelectAnswer = (opt, index) => {
    if (selectedAnswerIndex !== null) return;
    setSelectedAnswerIndex(index);

    const isCorrect = isOptionCorrect(opt, index, currentQ);
    if (isCorrect) setScore(prev => prev + 1);

    const userChoiceStr = `${LETTERS[index] || ''}. ${cleanOptionText(opt)}`;
    const correctIdx = currentQ.options.findIndex((o, idx) => isOptionCorrect(o, idx, currentQ));
    const correctChoiceStr = correctIdx !== -1
      ? `${LETTERS[correctIdx]}. ${cleanOptionText(currentQ.options[correctIdx])}`
      : currentQ.answer;

    setUserAnswersLog(prev => [
      ...prev,
      {
        question: currentQ.question,
        userAnswer: userChoiceStr,
        correctAnswer: correctChoiceStr,
        isCorrect
      }
    ]);
  };

  // Pindah soal, atau simpan progres saat kuis selesai.
  const handleNext = () => {
    setSelectedAnswerIndex(null);
    setExplanation('');
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
      // Simpan progres kelulusan bab
      const nextU = currentUnit < 5 ? currentUnit + 1 : currentUnit;
      saveProgress(selectedTopic, currentUnit, nextU, progressScope, isGuest);
      setCompletedUnits(prev => Array.from(new Set([...prev, currentUnit])));

      if (onFinishQuiz) {
        onFinishQuiz({
          topic: selectedTopic,
          unit: currentUnit,
          unitTitle: currentLang === 'en' ? activeUnitObj.titleEn : activeUnitObj.titleId,
          answers: userAnswersLog,
          score,
          total: questions.length,
          level,
          date: new Date().toLocaleDateString()
        });
      }
    }
  };

  // Minta AI menjelaskan perbedaan jawaban pengguna dan kunci jawaban.
  const handleAskWhyWrong = async () => {
    if (!currentQ || selectedAnswerIndex === null) return;
    setExplaining(true);
    try {
      const chosenOpt = currentQ.options[selectedAnswerIndex];
      const userChoiceStr = `${LETTERS[selectedAnswerIndex] || ''}. ${cleanOptionText(chosenOpt)}`;
      const correctIdx = currentQ.options.findIndex((o, idx) => isOptionCorrect(o, idx, currentQ));
      const correctChoiceStr = correctIdx !== -1
        ? `${LETTERS[correctIdx]}. ${cleanOptionText(currentQ.options[correctIdx])}`
        : currentQ.answer;

      const res = await explainMutation({
        variables: {
          question: currentQ.question,
          userAnswer: userChoiceStr,
          correctAnswer: correctChoiceStr,
          category: selectedTopic,
          lang: currentLang
        }
      });
      if (res.data?.explainAnswer?.explanation) {
        setExplanation(res.data.explainAnswer.explanation);
      } else if (res.data?.explainAnswer?.error) {
        setExplanation(res.data.explainAnswer.error);
      }
    } catch (err) {
      setExplanation((currentLang === 'en' ? 'Failed: ' : 'Gagal: ') + err.message);
    } finally {
      setExplaining(false);
    }
  };

  const nextUnitObj = unitsList.find(u => u.unit === currentUnit + 1);

  const POPULAR_ITEMS = new Set([
    'HTML & CSS',
    'JavaScript / TypeScript',
    'Python',
    'React',
    'Inggris (Grammar)',
    'Indonesia (Baku)',
    'Jepang'
  ]);

  return (
    <div className="page" style={{ width: '100%', maxWidth: '1150px' }}>
      {/* 1. SETUP VIEW (TAMPILAN 2-KOLOM SESUAI MOCK-UP) */}
      {questions.length === 0 && (
        <div className="coding-selection-layout">
          {/* Sisi kiri menampilkan Teksie dan tips belajar. */}
          <TeksieCodingCard
            greetingTitle={currentLang === 'en' ? 'Hello!' : 'Halo!'}
            greetingSubtitle={currentLang === 'en' ? "I'm Teksie" : 'Aku Teksie'}
            greetingDesc={mode === 'coding'
              ? (currentLang === 'en'
                  ? 'Ready to accompany you to practice and boost your coding skills!'
                  : 'Siap menemani kamu berlatih dan meningkatkan kemampuan coding!')
              : (currentLang === 'en'
                  ? 'Ready to accompany you to practice and master world languages!'
                  : 'Siap menemani kamu berlatih dan menguasai berbagai bahasa dunia!')}
            tipsTitle={currentLang === 'en' ? "Today's Tip" : 'Tips Hari Ini'}
            tipsDesc={mode === 'coding'
              ? (currentLang === 'en'
                  ? 'Start from the language you like best, then explore others.'
                  : 'Mulai dari bahasa yang kamu sukai, lalu jelajahi lainnya.')
              : (currentLang === 'en'
                  ? 'Practice consistently every day to build intuitive fluency.'
                  : 'Latihan konsisten setiap hari untuk membangun kefasihan alami.')}
          />

          {/* SISI KANAN: KARTU UTAMA PEMILIHAN BAHASA & ACCORDION */}
          <main className="coding-main-card">
            {/* Header Kartu Utama */}
            <div className="coding-main-header">
              <div className="coding-main-header-text">
                <h2>{mode === 'learn' ? t('setup_lang_title') : t('setup_code_title')}</h2>
                <p>{mode === 'learn' ? t('setup_lang_desc') : t('setup_code_desc')}</p>
              </div>
            </div>

            {/* Accordion Daftar Bahasa / Topik */}
            <div className="coding-accordion-container">
              {categoriesData.map((cat, idx) => {
                const isExpanded = openGroup === idx;
                return (
                  <div key={idx} className={`coding-accordion-group ${isExpanded ? 'expanded' : ''}`}>
                    {/* Header Accordion */}
                    <div
                      className="coding-accordion-header"
                      role="button"
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      onClick={() => setOpenGroup(isExpanded ? -1 : idx)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setOpenGroup(isExpanded ? -1 : idx);
                        }
                      }}
                    >
                      <div className="coding-accordion-title">
                        <span>{cat.name}</span>
                      </div>
                    </div>

                    {/* Isi Accordion (List Bahasa) */}
                    {isExpanded && (
                      <div className="coding-accordion-body">
                        {cat.items.map((item, iIdx) => {
                          const isSelected = selectedTopic === item;
                          const isPopular = POPULAR_ITEMS.has(item);

                          return (
                            <div
                              key={iIdx}
                              className={`coding-lang-item ${isSelected ? 'active' : ''}`}
                              onClick={() => setSelectedTopic(item)}
                            >
                              {/* Custom Radio Button */}
                              <div className="coding-radio-circle">
                                {isSelected && <div className="coding-radio-dot" />}
                              </div>

                              <div className="coding-lang-icon-wrap" aria-hidden="true">
                                {getTopicIcon(item, 28)}
                              </div>

                              {/* Nama Bahasa */}
                              <span className="coding-lang-name">{item}</span>

                              {/* Badge Populer */}
                              {isPopular && (
                                <span className="coding-popular-badge">
                                  {currentLang === 'en' ? 'Popular' : 'Populer'}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Unit / Chapter Roadmap (Alur Bab Pembelajaran) */}
            <div className="unit-roadmap-section" style={{ marginTop: '10px' }}>
              <div className="unit-roadmap-header">
                <h4>
                  <span>{t('roadmap_title')}</span>
                  <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 800, marginLeft: 'auto' }}>
                    {selectedTopic}
                  </span>
                </h4>
                <p>{t('roadmap_subtitle')}</p>
              </div>

              <div className="unit-roadmap-grid">
                {unitsList.map((u) => {
                  const isCurrent = currentUnit === u.unit;
                  const isDone = completedUnits.includes(u.unit);

                  let cardClass = 'unit-card';
                  if (isCurrent) cardClass += ' active';
                  if (isDone) cardClass += ' completed';

                  return (
                    <div
                      key={u.unit}
                      className={cardClass}
                      onClick={() => {
                        setCurrentUnit(u.unit);
                        setLevel(u.level);
                      }}
                    >
                      <div>
                        <div className="unit-card-header">
                          <span className="unit-level-label">{u.level}</span>
                          {(isDone || isCurrent) && (
                            <span className={`unit-pill-badge ${isDone ? 'completed' : 'active'}`}>
                              {isDone ? t('unit_badge_completed') : t('unit_badge_current')}
                            </span>
                          )}
                        </div>
                        <h5 className="unit-card-title">
                          {currentLang === 'en' ? u.titleEn : u.titleId}
                        </h5>
                      </div>
                      <p className="unit-card-desc">
                        {currentLang === 'en' ? u.descEn : u.descId}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tingkat Kesulitan */}
            <div className={`quiz-settings-grid ${mode === 'learn' ? '' : 'single-setting'}`}>
              <div className="input-group quiz-setting-card">
                <label className="quiz-setting-label" htmlFor="quiz-level">
                  {mode === 'learn' ? t('setup_level') : t('setup_code_level')} (Rekomendasi Bab: {activeUnitObj.level})
                </label>
                <select
                  id="quiz-level"
                  className="styled-select"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  <option value="Pemula">{t('opt_level_1')}</option>
                  <option value="Menengah">{t('opt_level_2')}</option>
                  <option value="Mahir">{t('opt_level_3')}</option>
                </select>
              </div>

              {mode === 'learn' && (
                <div className="input-group quiz-setting-card">
                  <label className="quiz-setting-label" htmlFor="quiz-question-count">
                    {currentLang === 'en' ? 'Number of questions' : 'Jumlah pertanyaan'}
                  </label>
                  <select
                    id="quiz-question-count"
                    className="styled-select"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                  >
                    {[5, 10, 15, 20].map((count) => (
                      <option key={count} value={count}>
                        {currentLang === 'en' ? `${count} questions` : `${count} pertanyaan`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Error Banner */}
            {loadError && (
              <div style={{
                padding: '12px 16px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '12px',
                color: '#fca5a5',
                fontSize: '0.92rem',
                textAlign: 'center',
                fontWeight: 600
              }}>
                {loadError}
              </div>
            )}

            {/* Tombol Aksi Mulai */}
            <div className="coding-start-action-row">
              <button
                className="btn-huge btn-cyan"
                style={{ minWidth: '180px' }}
                onClick={() => handleStart({ isChallengeMode: true })}
                disabled={quizLoading || challengeLoading}
              >
                {challengeLoading
                  ? (currentLang === 'en' ? 'Preparing Challenge...' : 'Menyiapkan...')
                  : t('btn_challenge')}
              </button>

              <button
                className="btn-huge btn-green"
                style={{ flex: 1, minWidth: '220px' }}
                onClick={() => handleStart({ unitToLoad: currentUnit, forceRefresh: false })}
                disabled={quizLoading || challengeLoading}
              >
                {quizLoading
                  ? (currentLang === 'en' ? 'Preparing Questions...' : 'Menyiapkan Soal...')
                  : `${currentLang === 'en' ? 'START' : 'MULAI'} ${selectedTopic} (Bab ${currentUnit})`}
              </button>
            </div>
          </main>
        </div>
      )}

      {/* 2. ACTIVE QUIZ CARD */}
      {questions.length > 0 && !isFinished && currentQ && (
        <div className="quiz-container">
          <div className="quiz-card">
            {/* Header with Unit Info & Score */}
            <div className="quiz-header-badge-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span className="unit-indicator-pill">
                  {currentLang === 'en' ? `Chapter ${currentUnit}` : `Bab ${currentUnit}`}: {currentLang === 'en' ? activeUnitObj.titleEn : activeUnitObj.titleId}
                </span>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                  {selectedTopic} ({currentIndex + 1}/{questions.length})
                </span>
              </div>
              <span style={{ color: 'var(--btn-green)', fontWeight: 800, fontSize: '1rem' }}>
                {currentLang === 'en' ? 'Score' : 'Skor'}: {score}
              </span>
            </div>

            {/* Timer / Progress Bar */}
            <div className="timer-bar-container">
              <div className="timer-bar" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
            </div>

            {/* Question Text */}
            <h3 style={{ fontSize: '1.25rem', margin: '20px 0 25px 0', lineHeight: 1.5 }}>
              {currentQ.instruction && (
                <div style={{ color: 'var(--btn-cyan)', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 800 }}>
                  [{currentQ.instruction}]
                </div>
              )}
              {currentQ.question}
            </h3>

            {/* Multiple Choice Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentQ.options.map((opt, i) => {
                const letter = LETTERS[i] || String.fromCharCode(65 + i);
                const text = cleanOptionText(opt);
                let btnClass = 'mc-btn';

                if (selectedAnswerIndex !== null) {
                  const isThisCorrect = isOptionCorrect(opt, i, currentQ);
                  const isChosen = selectedAnswerIndex === i;
                  if (isThisCorrect) {
                    btnClass = 'mc-btn correct';
                  } else if (isChosen) {
                    btnClass = 'mc-btn wrong';
                  }
                }

                return (
                  <button
                    key={i}
                    className={btnClass}
                    onClick={() => handleSelectAnswer(opt, i)}
                    disabled={selectedAnswerIndex !== null}
                  >
                    <strong style={{ color: 'var(--btn-cyan)', marginRight: '6px' }}>{letter}.</strong> {text}
                  </button>
                );
              })}
            </div>

            {/* "Kenapa Salah? Ini Penjelasannya" Button */}
            {selectedAnswerIndex !== null && !isOptionCorrect(currentQ.options[selectedAnswerIndex], selectedAnswerIndex, currentQ) && (
              <div>
                <button
                  className="btn-why-wrong"
                  onClick={handleAskWhyWrong}
                  disabled={explaining}
                >
                  {explaining ? (currentLang === 'en' ? 'Preparing explanation...' : 'Menyiapkan penjelasan...') : t('btn_why_wrong')}
                </button>

                {explanation && (
                  <div className="quiz-explanation-box">
                    <div className="explanation-header">
                      <div className="explanation-title">
                        {t('explanation_title')}
                      </div>
                      <button
                        className="btn-speak"
                        style={{ width: '32px', height: '32px', position: 'static' }}
                        onClick={() => speakText(explanation, currentLang)}
                        title={currentLang === 'en' ? 'Listen to Explanation' : 'Dengarkan Penjelasan'}
                      >
                        {currentLang === 'en' ? 'Listen' : 'Dengarkan'}
                      </button>
                    </div>
                    <div className="explanation-content">
                      <HumanFormattedText content={explanation} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Next Question Button */}
            {selectedAnswerIndex !== null && (
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn-huge btn-cyan" onClick={handleNext}>
                  {currentIndex + 1 < questions.length ? t('btn_ans_next') : t('result_title')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. RESULT VIEW - CONTINUOUS LEARNING HUB */}
      {isFinished && (
        <div className="quiz-container">
          <div className="result-box">
            <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>
              {currentLang === 'en' ? 'Chapter Complete!' : 'Bab Selesai!'}
            </h2>
            <p style={{ color: 'var(--btn-cyan)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '18px' }}>
              {currentLang === 'en' ? activeUnitObj.titleEn : activeUnitObj.titleId} {selectedTopic}
            </p>

            <div className="score-circle">
              {Math.round((score / questions.length) * 100)}%
            </div>

            <p style={{ fontSize: '1.2rem', marginBottom: '10px', fontWeight: 700 }}>
              {currentLang === 'en' ? 'Correct ' : 'Benar '}
              <span style={{ color: 'var(--btn-green)' }}>{score}</span>
              {currentLang === 'en' ? ` out of ${questions.length} Questions` : ` dari ${questions.length} Soal`}
            </p>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto 25px' }}>
              {score >= Math.ceil(questions.length * 0.8)
                ? (currentLang === 'en' ? 'Outstanding! You have mastered this chapter.' : 'Luar biasa! Pemahamanmu pada bab ini sangat mantap.')
                : score >= Math.ceil(questions.length * 0.5)
                  ? (currentLang === 'en' ? 'Good job! You are ready to advance to the next chapter.' : 'Bagus sekali! Kamu sudah siap melangkah ke bab berikutnya.')
                  : (currentLang === 'en' ? 'Great effort! Try fresh practice questions to sharpen your foundation.' : 'Usaha yang bagus! Coba latih soal baru lagi untuk memperkuat pemahamanmu.')}
            </p>

            {/* Continuous Learning Progression Action Stack */}
            <div className="result-actions-stack">
              {/* 1. Primary Action: Continue to Next Chapter */}
              {nextUnitObj ? (
                <button
                  className="btn-continue-unit-hero"
                  onClick={handleContinueNextUnit}
                  disabled={quizLoading}
                >
                  <span>
                    {quizLoading
                      ? (currentLang === 'en' ? 'Preparing Next Chapter...' : 'Menyiapkan Bab Selanjutnya...')
                      : `${t('btn_continue_unit')} ${nextUnitObj.unit}: ${currentLang === 'en' ? nextUnitObj.titleEn : nextUnitObj.titleId}`}
                  </span>
                </button>
              ) : (
                <button
                  className="btn-continue-unit-hero"
                  onClick={() => handleStart({ unitToLoad: 1, forceRefresh: true })}
                  disabled={quizLoading}
                >
                  <span>
                    {quizLoading
                      ? (currentLang === 'en' ? 'Preparing Review...' : 'Menyiapkan Ulasan...')
                      : (currentLang === 'en' ? 'Review Full Track (Fresh Questions)' : 'Ulas Seluruh Bab (Variasi Soal Baru)')}
                  </span>
                </button>
              )}

              {/* 2. Secondary Action: Practice Fresh AI Questions on Current Chapter (Anti-Repetisi) */}
              <button
                className="btn-fresh-practice"
                onClick={() => handleStart({ unitToLoad: currentUnit, forceRefresh: true })}
                disabled={quizLoading}
              >
                <span>
                  {quizLoading
                    ? (currentLang === 'en' ? 'Generating Fresh Set...' : 'Membuat Soal Baru...')
                    : t('btn_fresh_questions')}
                </span>
              </button>

              {/* 3. Tertiary Action: Return to Roadmap / Change Topic */}
              <button
                className="btn-return-roadmap"
                onClick={() => setQuestions([])}
              >
                <span>{t('btn_choose_chapter')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
