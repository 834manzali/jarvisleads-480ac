import { useEffect, Suspense, lazy } from 'react';
import { AppProvider, useAppStore } from './store/appStore';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingFallback } from './components/LoadingFallback';

import { Toaster } from './components/ui/sonner';

// Only load the screens we need
const LandingScreen = lazy(() => import('./screens/LandingScreen').then(module => ({ default: module.LandingScreen })));
const LeadGenScreen = lazy(() => import('./screens/LeadGenScreen').then(module => ({ default: module.LeadGenScreen })));

function AppContent() {
  const { currentScreen, settings } = useAppStore();

  // Apply dark theme by default as per design requirements
  useEffect(() => {
    try {
      // Always use dark theme for AI app aesthetic
      document.documentElement.classList.add('dark');
    } catch (error) {
      console.warn('Theme application failed:', error);
    }
  }, []);

  // Render current screen - only landing and lead generation
  const renderCurrentScreen = () => {
    try {
      switch (currentScreen) {
        case 'leadgen':
          return (
            <Suspense fallback={<LoadingFallback message="Загрузка формы лидогенерации..." />}>
              <LeadGenScreen />
            </Suspense>
          );
        default:
          // Default to landing screen
          return (
            <Suspense fallback={<LoadingFallback message="Загрузка..." />}>
              <LandingScreen />
            </Suspense>
          );
      }
    } catch (error) {
      console.error('Screen rendering error:', error);
      // Fallback to landing screen on error
      return (
        <Suspense fallback={<LoadingFallback message="Загрузка..." />}>
          <LandingScreen />
        </Suspense>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {renderCurrentScreen()}
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}