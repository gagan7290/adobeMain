import { createContext, useEffect, useState, useContext } from "react";


const ThemeContext = createContext();


export const ThemeProvider = ({children}) => {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const root = window.document.documentElement;
        console.log("theme changed!!!")
        if (theme === 'workspaceTheme') {
          root.setAttribute('data-theme', 'workspaceTheme');
        } else {
          root.removeAttribute('data-theme');
        }
      }, [theme]);

      const value = { theme, setTheme };

      return (
        <ThemeContext.Provider value={value}>
          {children}
        </ThemeContext.Provider>
      );

}

export const useTheme = () => {
    return useContext(ThemeContext);
  };