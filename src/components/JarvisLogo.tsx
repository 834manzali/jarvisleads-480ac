import { motion } from 'motion/react';
import { useAppStore } from '../store/appStore';
import jarvisLogoDark from 'figma:asset/5321da3449a80491c8b6d11d661277abbf530e33.png';
import jarvisLogoLight from 'figma:asset/230fe752fea9f0166669a0713e659a557ae3e38a.png';

interface JarvisLogoProps {
  size?: number;
  className?: string;
  isListening?: boolean;
}

export function JarvisLogo({ size = 120, className = '', isListening = false }: JarvisLogoProps) {
  const { settings } = useAppStore();
  const isDarkTheme = settings.theme === 'dark';
  
  // При прослушивании - анимация масштабирования
  const pulseVariants = {
    idle: {
      scale: 1,
      opacity: 1
    },
    listening: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
    }
  };

  // Выбираем логотип в зависимости от темы
  const logoSrc = isDarkTheme ? jarvisLogoDark : jarvisLogoLight;
  
  // Масштабирующий коэффициент для светлой темы, чтобы логотип выглядел одинакового размера
  // Точная визуальная подгонка по скриншотам - увеличиваем светлый логотип еще немного
  const scaleMultiplier = isDarkTheme ? 1 : 1.15; // увеличиваем светлый логотип до 115%

  return (
    <div className={`relative flex-shrink-0 ${className} flex items-center justify-center`} style={{ width: size, height: size }}>
      {/* Основной логотип */}
      <motion.img
        src={logoSrc}
        alt="Jarvis Logo"
        className="relative z-10 object-contain w-full h-full"
        style={{ 
          transform: `scale(${scaleMultiplier})`,
          transformOrigin: 'center center'
        }}
        variants={isListening ? pulseVariants : undefined}
        initial="idle"
        animate={isListening ? "listening" : "idle"}
        transition={isListening ? {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        } : undefined}
      />
    </div>
  );
}