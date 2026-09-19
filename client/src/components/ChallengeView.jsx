import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Award, Zap, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { GENERATE_CHALLENGE } from '../graphql/queries';

export default function ChallengeView() {
  const [category, setCategory] = useState('English Idioms & Grammar');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const [fetchChallenge, { loading }] = useLazyQuery(GENERATE_CHALLENGE, {
    fetchPolicy: 'network-only'
  });

  const handleStart = async () => {
    setSubmitted(false);
    setAnswers({});
    try {
      const res = await fetchChallenge({
        variables: { category }
      });
      if (res.data?.generateChallenge) {
        setQuestions(res.data.generateChallenge);
      }
    } catch (err) {
      alert('Gagal memuat tantangan: ' + err.message);
    }
  };

  const handleSelect = (qIndex, opt) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIndex]: opt.charAt(0) }));
  };

  const calculateScore = () => {
    let s = 0;
    questions.forEach((q, i) => {
      if (answers[i] && answers[i].toUpperCase() === q.answer.toUpperCase()) {
        s++;
      }
    });
    return s;
  };

  return (
    <div className="cyber-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>Expert Exam</span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Tantangan Ujian Sulit AI</h2>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Topik tantangan (misal: Advanced Python, TOEFL Vocab)..."
          style={{ flex: 1 }}
        />
        <button
          className="btn-cyan"
          onClick={handleStart}
          disabled={loading || !category.trim()}
          style={{ padding: '10px 24px', flexShrink: 0 }}
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
          Mulai Ujian
        </button>
      </div>

      {questions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {questions.map((q, qIndex) => (
            <div
              key={qIndex}
              style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid var(--border-color)'
              }}
            >
              <span style={{ fontSize: '0.8rem', color: 'var(--cyan)', fontWeight: 700 }}>
                Soal #{qIndex + 1}
              </span>
              <h4 style={{ fontSize: '1.1rem', margin: '8px 0 16px' }}>{q.question}</h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {q.options.map((opt, optIndex) => {
                  const letter = opt.charAt(0);
                  const isSelected = answers[qIndex] === letter;
                  let style = { padding: '10px 16px', textAlign: 'left', width: '100%' };
                  let btnClass = isSelected ? 'btn-cyan' : 'btn-outline';

                  if (submitted) {
                    const isCorrect = letter.toUpperCase() === q.answer.toUpperCase();
                    if (isCorrect) {
                      btnClass = 'btn-green';
                    } else if (isSelected) {
                      btnClass = 'btn-outline';
                      style.borderColor = 'var(--pink)';
                      style.color = 'var(--pink)';
                    }
                  }

                  return (
                    <button
                      key={optIndex}
                      className={btnClass}
                      style={style}
                      onClick={() => handleSelect(qIndex, opt)}
                      disabled={submitted}
                    >
                      <strong>{letter}.</strong> {opt.substring(2)}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {!submitted ? (
            <button
              className="btn-green"
              style={{ padding: '12px 28px', alignSelf: 'flex-end' }}
              onClick={() => setSubmitted(true)}
              disabled={Object.keys(answers).length < questions.length}
            >
              Kirim Jawaban & Evaluasi
            </button>
          ) : (
            <div style={{
              background: 'rgba(0,255,136,0.1)',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid rgba(0,255,136,0.3)',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Hasil Ujian Tantangan:</h3>
              <p style={{ fontSize: '1.1rem', marginTop: '8px' }}>
                Skor Anda: <strong style={{ color: 'var(--green)' }}>{calculateScore()}</strong> / {questions.length}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

