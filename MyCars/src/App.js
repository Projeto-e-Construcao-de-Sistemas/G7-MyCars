import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap';
import { AppRoutes } from './routes/appRouter';
import { AuthenticationProvider } from './context/authenticationContext';
import React, { createContext, useState } from 'react';

export const ThemeContext = createContext(null);

function App() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"))
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
