import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('app-theme') || 'default';
    });

    useEffect(() => {
        // Remove existing theme classes
        document.documentElement.classList.remove('theme-dark', 'theme-gradient');
        document.body.classList.remove('theme-dark', 'theme-gradient');
        
        // Add current theme class if not default
        if (theme !== 'default') {
            document.documentElement.classList.add(`theme-${theme}`);
            document.body.classList.add(`theme-${theme}`);
        }
        
        // Save to local storage
        localStorage.setItem('app-theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
