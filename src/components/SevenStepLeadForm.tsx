import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, CheckCircle, Phone, Mail, Building, Target, Globe, Users, CreditCard, SkipForward, MessageCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { SkipStepsWidget } from './SkipStepsWidget';

// РАБОЧАЯ ОТПРАВКА В TELEGRAM
async function sendToTelegram(formData: any) {
  // ИНСТРУКЦИЯ: Создайте нового бота через @BotFather в Telegram
  // 1. Напишите @BotFather
  // 2. Отправьте /newbot
  // 3. Выберите имя и username для бота
  // 4. Скопируйте токен и вставьте ниже
  // 5. Добавьте бота в нужный чат и получите chat_id
  
  const BOT_TOKEN = '7713474735:AAE6gnzckuudD7JFS4Fjktz-8svd6DToS5E'; // Jarvis Leads 2 bot
  const CHAT_ID = '8471089541'; // Chat ID for Jarvis Leads 2

  console.log('🚀 Отправляем заявку...');
  
  // Проверка токена
  if (BOT_TOKEN === 'ВАШ_НОВЫЙ_ТОКЕН_БОТА' || CHAT_ID === 'ВАШ_CHAT_ID') {
    console.warn('⚠️ Токен или Chat ID не настроены!');
    
    // Показываем инструкцию пользователю
    toast.error('Telegram не настроен', {
      description: 'Настройте токен бота в коде. Проверьте консоль для инструкций.',
      duration: 10000
    });
    
    console.log(`
🔧 НАСТРОЙКА TELEGRAM БОТА:

1. Откройте Telegram и найдите @BotFather
2. Отправьте команду: /newbot
3. Выберите имя для бота (например: Jarvis Leads Bot)
4. Выберите username (например: jarvis_leads_bot)
5. Скопируйте токен который даст BotFather
6. Замените в коде BOT_TOKEN на ваш токен
7. Добавьте бота в ваш чат
8. Получите chat_id вашего чата (можно через @userinfobot)
9. Замените CHAT_ID в коде

Заявка пока сохранена в консоли:
`);
    console.log('📋 ДАННЫЕ ЗАЯВКИ:', formData);
    
    // Все равно возвращаем успех, чтобы форма работала
    return { success: true, orderNumber: Date.now() };
  }
  
  const message = `🎯 НОВАЯ ЗАЯВКА ЛИДОГЕНЕРАЦИИ

👤 Контакты:
Имя: ${formData.fullName || '-'}
Компания: ${formData.businessName || '-'}
Email: ${formData.email || '-'}
Телефон: ${formData.phone || '-'}

📊 Бизнес:
Отрасль: ${formData.businessSphere || '-'}
Целевая аудитория: ${formData.targetAudience || '-'}
Средний чек: ${formData.averageCheck || '-'}

📈 Потребности:
Количество лидов: ${formData.leadCount || '-'}
Регион: ${formData.leadRegion || '-'}
Бюджет на лиды: ${formData.leadBudget || '-'}
Общий бюджет: ${formData.monthlyBudget || '-'}

⚙️ Услуги:
Обзвон: ${formData.needCalls ? 'Да' : 'Нет'}
Аналитика: ${formData.needAnalytics ? 'Да' : 'Нет'}
Консультации: ${formData.needConsultation ? 'Да' : 'Нет'}

📝 Пожелания: ${formData.specialRequests || 'Нет'}

Время: ${new Date().toLocaleString('ru-RU')}`;

  try {
    const form = new FormData();
    form.append('chat_id', CHAT_ID);
    form.append('text', message);
    
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      body: form
    });
    
    const result = await response.json();
    
    if (result.ok) {
      console.log('✅ Заявка отправлена в Telegram!');
      return { success: true, orderNumber: Date.now() };
    } else {
      console.error('❌ Ошибка Telegram API:', result);
      
      if (result.error_code === 401) {
        console.error('🔑 Неверный токен бота! Создайте нового бота через @BotFather');
        toast.error('Неверный токен бота', {
          description: 'Создайте нового бота через @BotFather в Telegram'
        });
      } else if (result.error_code === 400) {
        console.error('💬 Неверный chat_id или бот не добавлен в чат');
        toast.error('Ошибка chat_id', {
          description: 'Добавьте бота в нужный чат и проверьте chat_id'
        });
      }
      
      throw new Error(`Telegram API: ${result.description}`);
    }
  } catch (error) {
    console.error('💥 Ошибка отправки:', error);
    throw error;
  }
}

