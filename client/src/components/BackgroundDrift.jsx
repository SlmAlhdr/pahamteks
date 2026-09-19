import React, { useEffect, useRef } from 'react';

const GREETINGS = [
  "Hello", "Bonjour", "Hola", "Ciao", "Konnichiwa", "Namaste", 
  "Guten Tag", "Olá", "Selamat Datang", "Nǐ Hǎo", "Marhaban", 
  "Shalom", "Annyeong", "Yassas", "Dobre", "Python", "JavaScript", "SQL"
];

export default function BackgroundDrift() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Bersihkan container
    container.innerHTML = '';

    const totalTexts = GREETINGS.length;
    const trackHeight = Math.max(window.innerHeight / totalTexts, 40);
    const floatingTexts = [];

    for (let i = 0; i < totalTexts; i++) {
      const el = document.createElement('div');
      el.className = 'hello-text';
      el.innerText = GREETINGS[i];

      // Variasi ukuran font yang proporsional
      const fontSize = (Math.random() * 0.7 + 1.3).toFixed(2);
      el.style.fontSize = `${fontSize}rem`;
      el.style.color = i % 2 === 0 ? 'rgba(126, 242, 224, 0.08)' : 'rgba(180, 242, 126, 0.08)';

      container.appendChild(el);

      const posY = (i * trackHeight) + (trackHeight / 2) - 15;
      let posX = Math.random() * window.innerWidth;
      let speedX = (Math.random() * 0.4 + 0.25);
      
      // Jalur genap bergerak ke kiri, jalur ganjil ke kanan
      if (i % 2 === 0) speedX *= -1;

      floatingTexts.push({ el, x: posX, y: posY, speedX });
    }

    let animId;
    function animateTexts() {
      const width = window.innerWidth;
      floatingTexts.forEach(t => {
        t.x += t.speedX;

        // Loop melayang kembali saat keluar layar
        if (t.speedX > 0 && t.x > width + 150) {
          t.x = -200;
        } else if (t.speedX < 0 && t.x < -200) {
          t.x = width + 150;
        }

        t.el.style.transform = `translate3d(${t.x}px, ${t.y}px, 0)`;
      });
      animId = requestAnimationFrame(animateTexts);
    }

    animateTexts();

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (container) container.innerHTML = '';
    };
  }, []);

  return <div ref={containerRef} className="hello-container" />;
}
