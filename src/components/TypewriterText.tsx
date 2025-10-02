import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
  className?: string;
}

export function TypewriterText({ 
  text, 
  speed = 30, 
  delay = 0, 
  onComplete, 
  className = '' 
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    // Сброс при изменении текста
    indexRef.current = 0;
    setDisplayedText('');
    setIsComplete(false);

    // Задержка перед началом анимации
    const startTimer = setTimeout(() => {
      const timer = setInterval(() => {
        setDisplayedText(prev => {
          const nextIndex = indexRef.current + 1;
          indexRef.current = nextIndex;

          if (nextIndex > text.length) {
            clearInterval(timer);
            setIsComplete(true);
            if (onComplete) onComplete();
            return text;
          }

          return text.slice(0, nextIndex);
        });
      }, speed);

      return () => clearInterval(timer);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [text, speed, delay, onComplete]);

  return (
    <div className={className}>
      {displayedText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 0.8,
            ease: "easeInOut"
          }}
          className="inline-block w-0.5 h-4 bg-current ml-0.5 align-middle"
        />
      )}
    </div>
  );
}