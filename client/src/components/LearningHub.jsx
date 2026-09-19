import React, { useState } from 'react';
import QuizView from './QuizView';

export default function LearningHub({ t, currentLang, onFinishQuiz, initialMode = 'learn' }) {
  const [learningMode, setLearningMode] = useState(initialMode); // 'learn' | 'coding'

  return (
    <div className="page" style={{ width: '100%', maxWidth: '1050px' }}>
      {/* Sub-Navigasi Pemilihan Opsi Pembelajaran Bahasa */}
      <div className="sub-tabs-container" style={{ margin: '10px auto 25px' }}>
        <button
          className={`sub-tab-btn ${learningMode === 'learn' ? 'active' : ''}`}
          onClick={() => setLearningMode('learn')}
        >
          🌐 {t('tab_world_lang')}
        </button>
        <button
          className={`sub-tab-btn ${learningMode === 'coding' ? 'active' : ''}`}
          onClick={() => setLearningMode('coding')}
        >
          💻 {t('tab_programming')}
        </button>
      </div>

      {/* Konten Kuis & Latihan Berdasarkan Opsi Terpilih */}
      <QuizView
        key={learningMode}
        mode={learningMode}
        t={t}
        currentLang={currentLang}
        onFinishQuiz={onFinishQuiz}
      />
    </div>
  );
}

