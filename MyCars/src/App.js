import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap';
import { AppRoutes } from './routes/appRouter';
import { AuthenticationProvider } from './context/authenticationContext';
import React, { createContext, useState } from 'react';
import NotificationWrapper from './components/Notification/NotificationWrapper';
import { NotificationContext, NotificationProvider } from './components/Notification/NotificationContext';

export const ThemeContext = createContext(null);

function App() {
  localStorage.setItem("theme", (!localStorage.getItem("theme")) ? "light" : localStorage.getItem("theme"));
  const [theme, setTheme] = useState(localStorage.getItem("theme"));

  document.body.id = theme;
  const toggleTheme = () => {
    setTheme((curr) => (curr === "dark" ? "light" : "dark"));
    const themeInverted = (theme === "light") ? "dark" : "light";
    localStorage.setItem("theme", themeInverted);
    document.body.id = themeInverted;
  }



  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className='App' id={theme}>
        <NotificationProvider>
          <AuthenticationProvider>
            <AppRoutes />
          </AuthenticationProvider>
          <NotificationWrapper />
        </NotificationProvider>
      </div>
    </ThemeContext.Provider>

  );
}

export default App;
