import React, { useState, useEffect, useRef } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GENERATE_QUIZ, GENERATE_CHALLENGE } from '../graphql/queries';
import { EXPLAIN_ANSWER_MUTATION } from '../graphql/mutations';

const LEARN_CATEGORIES = [
  { name: 'Populer (Indo & Inggris)', items: ['Indonesia (Baku)', 'Indonesia (Gaul)', 'Inggris (Grammar)', 'Inggris (Slang)'] },
  { name: 'Bahasa Nusantara', items: ['Jawa', 'Sunda', 'Minang', 'Bali'] },
  { name: 'Timur Tengah & Afrika', items: ['Arab', "Al-Qur'an", 'Ibrani', 'Turki', 'Persia'] },
  { name: 'Asia & Pasifik', items: ['Jepang', 'Korea', 'Mandarin', 'Hindi', 'Thai'] },
  { name: 'Benua Eropa', items: ['Spanyol', 'Prancis', 'Jerman', 'Rusia', 'Italia', 'Belanda'] }
];

const CODING_CATEGORIES = [
  { name: 'Situs & Naskah', items: ['HTML & CSS', 'JavaScript / TypeScript', 'Python', 'PHP', 'Ruby'] },
  { name: 'Sistem & Perangkat Lunak', items: ['C / C++', 'Rust', 'Go (Golang)', 'Java', 'C#'] },
  { name: 'Data & Basis Data', items: ['SQL Database', 'NoSQL MongoDB', 'Struktur Data (Array, Tree)', 'Machine Learning'] },
  { name: 'Teori & Algoritma', items: ['Algoritma Sorting', 'Kriptografi & Keamanan', 'Design Patterns (OOP)', 'API & GraphQL'] }
];

