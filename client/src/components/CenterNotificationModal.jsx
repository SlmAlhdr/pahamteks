import React, { useEffect, useRef } from 'react';

/**
 * CenterNotificationModal
 * Modal notifikasi di tengah layar (menggantikan alert browser yang muncul di atas).
 */
export default function CenterNotificationModal({
  isOpen,
  onClose,
  title = 'Pemberitahuan',
  message = '',
  icon,
  buttonText = 'OK, Mengerti'
}) {
  const confirmBtnRef = useRef(null);

  // Fokus tombol otomatis & dukung tombol Escape / Enter untuk menutup
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        confirmBtnRef.current?.focus();
      }, 50);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape' || e.key === 'Enter') {
          e.preventDefault();
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        className="center-notice-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.95), rgba(11, 15, 25, 0.98))',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '24px',
          padding: '32px 28px',
          maxWidth: '420px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(56, 189, 248, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          animation: 'centerPopIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative'
        }}
      >
        {/* Tombol untuk menutup notifikasi. */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.5)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.72rem',
            transition: '0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
          }}
          title="Tutup"
          aria-label="Tutup pemberitahuan"
        >
          Tutup
        </button>

        {icon && <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, rgba(56, 189, 248, 0.04) 70%)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.2rem',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.25)'
          }}
        >
          {icon}
        </div>}

        {/* Judul Notifikasi */}
        <h3
          style={{
            margin: 0,
            fontSize: '1.4rem',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.01em'
          }}
        >
          {title}
        </h3>

        {/* Pesan Notifikasi */}
        <p
          style={{
            margin: 0,
            fontSize: '0.98rem',
            lineHeight: 1.55,
            color: 'rgba(226, 232, 240, 0.88)',
            padding: '0 8px'
          }}
        >
          {message}
        </p>

        {/* Tombol Konfirmasi Tengah */}
        <button
          ref={confirmBtnRef}
          onClick={onClose}
          style={{
            marginTop: '8px',
            width: '100%',
            padding: '12px 24px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, var(--btn-cyan, #06b6d4), var(--btn-blue, #3b82f6))',
            border: 'none',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(6, 182, 212, 0.35)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(6, 182, 212, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(6, 182, 212, 0.35)';
          }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
