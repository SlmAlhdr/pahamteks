import React, { useState, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_LANGUAGES } from '../graphql/queries';
import { TRANSLATE_MUTATION, TRANSCRIBE_AUDIO_MUTATION } from '../graphql/mutations';

export default function Translator({ t, currentLang }) {
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('en');
  const [isRecording, setIsRecording] = useState(false);
  const [micStatus, setMicStatus] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const { data: langData } = useQuery(GET_LANGUAGES);
  const languages = langData?.languages || [
    { code: 'id', name: 'Indonesian' },
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'Arabic' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh-cn', name: 'Chinese' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'es', name: 'Spanish' }
  ];

  const [translateMutation, { loading: translating }] = useMutation(TRANSLATE_MUTATION);
  const [transcribeMutation, { loading: transcribing }] = useMutation(TRANSCRIBE_AUDIO_MUTATION);

  const handleTranslate = async (textToTranslate = sourceText) => {
    if (!textToTranslate.trim()) {
      setTargetText('');
      return;
    }
    setTargetText(currentLang === 'id' ? 'Menghubungkan ke server AI...' : 'Connecting to AI server...');
    try {
      const res = await translateMutation({
        variables: {
          text: textToTranslate,
          source: sourceLang,
          target: targetLang
        }
      });
      if (res.data?.translate?.translatedText) {
        setTargetText(res.data.translate.translatedText);
      } else if (res.data?.translate?.error) {
        setTargetText(res.data.translate.error);
      }
    } catch (err) {
      setTargetText('⚠️ AI Error: ' + err.message);
    }
  };

  const handleSwap = () => {
    if (sourceLang === 'auto') return;
    const prevSource = sourceLang;
    const prevTarget = targetLang;
    const prevSourceText = sourceText;
    const prevTargetText = targetText;

    setSourceLang(prevTarget);
    setTargetLang(prevSource);
    setSourceText(prevTargetText);
    setTargetText(prevSourceText);
  };

  const handleVoiceInput = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      setMicStatus('');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        setMicStatus(currentLang === 'id' ? '⏳ Mentranskripsi suara...' : '⏳ Transcribing audio...');
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Data = reader.result;
          try {
            const res = await transcribeMutation({
              variables: {
                audioBase64: base64Data,
                mimeType: 'audio/webm',
                lang: sourceLang === 'en' ? 'en' : 'id'
              }
            });
            setMicStatus('');
            if (res.data?.transcribeAudio?.text) {
              const text = res.data.transcribeAudio.text;
              setSourceText(text);
              handleTranslate(text);
            } else if (res.data?.transcribeAudio?.error) {
              alert(res.data.transcribeAudio.error);
            }
          } catch (err) {
            setMicStatus('');
            alert('Gagal transkripsi suara: ' + err.message);
            alert((currentLang === 'en' ? 'Voice transcription failed: ' : 'Gagal transkripsi suara: ') + err.message);
          }
        };
      };

      recorder.start();
      setIsRecording(true);
      setMicStatus(currentLang === 'id' ? '🎙️ Sedang mendengarkan suara Anda...' : '🎙️ Listening to your voice...');
    } catch (err) {
      alert('Tidak dapat mengakses mikrofon: ' + err.message);
      alert((currentLang === 'en' ? 'Unable to access microphone: ' : 'Tidak dapat mengakses mikrofon: ') + err.message);
    }
  };

  const speakText = (text, langCode) => {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode === 'id' ? 'id-ID' : 'en-US';
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = () => {
    if (!targetText) return;
    navigator.clipboard.writeText(targetText);
    alert(currentLang === 'id' ? 'Teks berhasil disalin!' : 'Text copied to clipboard!');
  };

  return (
    <div className="page" style={{ width: '100%', maxWidth: '1000px' }}>
      <div className="translator-container">
        <div className="translation-area">
          {/* Source Box */}
          <div className="text-box-wrapper">
            <select
              className="styled-select"
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
            >
              <option value="auto">{t('opt_auto_detect')}</option>
              {languages.map(l => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
            <div className="text-box">
              <textarea
                placeholder={t('trans_ph_source')}
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleTranslate();
                  }
                }}
              />
              <div className="text-box-actions">
                <button
                  className={`btn-mic ${isRecording ? 'listening' : ''}`}
                  onClick={handleVoiceInput}
                  title={isRecording ? t('trans_mic_listening') : t('trans_mic_start')}
                  type="button"
                >
                  🎤
                </button>
                <button
                  className="btn-speak"
                  onClick={() => speakText(sourceText, sourceLang)}
                  title="Dengarkan Suara"
                  title={currentLang === 'en' ? 'Listen to Audio' : 'Dengarkan Suara'}
                  type="button"
                >
                  🔊
                </button>
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="btn-swap-wrap">
            <button className="btn-swap" onClick={handleSwap} title="Tukar Bahasa">
            <button
              className="btn-swap"
              onClick={handleSwap}
              title={currentLang === 'en' ? 'Swap Languages' : 'Tukar Bahasa'}
            >
              ⇄
            </button>
          </div>

          {/* Target Box */}
          <div className="text-box-wrapper">
            <select
              className="styled-select"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
            >
              {languages.map(l => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
            <div className="text-box">
              <textarea
                placeholder={t('trans_ph_target')}
                value={targetText}
                readOnly
              />
              <div className="text-box-actions">
                <button
                  className="btn-copy"
                  onClick={copyToClipboard}
                  title="Salin Teks"
                  title={currentLang === 'en' ? 'Copy Text' : 'Salin Teks'}
                  type="button"
                >
                  📋
                </button>
                <button
                  className="btn-speak"
                  onClick={() => speakText(targetText, targetLang)}
                  title="Dengarkan Suara"
                  title={currentLang === 'en' ? 'Listen to Audio' : 'Dengarkan Suara'}
                  type="button"
                >
                  🔊
                </button>
              </div>
            </div>
          </div>
        </div>

        {micStatus && (
          <div style={{ color: 'var(--btn-cyan)', fontWeight: 700, fontSize: '0.95rem' }}>
            {micStatus}
          </div>
        )}

        <div className="action-row">
          <button
            className="btn-huge btn-cyan"
            onClick={() => handleTranslate()}
            disabled={translating || transcribing}
          >
            {translating ? 'Menerjemahkan...' : t('btn_translate')}
            {translating ? (currentLang === 'en' ? 'Translating...' : 'Menerjemahkan...') : t('btn_translate')}
          </button>
        </div>
      </div>
    </div>
  );
}
