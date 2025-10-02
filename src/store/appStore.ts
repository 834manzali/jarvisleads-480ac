import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { AppState, AppEvent, Screen, LeadFormData } from '../types';

// Load saved settings from localStorage
const loadSavedSettings = () => {
  try {
    const saved = localStorage.getItem('jarvis-leads-settings');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load saved settings:', error);
  }
  return {
    theme: 'dark',
    language: 'ru',
    showOfferPopup: true,
    offerDismissed: false
  };
};

// Save settings to localStorage
const saveSettings = (settings: any) => {
  try {
    localStorage.setItem('jarvis-leads-settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

// Load saved lead form data from localStorage
const loadSavedLeadForm = (): LeadFormData => {
  try {
    const saved = localStorage.getItem('jarvis-leads-form-data');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load saved lead form data:', error);
  }
  return { step: 1 };
};

// Save lead form data to localStorage
const saveLeadFormData = (data: LeadFormData) => {
  try {
    localStorage.setItem('jarvis-leads-form-data', JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save lead form data:', error);
  }
};

const initialState: AppState = {
  currentScreen: 'landing',
  settings: loadSavedSettings(),
  loading: false,
  leadFormData: loadSavedLeadForm()
};

interface AppStore extends AppState {
  dispatch: (event: AppEvent) => void;
  
  // Helper methods
  navigateToScreen: (screen: Screen) => void;
  updateSettings: (settings: Partial<AppState['settings']>) => void;
  updateLeadForm: (data: Partial<LeadFormData>) => void;
  resetLeadForm: () => void;
  submitLeadForm: (data: LeadFormData) => Promise<void>;
}

const AppContext = createContext<AppStore | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  // Initialize app
  useEffect(() => {
    // Apply dark theme by default
    document.documentElement.classList.add('dark');
    
    // Load Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const dispatch = useCallback((event: AppEvent) => {
    setState(currentState => {
      switch (event.type) {
        case 'NAVIGATE_TO_SCREEN':
          return { 
            ...currentState, 
            currentScreen: event.screen
          };
          
        case 'UPDATE_SETTINGS':
          const newSettings = { ...currentState.settings, ...event.settings };
          saveSettings(newSettings);
          return { 
            ...currentState,
            settings: newSettings
          };
          
        case 'SET_LOADING':
          return { ...currentState, loading: event.loading };
          
        case 'SET_ERROR':
          return { ...currentState, error: event.error };
          
        case 'UPDATE_LEAD_FORM':
          const updatedFormData = { ...currentState.leadFormData, ...event.data };
          saveLeadFormData(updatedFormData);
          return {
            ...currentState,
            leadFormData: updatedFormData
          };
          
        case 'RESET_LEAD_FORM':
          const resetFormData = { step: 1 };
          saveLeadFormData(resetFormData);
          return {
            ...currentState,
            leadFormData: resetFormData
          };
          
        case 'SUBMIT_LEAD_FORM':
          // Form submission is handled in submitLeadForm method
          return currentState;
          
        default:
          return currentState;
      }
    });
  }, []);

  // Helper methods
  const navigateToScreen = useCallback((screen: Screen) => {
    dispatch({ type: 'NAVIGATE_TO_SCREEN', screen });
  }, [dispatch]);

  const updateSettings = useCallback((settings: Partial<AppState['settings']>) => {
    dispatch({ type: 'UPDATE_SETTINGS', settings });
  }, [dispatch]);

  const updateLeadForm = useCallback((data: Partial<LeadFormData>) => {
    dispatch({ type: 'UPDATE_LEAD_FORM', data });
  }, [dispatch]);

  const resetLeadForm = useCallback(() => {
    dispatch({ type: 'RESET_LEAD_FORM' });
  }, [dispatch]);

  const submitLeadForm = useCallback(async (data: LeadFormData): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', loading: true });
      
      // Format message for Telegram
      const message = `🎯 Новая заявка Jarvis Leads!

📋 Данные компании:
• Компания: ${data.company || 'Не указано'}
• Сфера: ${data.industry || 'Не указано'}
• Целевая аудитория: ${data.targetAudience || 'Не указано'}

💰 Бюджет и цели:
• Бюджет: ${data.budget || 'Не указано'}
• Цели: ${data.goals || 'Не указано'}
• Временные рамки: ${data.timeline || 'Не указано'}

📞 Контактная информация:
• Имя: ${data.name || 'Не указано'}
• Телефон: ${data.phone || 'Не указано'}
• Email: ${data.email || 'Не указано'}

📝 Дополнительная информация:
${data.additionalInfo || 'Не указано'}

🤖 Отправлено: ${new Date().toLocaleString('ru-RU')}`;

      // Send to Telegram bot
      const botToken = 'YOUR_BOT_TOKEN'; // Замените на реальный токен
      const chatId = 'YOUR_CHAT_ID'; // Замените на реальный chat ID
      
      // For now, we'll just log the message since we don't have real Telegram credentials
      console.log('Отправка заявки в Telegram:', message);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      console.log('Заявка успешно отправлена!');
      
      // Reset form after successful submission
      dispatch({ type: 'RESET_LEAD_FORM' });
      
      // Navigate back to landing
      dispatch({ type: 'NAVIGATE_TO_SCREEN', screen: 'landing' });
      
    } catch (error) {
      console.error('Ошибка отправки заявки:', error);
      dispatch({ type: 'SET_ERROR', error: 'Ошибка отправки заявки. Попробуйте еще раз.' });
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  }, [dispatch]);

  const store: AppStore = {
    ...state,
    dispatch,
    navigateToScreen,
    updateSettings,
    updateLeadForm,
    resetLeadForm,
    submitLeadForm
  };

  return (
    <AppContext.Provider value={store}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore(): AppStore {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within AppProvider');
  }
  return context;
}