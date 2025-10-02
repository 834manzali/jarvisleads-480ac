import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import iphoneFrame from 'figma:asset/d9888c6d2fb4079174d1f890421025af8dfc9424.png';
import { JarvisLogo } from './JarvisLogo';

interface Notification {
  id: number;
  title: string;
  message: string;
  delay: number;
}

const notifications: Notification[] = [
  {
    id: 1,
    title: "+1 лид",
    message: "какой минимальный заказ",
    delay: 1000
  },
  {
    id: 2,
    title: "+1 клиент", 
    message: "хотел бы узнать что у вас по ценам",
    delay: 3000
  },
  {
    id: 3,
    title: "+1 заявка",
    message: "как к вам записаться?",
    delay: 5000
  },
  {
    id: 4,
    title: "+1 покупатель",
    message: "когда можете доставить?",
    delay: 7000
  }
];

export function PhoneFrameWithNotifications({ className = "" }: { className?: string }) {
  const [activeNotifications, setActiveNotifications] = useState<number[]>([]);

  useEffect(() => {
    let timers: NodeJS.Timeout[] = [];

    const startNotificationCycle = () => {
      notifications.forEach((notification, index) => {
        const showTimer = setTimeout(() => {
          setActiveNotifications(prev => {
            // Показываем максимум 2 уведомления одновременно
            const newNotifications = [...prev, notification.id];
            return newNotifications.slice(-2); // Оставляем только последние 2
          });
          
          // Remove notification after 2.5 seconds
          const hideTimer = setTimeout(() => {
            setActiveNotifications(prev => prev.filter(id => id !== notification.id));
          }, 2500);
          
          timers.push(hideTimer);
        }, notification.delay);
        
        timers.push(showTimer);
      });
    };

    // Start first cycle
    startNotificationCycle();

    // Reset and restart cycle every 10 seconds БЕЗ ПАУЗЫ - непрерывная анимация
    const resetTimer = setInterval(() => {
      setActiveNotifications([]);
      // Clear old timers
      timers.forEach(timer => clearTimeout(timer));
      timers = [];
      // Start new cycle immediately без паузы
      startNotificationCycle();
    }, 10000);

    return () => {
      clearInterval(resetTimer);
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* iPhone Frame Container */}
      <div className="relative w-full h-full">
        
        {/* Screen Content Area - BEHIND the frame, fitting iPhone 16 Pro Max proportions */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
          {/* Screen area sized for iPhone 16 Pro Max - ЕЩЕ БОЛЕЕ ШИРОКИЙ фон телефона */}
          <div 
            className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden"
            style={{
              width: '85%',  
              height: '97%', 
              borderRadius: '2.5rem', 
              marginTop: '0.1%' 
            }}
          >
            
            {/* Jarvis Logo in center with AI glow */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <motion.div
                className="relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                {/* Our Jarvis Logo with AI glow effect */}
                <motion.div
                  className="relative"
                  animate={{ 
                    filter: [
                      "drop-shadow(0 0 20px rgba(249, 115, 22, 0.6))",
                      "drop-shadow(0 0 30px rgba(236, 72, 153, 0.8))",
                      "drop-shadow(0 0 25px rgba(6, 182, 212, 0.7))",
                      "drop-shadow(0 0 20px rgba(249, 115, 22, 0.6))"
                    ]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <JarvisLogo size={120} />
                </motion.div>
                
                {/* AI background glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-pink-500/30 to-blue-500/20 rounded-full blur-3xl -z-10"
                  animate={{ 
                    scale: [1, 1.4, 1.2, 1],
                    opacity: [0.3, 0.7, 0.5, 0.3]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
              </motion.div>
            </div>

            {/* Notifications Container - Максимально растянутые под новый широкий фон */}
            <div className="absolute top-4 left-4 right-4 z-20">
              <AnimatePresence>
                {activeNotifications.map((notificationId, index) => {
                  const notification = notifications.find(n => n.id === notificationId);
                  if (!notification) return null;
                  
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: -100, scale: 0.8 }}
                      animate={{ 
                        opacity: 1, 
                        y: index * 110 + 25, // Еще больше отступов между уведомлениями, начальная позиция еще ниже
                        scale: 1 
                      }}
                      exit={{ opacity: 0, y: -50, scale: 0.9 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 25,
                        duration: 0.6 
                      }}
                      className="absolute w-full"
                    >
                      {/* Аутентичные iOS уведомления */}
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mx-1 relative" style={{ 
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Helvetica, Arial, sans-serif' 
                      }}>
                         
                        <div className="p-3 relative z-10">
                          <div className="flex items-start space-x-3">
                            {/* Иконка Messages */}
                            <div className="w-10 h-10 bg-gradient-to-b from-green-400 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.36 15.01 3.01 16.32L2 22L7.68 20.99C8.99 21.64 10.46 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="white"/>
                              </svg>
                            </div>
                            
                            {/* Содержимое уведомления в стиле iOS */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-semibold text-black leading-tight" style={{ fontSize: '15px' }}>
                                  Сообщения
                                </p>
                                <span className="text-xs text-gray-500" style={{ fontSize: '12px' }}>сейчас</span>
                              </div>
                              
                              <div className="space-y-1">
                                <p className="text-sm text-gray-900 leading-tight font-medium" style={{ fontSize: '14px' }}>
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-600 leading-tight" style={{ fontSize: '14px' }}>
                                  {notification.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* iPhone Frame - positioned ON TOP of the screen content */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <img
            src={iphoneFrame}
            alt="iPhone Frame"
            className="w-full h-full object-contain"
            style={{
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          />
        </div>
      </div>
    </div>
  );
}