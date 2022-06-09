import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap';
import { AppRoutes } from './routes/appRouter';
import { AuthenticationProvider } from './context/authenticationContext';
import React, { createContext, useState } from 'react';

export const ThemeContext = createContext(null);

function App() {
  localStorage.setItem("theme", (!localStorage.getItem("theme")) ? "light" : localStorage.getItem("theme"));
  const [theme, setTheme] = useState(localStorage.getItem("theme"));

  const toggleTheme = () => {
    setTheme((curr) => (curr === "dark" ? "light"  : "dark"));
    localStorage.setItem("theme", (theme=== "light" ? "dark" : "light"));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className='App' id={theme}>
        <AuthenticationProvider>
          <AppRoutes />
        </AuthenticationProvider>
      </div>
    </ThemeContext.Provider>

  );
}

export default App;
