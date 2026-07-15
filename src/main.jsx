import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/UserContext.jsx';
import { FinanceProvider } from './context/FinanceContext.jsx';
import { ThemeProviderWrapper } from './context/ThemeContext.jsx';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProviderWrapper>
        <UserProvider>
          <FinanceProvider>
            <App />
          </FinanceProvider>
        </UserProvider>
      </ThemeProviderWrapper>
    </BrowserRouter>
  </StrictMode>
);