export default function QuizView({ mode = 'learn', t, currentLang, onFinishQuiz }) {
  const [level, setLevel] = useState('Pemula');
  const [selectedTopic, setSelectedTopic] = useState(mode === 'learn' ? 'Inggris (Grammar)' : 'JavaScript / TypeScript');
  const [openGroup, setOpenGroup] = useState(0);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [userAnswersLog, setUserAnswersLog] = useState([]);
  const [explanation, setExplanation] = useState('');
  const [explaining, setExplaining] = useState(false);
  const [timerPercent, setTimerPercent] = useState(100);

  const timerRef = useRef(null);

  const [fetchQuiz, { loading: quizLoading }] = useLazyQuery(GENERATE_QUIZ, { fetchPolicy: 'network-only' });
  const [fetchChallenge, { loading: challengeLoading }] = useLazyQuery(GENERATE_CHALLENGE, { fetchPolicy: 'network-only' });
  const [explainMutation] = useMutation(EXPLAIN_ANSWER_MUTATION);

  const categoriesData = mode === 'learn' ? LEARN_CATEGORIES : CODING_CATEGORIES;

  // Reset state saat mode berganti
  useEffect(() => {
    setQuestions([]);
    setIsFinished(false);
    setSelectedTopic(mode === 'learn' ? 'Inggris (Grammar)' : 'JavaScript / TypeScript');
  }, [mode]);

  const handleStart = async (isChallengeMode = false) => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);
    setUserAnswersLog([]);
    setExplanation('');

    try {
      if (isChallengeMode) {
        const res = await fetchChallenge({ variables: { category: selectedTopic } });
        if (res.data?.generateChallenge) setQuestions(res.data.generateChallenge);
      } else {
        const res = await fetchQuiz({ variables: { categories: [selectedTopic], level } });
        if (res.data?.generateQuiz) setQuestions(res.data.generateQuiz);
      }
    } catch (err) {
      alert('Gagal memuat soal: ' + err.message);
    }
  };

  const currentQ = questions[currentIndex];

  const handleSelectAnswer = (opt) => {
    if (selectedAnswer !== null) return;
    const letter = opt.charAt(0);
    setSelectedAnswer(letter);

    const isCorrect = letter.toUpperCase() === currentQ.answer.toUpperCase();
    if (isCorrect) setScore(prev => prev + 1);

    setUserAnswersLog(prev => [
      ...prev,
      {
        question: currentQ.question,
        userAnswer: opt,
        correctAnswer: currentQ.answer,
        isCorrect
      }
    ]);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setExplanation('');
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
      if (onFinishQuiz) {
        onFinishQuiz({
          topic: selectedTopic,
          score,
          total: questions.length,
          date: new Date().toLocaleDateString()
        });
      }
    }
  };

  const handleAskWhyWrong = async () => {
    if (!currentQ || selectedAnswer === null) return;
    setExplaining(true);
    try {
      const res = await explainMutation({
        variables: {
          question: currentQ.question,
          userAnswer: selectedAnswer,
          correctAnswer: currentQ.answer,
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
      setExplanation('⚠️ Gagal: ' + err.message);
    } finally {
      setExplaining(false);
    }
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLang === 'id' ? 'id-ID' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="page" style={{ width: '100%', maxWidth: '850px' }}>
      {/* 1. SETUP VIEW */}
      {questions.length === 0 && (
        <div className="setup-container">
          {/* Level Selector */}
          <div className="input-group">
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.15rem' }}>
              {mode === 'learn' ? t('setup_level') : t('setup_code_level')}
            </h3>
            <select
              className="styled-select"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="Pemula">{t('opt_level_1')}</option>
              <option value="Menengah">{t('opt_level_2')}</option>
              <option value="Mahir">{t('opt_level_3')}</option>
            </select>
          </div>

          {/* Topic / Category Selector */}
          <div className="input-group">
            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.15rem' }}>
              {mode === 'learn' ? t('setup_lang_title') : t('setup_code_title')}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '15px' }}>
              {mode === 'learn' ? t('setup_lang_desc') : t('setup_code_desc')}
            </p>

            {categoriesData.map((cat, idx) => (
              <div key={idx}>
                <div
                  className="lang-option"
                  onClick={() => setOpenGroup(openGroup === idx ? -1 : idx)}
                >
                  <span>🌐 {cat.name}</span>
                  <span>{openGroup === idx ? '▲' : '▼'}</span>
                </div>

                {openGroup === idx && (
                  <div className="sub-menu">
                    {cat.items.map((item, iIdx) => (
                      <label key={iIdx} className="sub-option">
                        <input
                          type="radio"
                          name="quiz_topic"
                          checked={selectedTopic === item}
                          onChange={() => setSelectedTopic(item)}
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Start Buttons */}
          <div className="action-row">
            <button
              className="btn-huge btn-green"
              onClick={() => handleStart(false)}
              disabled={quizLoading || challengeLoading}
            >
              {quizLoading ? 'Menyiapkan...' : (mode === 'learn' ? t('btn_start_learn') : t('btn_start_code'))}
            </button>
            <button
              className="btn-huge btn-cyan"
              onClick={() => handleStart(true)}
              disabled={quizLoading || challengeLoading}
            >
              {challengeLoading ? 'Menyiapkan...' : t('btn_challenge')}
            </button>
          </div>
        </div>
      )}

      {/* 2. ACTIVE QUIZ CARD */}
      {questions.length > 0 && !isFinished && currentQ && (
        <div className="quiz-container">
          <div className="quiz-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                {t('quiz_header')} • {selectedTopic} ({currentIndex + 1}/{questions.length})
              </span>
              <span style={{ color: 'var(--btn-green)', fontWeight: 800 }}>
                Skor: {score}
              </span>
            </div>

            {/* Timer Bar */}
            <div className="timer-bar-container">
              <div className="timer-bar" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
            </div>

            {/* Question Text */}
            <h3 style={{ fontSize: '1.3rem', margin: '20px 0 25px 0', lineHeight: 1.5 }}>
              {currentQ.instruction && (
                <div style={{ color: 'var(--btn-cyan)', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 800 }}>
                  [{currentQ.instruction}]
                </div>
              )}
              {currentQ.question}
            </h3>

            {/* Multiple Choice Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentQ.options.map((opt, i) => {
                const letter = opt.charAt(0);
                let btnClass = 'mc-btn';

                if (selectedAnswer !== null) {
                  const isCorrect = letter.toUpperCase() === currentQ.answer.toUpperCase();
                  const isChosen = letter.toUpperCase() === selectedAnswer.toUpperCase();
                  if (isCorrect) {
                    btnClass = 'mc-btn correct';
                  } else if (isChosen) {
                    btnClass = 'mc-btn wrong';
                  }
                }

                return (
                  <button
                    key={i}
                    className={btnClass}
                    onClick={() => handleSelectAnswer(opt)}
                    disabled={selectedAnswer !== null}
                  >
                    <strong>{letter}.</strong> {opt.substring(2)}
                  </button>
                );
              })}
            </div>

            {/* "Mengapa Salah?" Button */}
            {selectedAnswer !== null && selectedAnswer.toUpperCase() !== currentQ.answer.toUpperCase() && (
              <div>
                <button
                  className="btn-why-wrong"
                  onClick={handleAskWhyWrong}
                  disabled={explaining}
                >
                  {explaining ? '🤖 Menganalisis alasan...' : t('btn_why_wrong')}
                </button>

                {explanation && (
                  <div className="quiz-explanation-box">
                    <div className="explanation-header">
                      <div className="explanation-title">
                        🤖 {t('explanation_title')}
                      </div>
                      <button
                        className="btn-speak"
                        style={{ width: '32px', height: '32px', position: 'static' }}
                        onClick={() => speakText(explanation)}
                        title="Dengarkan Penjelasan"
                      >
                        🔊
                      </button>
                    </div>
                    <div className="explanation-content">{explanation}</div>
                  </div>
                )}
              </div>
            )}

            {/* Next Question Button */}
            {selectedAnswer !== null && (
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn-huge btn-cyan" onClick={handleNext}>
                  {currentIndex + 1 < questions.length ? t('btn_ans_next') : t('result_title')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. RESULT VIEW */}
      {isFinished && (
        <div className="quiz-container">
          <div className="result-box">
            <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>{t('result_title')}</h2>
            <div className="score-circle">
              {Math.round((score / questions.length) * 100)}
            </div>
            <p style={{ fontSize: '1.2rem', marginBottom: '25px', fontWeight: 700 }}>
              Benar <span style={{ color: 'var(--btn-green)' }}>{score}</span> dari {questions.length} Soal
            </p>

            <button className="btn-huge btn-green" onClick={() => setQuestions([])}>
              {t('btn_retry')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
