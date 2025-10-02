import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { SevenStepLeadForm } from '../components/SevenStepLeadForm';


import { CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { motion } from 'motion/react';

export function LeadGenScreen() {
  const { navigateToScreen } = useAppStore();
  const [isFormCompleted, setIsFormCompleted] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);

  const handleFormComplete = (formData: any) => {
    setSubmittedData(formData);
    setIsFormCompleted(true);
  };

  const handleBackToLanding = () => {
    navigateToScreen('landing');
  };

  if (isFormCompleted) {
    return (
      <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full"
        >
          <Card className="bg-gradient-to-br from-gray-900/95 to-black/95 border-2 border-green-500/30 rounded-3xl">
            <CardContent className="p-8 text-center space-y-6">
              <motion.div
                className="flex justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle size={40} className="text-green-400" />
                </div>
              </motion.div>

              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white">
                  Заявка отправлена!
                </h2>
                <p className="text-gray-300 text-lg">
                  Спасибо за доверие! Мы свяжемся с вами в ближайшее время для обсуждения деталей проекта.
                </p>
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                  <p className="text-orange-200 text-sm">
                    <strong>Важно:</strong> Проверьте указанный телефон и email - наш менеджер свяжется с вами в течение 2 часов.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-gray-400 text-sm">
                  Контакт: <span className="text-white font-medium">{submittedData?.fullName}</span>
                </p>
                <p className="text-gray-400 text-sm">
                  Email: <span className="text-white font-medium">{submittedData?.email}</span>
                </p>
                <p className="text-gray-400 text-sm">
                  Телефон: <span className="text-white font-medium">{submittedData?.phone}</span>
                </p>
              </div>

              <Button
                onClick={handleBackToLanding}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-300"
              >
                Вернуться на главную
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">

      

      
      <SevenStepLeadForm 
        onComplete={handleFormComplete}
        onBack={handleBackToLanding}
      />
    </div>
  );
}