import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Use a single state to manage the theme
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Function to toggle the theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Effect to apply the theme to the root HTML element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the context easily
export const useTheme = () => useContext(ThemeContext);
