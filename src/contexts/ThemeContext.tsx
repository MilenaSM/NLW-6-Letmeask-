import { useEffect } from "react";
import { useState } from "react";
import { createContext, ReactNode } from "react";

type Theme = 'ligth' | 'dark';

type ThemeContextProviderProps = {
  children: ReactNode;
}

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext({} as ThemeContextType);

export function ThemeContextProvider(props: ThemeContextProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const storageTheme = localStorage.getItem('theme')

    return (storageTheme ?? 'ligth') as Theme;
  });

  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme])

  function toggleTheme() {
    setCurrentTheme(currentTheme === 'ligth' ? 'dark' : 'ligth');
  }

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
} 