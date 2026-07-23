import React, { useState, useEffect } from 'react';

export default function DecryptedText({ text, speed = 40, delay = 300, className = '' }) {
  const [displayedText, setDisplayedText] = useState('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+-=';

  useEffect(() => {
    let timer;
    let iteration = 0;

    const startDecrypt = () => {
      timer = setInterval(() => {
        setDisplayedText(
          text
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' ';
              if (index < iteration) {
                return text[index];
              }
              // Return a random character from our set
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('')
        );

        if (iteration >= text.length) {
          clearInterval(timer);
        }

        // Increment iteration (determines how many letters are locked in)
        iteration += 1 / 3; 
      }, speed);
    };

    const delayTimer = setTimeout(startDecrypt, delay);

    return () => {
      clearInterval(timer);
      clearTimeout(delayTimer);
    };
  }, [text, speed, delay]);

  return <span className={className}>{displayedText || text}</span>;
}
