import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { MotionConfig } from 'framer-motion';
import { store } from './store/store';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/shared/ErrorBoundary';
import App from './App.jsx';
import './styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 10000 },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>
              <ThemeProvider>
                <AuthProvider>
                  <App />
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      duration: 3500,
                      style: {
                        borderRadius: '14px',
                        fontSize: '14px',
                        fontFamily: 'Inter, sans-serif',
                        background: 'var(--toast-bg, #ffffff)',
                        color: 'var(--toast-color, #12211E)',
                        boxShadow: '0 8px 24px rgba(12, 33, 30, 0.12)',
                        padding: '12px 16px',
                      },
                      success: {
                        iconTheme: { primary: '#0F766E', secondary: '#ffffff' },
                        style: { border: '1px solid #B4E7DD' },
                      },
                      error: {
                        iconTheme: { primary: '#E11D48', secondary: '#ffffff' },
                        style: { border: '1px solid #FECDD1' },
                      },
                    }}
                  />
                </AuthProvider>
              </ThemeProvider>
            </QueryClientProvider>
          </Provider>
        </BrowserRouter>
      </MotionConfig>
    </ErrorBoundary>
  </StrictMode>
);
