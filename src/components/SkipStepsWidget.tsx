import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, MessageCircle, Clock, PhoneCall } from 'lucide-react';
import { Button } from './ui/button';

interface SkipStepsWidgetProps {
  onContinueWithManager: () => void;
  onContinueForm: () => void;
}

export function SkipStepsWidget({ onContinueWithManager, onContinueForm }: SkipStepsWidgetProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 sm:space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
          Как бы вы хотели продолжить?
        </h2>
        <p className="text-gray-300 text-sm sm:text-base">
          Выберите наиболее удобный для вас способ оформления заявки
        </p>
      </div>

      {/* Options */}
      <div className="grid gap-3 sm:gap-4">
        {/* Quick Manager Option */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="group"
        >
          <Button
            onClick={onContinueWithManager}
            variant="outline"
            className="w-full p-4 sm:p-6 h-auto text-left border-2 border-orange-500/30 hover:border-orange-500/60 bg-gradient-to-r from-orange-500/10 to-orange-600/10 hover:from-orange-500/20 hover:to-orange-600/20 transition-all duration-300"
          >
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="p-2 bg-orange-500/20 rounded-lg group-hover:bg-orange-500/30 transition-all duration-300 flex-shrink-0">
                <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
              </div>
              <div className="flex-1 space-y-1 sm:space-y-2 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-white leading-tight">
                  Быстрая связь с менеджером
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                  Оставьте только контакты - наш менеджер перезвонит и соберет всю информацию в удобном разговоре
                </p>
                <div className="flex items-center space-x-2 text-green-400 text-xs sm:text-sm">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>Займет 1-2 минуты</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
            </div>
          </Button>
        </motion.div>

        {/* Full Form Option */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="group"
        >
          <Button
            onClick={onContinueForm}
            variant="outline"
            className="w-full p-4 sm:p-6 h-auto text-left border-2 border-blue-500/30 hover:border-blue-500/60 bg-gradient-to-r from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 transition-all duration-300"
          >
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-all duration-300 flex-shrink-0">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              </div>
              <div className="flex-1 space-y-1 sm:space-y-2 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-white leading-tight">
                  Заполнить подробную анкету
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                  Пройдите 7-этапную форму для максимально точного расчета стоимости и персонализированного предложения
                </p>
                <div className="flex items-center space-x-2 text-blue-400 text-xs sm:text-sm">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>Займет 5-7 минут</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
            </div>
          </Button>
        </motion.div>
      </div>

      {/* Info */}
      <div className="bg-gray-700/50 border border-gray-600 rounded-xl p-3 sm:p-4">
        <div className="flex items-start space-x-2">
          <MessageCircle className="text-gray-400 flex-shrink-0 mt-0.5" size={14} />
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
            <strong>Подсказка:</strong> В любом случае вы получите бесплатную консультацию и персональное предложение от нашего менеджера
          </p>
        </div>
      </div>
    </div>
  );
}