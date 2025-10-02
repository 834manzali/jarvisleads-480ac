import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { voiceService } from '../services/mockServices';
import { JarvisLogo } from './JarvisLogo';
import { useTranslation } from '../services/localization';
import { useHaptic } from '../services/hapticService';
import { useAudio } from '../services/audioService';

interface AnimatedLogoProps {
  className?: string;
  clickable?: boolean; // новый пропс для контроля кликабельности
}

export function AnimatedLogo({ className = '', clickable = true }: AnimatedLogoProps) {
  const { voiceState, activateVoice, deactivateVoice, sendMessage, settings } = useAppStore();
  const [isPressed, setIsPressed] = useState(false);
  const t = useTranslation(settings.language);
  const { aiActivated, aiDeactivated } = useHaptic();
  const { playSound } = useAudio();

  const isVoiceActive = voiceState === 'listening' || voiceState === 'processing';
  
  // Debug logging для отслеживания состояний
  useEffect(() => {
    console.log('Voice state changed:', voiceState, 'isVoiceActive:', isVoiceActive);
  }, [voiceState, isVoiceActive]);

  // Сброс состояния при размонтировании компонента
  useEffect(() => {
    return () => {
      if (isVoiceActive) {
        deactivateVoice();
      }
    };
  }, []);

  const handleLogoClick = async () => {
    if (voiceState === 'idle') {
      aiActivated();
      playSound('voice_activate'); // Теперь короткий ASMR звук
      activateVoice();
      setIsPressed(true);
      
      try {
        await voiceService.startListening();
        playSound('listening_pulse'); // Деликатный пульс
        const recognizedText = await voiceService.stopListening();
        
        if (recognizedText) {
          playSound('ai_response'); // Теплое приветствие
          sendMessage(recognizedText, 'voice');
        }
      } catch (error) {
        console.error('Voice recognition error:', error);
        playSound('error'); // Мягкое предупреждение
      } finally {
        aiDeactivated();
        playSound('voice_deactivate'); // Короткий ASMR звук выключения
        deactivateVoice();
        setIsPressed(false);
      }
    } else {
      aiDeactivated();
      playSound('voice_deactivate'); // Короткий ASMR звук выключения
      deactivateVoice();
      setIsPressed(false);
    }
  };

  // Определяем тему для правильного выбора цветов свечения
  const isDarkTheme = settings.theme === 'dark';

  // Оптимизированные CSS переменные для быстрой загрузки
  const glowStyles = {
    idle: isDarkTheme 
      ? 'drop-shadow(0px 0px 25px rgba(255, 255, 255, 0.6)) drop-shadow(0px 0px 50px rgba(255, 255, 255, 0.3))' 
      : 'none',
    active: isDarkTheme 
      ? 'drop-shadow(0px 0px 40px rgba(255, 255, 255, 1)) drop-shadow(0px 0px 80px rgba(255, 255, 255, 0.8)) drop-shadow(0px 0px 150px rgba(255, 255, 255, 0.6))' 
      : 'none'
  };



  // Responsive sizing - Made bigger
  const logoSize = (typeof window !== 'undefined' && window.innerWidth < 640) ? { container: 200, logo: 150 } : { container: 240, logo: 180 };

  return (
    <div 
      className={`relative flex items-center justify-center flex-shrink-0 ${className}`} 
      style={{ width: `${logoSize.container}px`, height: `${logoSize.container}px` }}
    >


      {/* Wrapper с оптимизированным свечением для голосового режима */}
      <motion.div
        className={`relative z-10 ${isDarkTheme ? 'logo-glow' : ''}`}
        style={{ 
          width: `${logoSize.logo}px`, 
          height: `${logoSize.logo}px`,
          filter: (voiceState === 'listening' || voiceState === 'processing') 
            ? glowStyles.active
            : glowStyles.idle,
          willChange: 'transform, filter'
        }}
        animate={{
          scale: isPressed ? 0.95 : (voiceState === 'listening' || voiceState === 'processing') ? 1.08 : 1
        }}
        transition={{ 
          duration: 0.3, 
          ease: 'easeOut',
          type: 'tween'
        }}
      >
        {/* Main logo - responsive sizing */}
        <motion.button
          className={`relative w-full h-full flex items-center justify-center bg-transparent flex-shrink-0 ${
            clickable ? 'cursor-pointer' : 'cursor-default pointer-events-none'
          }`}
          onClick={clickable ? handleLogoClick : undefined}
          whileTap={clickable ? { scale: 0.95 } : {}}
        >
          {/* Responsive JarvisLogo */}
          <JarvisLogo 
            size={logoSize.logo} 
            isListening={isVoiceActive}
          />
        </motion.button>
      </motion.div>

      {/* Стильный индикатор состояния голоса */}
      <AnimatePresence>
        {voiceState !== 'idle' && (
          <motion.div
            className="absolute left-1/2 transform -translate-x-1/2"
            style={{ top: '-50px' }}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.div 
              className="px-4 py-2 rounded-2xl text-xs font-medium whitespace-nowrap backdrop-blur-md border"
              style={{
                background: isDarkTheme 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.1)',
                borderColor: isDarkTheme 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'rgba(0, 0, 0, 0.2)',
                color: isDarkTheme ? '#ffffff' : '#000000'
              }}
              animate={{
                scale: voiceState === 'listening' ? [1, 1.02, 1] : 1
              }}
              transition={{
                scale: {
                  duration: 2,
                  repeat: voiceState === 'listening' ? Infinity : 0,
                  ease: "easeInOut"
                }
              }}
            >
              <div className="flex items-center space-x-2">
                {voiceState === 'listening' && (
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, index) => (
                      <motion.div
                        key={index}
                        className={`w-1 h-1 rounded-full ${isDarkTheme ? 'bg-white' : 'bg-black'}`}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: index * 0.1,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
                )}
                <span>
                  {voiceState === 'listening' ? t('voice.listening') : t('voice.processing')}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}