interface SevenStepLeadFormProps {
  onComplete: (formData: any) => void;
  onBack: () => void;
}

export function SevenStepLeadForm({ onComplete, onBack }: SevenStepLeadFormProps) {
  const [showWidget, setShowWidget] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Business Sphere (Industry)
    businessSphere: '',
    
    // Step 2: Contact Info
    fullName: '',
    email: '',
    phone: '',
    businessName: '',
    
    // Step 3: Target Audience & Average Check
    targetAudience: '',
    averageCheck: '',
    
    // Step 4: Competitors
    competitorUrls: [''],
    competitorAnalysis: '',
    
    // Step 5: Lead Requirements
    leadCount: '',
    leadRegion: '',
    leadBudget: '',
    
    // Step 6: Additional Services
    needCalls: false,
    needAnalytics: false,
    needConsultation: false,
    specialRequests: '',
    
    // Step 7: Budget & Timeline
    monthlyBudget: '',
    startDate: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step icons
  const stepIcons = [
    Building,
    Phone,
    Target,
    Globe,
    Users,
    CreditCard,
    CheckCircle
  ];

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    // Только контактные данные обязательны
    if (currentStep === 2) {
      if (!formData.fullName) {
        newErrors.fullName = 'Пожалуйста, введите ваше имя';
      }
      if (!formData.businessName) {
        newErrors.businessName = 'Пожалуйста, введите название компании';
      }
      if (!formData.email) {
        newErrors.email = 'Пожалуйста, введите email';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Пожалуйста, введите корректный email';
      }
      if (!formData.phone) {
        newErrors.phone = 'Пожалуйста, введите телефон';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < 7) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSkip = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleContinueWithManager = () => {
    // Переходим сразу к контактным данным (шаг 2)
    setShowWidget(false);
    setCurrentStep(2);
  };

  const handleContinueForm = () => {
    // Начинаем с первого шага формы
    setShowWidget(false);
    setCurrentStep(1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('🚀 ОТПРАВКА ЗАЯВКИ');
      console.log('📋 Данные:', formData);
      
      toast.info('Отправляем заявку...');
      const result = await sendToTelegram(formData);
      
      console.log('✅ УСПЕХ!');
      toast.success('Заявка отправлена!');
      onComplete(formData);
      
    } catch (error) {
      console.error('❌ Ошибка:', error);
      toast.error(`Ошибка: ${error.message}`);
      // Все равно завершаем процесс
      onComplete(formData);
    }
  };

  const addCompetitorField = () => {
    setFormData({
      ...formData,
      competitorUrls: [...formData.competitorUrls, '']
    });
  };

  const updateCompetitorUrl = (index: number, value: string) => {
    const newUrls = [...formData.competitorUrls];
    newUrls[index] = value;
    setFormData({
      ...formData,
      competitorUrls: newUrls
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Подсказка о возможности пропуска */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <MessageCircle className="text-blue-400" size={20} />
                <p className="text-blue-200 text-sm">
                  <strong>Совет:</strong> Вы можете пропустить любой этап, кроме контактных данных. Наш менеджер уточнит детали при звонке.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-300 text-lg">
                Начнем с выбора вашей отрасли, чтобы подобрать наилучшие решения именно для вашего бизнеса
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="businessSphere">В какой отрасли работает ваш бизнес? *</Label>
                <div className="relative">
                  <Select 
                    value={formData.businessSphere} 
                    onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, businessSphere: value }));
                    }}
                  >
                    <SelectTrigger className={errors.businessSphere ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Выберите отрасль" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] overflow-y-auto bg-gray-800 border-gray-600 text-white">
                      <SelectItem value="construction">🏗️ Строительство</SelectItem>
                      <SelectItem value="realestate">🏠 Недвижимость</SelectItem>
                      <SelectItem value="renovation">🔨 Ремонт</SelectItem>
                      <SelectItem value="finance">💼 Финансы/Юриспруденция</SelectItem>
                      <SelectItem value="ecommerce">🛒 E-commerce</SelectItem>
                      <SelectItem value="saas">💻 IT/SaaS</SelectItem>
                      <SelectItem value="education">🎓 Образование</SelectItem>
                      <SelectItem value="healthcare">⚕️ Медицина</SelectItem>
                      <SelectItem value="beauty">💄 Красота/Здоровье</SelectItem>
                      <SelectItem value="auto">🚗 Автомобили</SelectItem>
                      <SelectItem value="restaurants">🍽️ Рестораны/Кафе</SelectItem>
                      <SelectItem value="fitness">💪 Фитнес/Спорт</SelectItem>
                      <SelectItem value="travel">✈️ Туризм</SelectItem>
                      <SelectItem value="insurance">🛡️ Страхование</SelectItem>
                      <SelectItem value="manufacturing">🏭 Производство</SelectItem>
                      <SelectItem value="other">🔧 Другое</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {errors.businessSphere && <p className="text-red-500 text-sm">{errors.businessSphere}</p>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-gray-300 text-lg">
                Отлично! Теперь расскажите о себе и своей компании
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fullName">Ваше имя *</Label>
              <Input
                id="fullName"
                placeholder="Иван Иванов"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                className={errors.fullName ? 'border-red-500' : ''}
              />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessName">Название компании *</Label>
              <Input
                id="businessName"
                placeholder="ООО Ваша компания"
                value={formData.businessName}
                onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                className={errors.businessName ? 'border-red-500' : ''}
              />
              {errors.businessName && <p className="text-red-500 text-sm">{errors.businessName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Телефон *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 999 123 45 67"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Подсказка о возможности пропуска */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <MessageCircle className="text-blue-400" size={20} />
                <p className="text-blue-200 text-sm">
                  <strong>Подсказка:</strong> Эти данные помогут точнее рассчитать стоимость, но при желании их можно пропустить.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-300 text-lg">
                Давайте разберемся с вашей целевой аудиторией и средним чеком
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAudience">Опишите вашу целевую аудиторию</Label>
              <Textarea
                id="targetAudience"
                placeholder="Например: Владельцы квартир в новостройках Москвы, возраст 25-45 лет, доход от 100к рублей"
                value={formData.targetAudience}
                onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="averageCheck">Средний чек вашей услуги/товара</Label>
              <div className="relative">
                <Select 
                  value={formData.averageCheck} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, averageCheck: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите диапазон" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto bg-gray-900/95 backdrop-blur-sm border-gray-700 text-white">
                    <SelectItem value="under-50k" className="bg-gray-900 hover:bg-gray-800 text-white focus:bg-gray-800">💰 До 50 000₽</SelectItem>
                    <SelectItem value="50k-100k" className="bg-gray-900 hover:bg-gray-800 text-white focus:bg-gray-800">💎 50 000 - 100 000₽</SelectItem>
                    <SelectItem value="100k-500k" className="bg-gray-900 hover:bg-gray-800 text-white focus:bg-gray-800">🏆 100 000 - 500 000₽</SelectItem>
                    <SelectItem value="500k-1m" className="bg-gray-900 hover:bg-gray-800 text-white focus:bg-gray-800">💼 500 000 - 1 000 000₽</SelectItem>
                    <SelectItem value="over-1m" className="bg-gray-900 hover:bg-gray-800 text-white focus:bg-gray-800">👑 Свыше 1 000 000₽</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Подсказка о возможности пропуска */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <MessageCircle className="text-blue-400" size={20} />
                <p className="text-blue-200 text-sm">
                  <strong>Необязательно:</strong> Анализ конкурентов поможет улучшить качество лидов, но этот шаг можно пропустить.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-300 text-lg">
                Расскажите о ваших конкурентах - это поможет нам лучше понять рынок
              </p>
            </div>

            <div className="space-y-4">
              <Label>Сайты ваших конкурентов</Label>
              {formData.competitorUrls.map((url, index) => (
                <Input
                  key={index}
                  placeholder="https://competitor-site.com"
                  value={url}
                  onChange={(e) => updateCompetitorUrl(index, e.target.value)}
                />
              ))}
              <Button
                variant="outline"
                onClick={addCompetitorField}
                className="w-full"
              >
                + Добавить конкурента
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="competitorAnalysis">Что вас привлекает в конкурентах?</Label>
              <Textarea
                id="competitorAnalysis"
                placeholder="Опишите что вам нравится в работе конкурентов"
                value={formData.competitorAnalysis}
                onChange={(e) => setFormData(prev => ({ ...prev, competitorAnalysis: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            {/* Подсказка о возможности пропуска */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <MessageCircle className="text-blue-400" size={20} />
                <p className="text-blue-200 text-sm">
                  <strong>Важная информация:</strong> Чем точнее укажете требования, тем лучше будет расчет. Но можно пропустить и обсудить с менеджером.
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>Сколько лидов вам нужно в месяц?</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { value: "50-100", label: "50-100 лидов" },
                  { value: "100-300", label: "100-300 лидов" },
                  { value: "300-500", label: "300-500 лидов" },
                  { value: "500-1000", label: "500-1000 лидов" },
                  { value: "1000+", label: "Свыше 1000 лидов" },
                  { value: "custom", label: "Другое количество" }
                ].map((option) => (
                  <motion.div
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant={formData.leadCount === option.value ? "default" : "outline"}
                      onClick={() => setFormData(prev => ({ ...prev, leadCount: option.value }))}
                      className={`w-full p-4 h-auto text-left ${
                        formData.leadCount === option.value 
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' 
                          : 'hover:border-orange-500/50'
                      }`}
                    >
                      {option.label}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leadRegion">В каком регионе нужны лиды?</Label>
              <Input
                id="leadRegion"
                placeholder="Например: Москва, Санкт-Петербург, вся Россия"
                value={formData.leadRegion}
                onChange={(e) => setFormData(prev => ({ ...prev, leadRegion: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leadBudget">Бюджет на лидогенерацию в месяц</Label>
              <div className="relative">
                <Select 
                  value={formData.leadBudget} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, leadBudget: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите бюджет" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto bg-gray-900/95 backdrop-blur-sm border-gray-700 text-white">
                    <SelectItem value="50k-100k" className="bg-gray-900 hover:bg-gray-800 text-white focus:bg-gray-800">💰 50 000 - 100 000₽</SelectItem>
                    <SelectItem value="100k-200k" className="bg-gray-900 hover:bg-gray-800 text-white focus:bg-gray-800">💎 100 000 - 200 000₽</SelectItem>
                    <SelectItem value="200k-500k" className="bg-gray-900 hover:bg-gray-800 text-white focus:bg-gray-800">🏆 200 000 - 500 000₽</SelectItem>
                    <SelectItem value="500k-1m" className="bg-gray-900 hover:bg-gray-800 text-white focus:bg-gray-800">💼 500 000 - 1 000 000₽</SelectItem>
                    <SelectItem value="over-1m" className="bg-gray-900 hover:bg-gray-800 text-white focus:bg-gray-800">👑 Свыше 1 000 000₽</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            {/* Подсказка о возможности пропуска */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <MessageCircle className="text-blue-400" size={20} />
                <p className="text-blue-200 text-sm">
                  <strong>Дополнительные услуги:</strong> Выберите что вам нужно помимо лидов. Это поможет сразу включить все в расчет.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-300 text-lg">
                Какие дополнительные услуги вас интересуют?
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="needCalls"
                  checked={formData.needCalls}
                  onChange={(e) => setFormData(prev => ({ ...prev, needCalls: e.target.checked }))}
                  className="w-5 h-5 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
                />
                <Label htmlFor="needCalls" className="flex-1">
                  <div>
                    <p className="font-medium">☎️ Обзвон лидов нашими операторами</p>
                    <p className="text-sm text-gray-400">Наш колл-центр обзвонит всех лидов и предварит их о вашем звонке</p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="needAnalytics"
                  checked={formData.needAnalytics}
                  onChange={(e) => setFormData(prev => ({ ...prev, needAnalytics: e.target.checked }))}
                  className="w-5 h-5 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
                />
                <Label htmlFor="needAnalytics" className="flex-1">
                  <div>
                    <p className="font-medium">📊 Подробная аналитика и отчеты</p>
                    <p className="text-sm text-gray-400">Детальные отчеты по конверсии, источникам, качеству лидов</p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="needConsultation"
                  checked={formData.needConsultation}
                  onChange={(e) => setFormData(prev => ({ ...prev, needConsultation: e.target.checked }))}
                  className="w-5 h-5 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
                />
                <Label htmlFor="needConsultation" className="flex-1">
                  <div>
                    <p className="font-medium">💡 Персональная консультация по воронке продаж</p>
                    <p className="text-sm text-gray-400">Консультация маркетолога по улучшению конверсии</p>
                  </div>
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialRequests">Особые пожелания или требования</Label>
              <Textarea
                id="specialRequests"
                placeholder="Расскажите о любых особых требованиях к лидам или процессу работы"
                value={formData.specialRequests}
                onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="text-green-400" size={20} />
                <p className="text-green-200 text-sm">
                  <strong>Финальный шаг:</strong> Укажите бюджет и желаемые сроки запуска.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-300 text-lg">
                Последние детали для точного расчета стоимости
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyBudget">Общий месячный бюджет на маркетинг</Label>
              <div className="relative">
                <Select 
                  value={formData.monthlyBudget} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, monthlyBudget: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите бюджет" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto bg-gray-900/95 backdrop-blur-sm border-gray-700 text-white">
                    <SelectItem value="under-100k" className="bg-gray-900 hover:bg-gray-800 text-white focus:bg-gray-800">💰 До 100 000₽</SelectItem>
                    <SelectItem value="100k-300k" className="bg-gray-900 hover:bg-gray-800 text-white focus:bg-gray-800">💎 100 000 - 300 000₽</SelectItem>
                    <SelectItem value="300k-500k" className="bg-gray-900 hover:bg-gray-800 text-white focus:bg-gray-800">🏆 300 000 - 500 000₽</SelectItem>
                    <SelectItem value="500k-1m" className="bg-gray-900 hover:bg-gray-800 text-white focus:bg-gray-800">💼 500 000 - 1 000 000₽</SelectItem>
                    <SelectItem value="over-1m" className="bg-gray-900 hover:bg-gray-800 text-white focus:bg-gray-800">👑 Свыше 1 000 000₽</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Когда планируете начать?</Label>
              <div className="relative">
                <Select 
                  value={formData.startDate} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, startDate: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите сроки" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto bg-gray-900/95 backdrop-blur-sm border-gray-700 text-white">
                    <SelectItem value="asap" className="bg-gray-900 hover:bg-gray-800 text-white focus:bg-gray-800">🚀 Как можно скорее</SelectItem>
                    <SelectItem value="this-week" className="bg-gray-900 hover:bg-gray-800 text-white focus:bg-gray-800">📅 На этой неделе</SelectItem>
                    <SelectItem value="this-month" className="bg-gray-900 hover:bg-gray-800 text-white focus:bg-gray-800">📆 В этом месяце</SelectItem>
                    <SelectItem value="next-month" className="bg-gray-900 hover:bg-gray-800 text-white focus:bg-gray-800">⏭️ В следующем месяце</SelectItem>
                    <SelectItem value="later" className="bg-gray-900 hover:bg-gray-800 text-white focus:bg-gray-800">⏰ Позже</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-xl p-4">
              <p className="text-orange-200 text-sm">
                <strong>Готово!</strong> Нажмите "Отправи��ь заявку" и наш менеджер свяжется с вами в течение 30 минут для обсуждения деталей и персонального предложения.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Show widget first
  if (showWidget) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-4 sm:py-8 px-2 sm:px-4 flex items-center justify-center pb-safe-bottom">
        <div className="w-full max-w-2xl mx-auto">
          <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700 shadow-2xl rounded-2xl sm:rounded-3xl">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <SkipStepsWidget onContinueWithManager={handleContinueWithManager} onContinueForm={handleContinueForm} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const IconComponent = stepIcons[currentStep - 1];
  const progress = (currentStep / 7) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-4 sm:py-8 px-2 sm:px-4 pb-safe-bottom">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700 shadow-2xl rounded-2xl sm:rounded-3xl">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="text-gray-400 hover:text-white p-2 sm:p-3"
                  size="sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Назад</span>
                </Button>
                <div className="text-xs sm:text-sm text-gray-400">
                  Шаг {currentStep} из 7
                </div>
              </div>

              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-orange-500/20 rounded-lg flex-shrink-0">
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl text-white font-semibold leading-tight">
                    {currentStep === 1 && "Отрасль бизнеса"}
                    {currentStep === 2 && "Контактные данные"}
                    {currentStep === 3 && "Целевая аудитория"}
                    {currentStep === 4 && "Конкуренты"}
                    {currentStep === 5 && "Потребности в лидах"}
                    {currentStep === 6 && "Дополнительные услуги"}
                    {currentStep === 7 && "Бюджет и сроки"}
                  </h2>
                </div>
              </div>

              <Progress value={progress} className="h-2" />
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-700 gap-3 sm:gap-0">
              <div className="flex justify-center sm:justify-start">
                {currentStep > 2 && (
                  <Button
                    variant="outline"
                    onClick={handleSkip}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 px-4 py-2 sm:px-6 sm:py-3"
                    size="sm"
                  >
                    <SkipForward className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="text-sm sm:text-base">Пропустить</span>
                  </Button>
                )}
              </div>

              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto text-base sm:text-lg font-semibold"
              >
                {currentStep === 7 ? 'Отправить заявку' : 'Далее'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}