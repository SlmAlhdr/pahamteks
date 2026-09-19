import React, { useEffect, useState } from 'react';

const GREETINGS = [
  "Hello", "Bonjour", "Hola", "Ciao", "Konnichiwa", "Namaste", 
  "Guten Tag", "Olá", "Selamat Datang", "Nǐ Hǎo", "Marhaban", 
  "Shalom", "Annyeong", "Yassas", "Dobre", "Python", "JavaScript", "SQL"
];

export default function BackgroundDrift() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      text: GREETINGS[i % GREETINGS.length],
      top: `${(i * 8) + 5}%`,
      left: `${(i * 15) % 85}%`,
      opacity: (0.03 + (i % 4) * 0.02).toFixed(2),
      fontSize: `${1.4 + (i % 3) * 0.6}rem`,
      color: i % 2 === 0 ? 'var(--btn-cyan)' : 'var(--btn-green)'
    }));
    setItems(generated);
  }, []);

  return (
    <div className="hello-container">
      {items.map(item => (
        <div
          key={item.id}
          className="hello-text"
          style={{
            top: item.top,
            left: item.left,
            opacity: item.opacity,
            fontSize: item.fontSize,
            color: item.color
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}

