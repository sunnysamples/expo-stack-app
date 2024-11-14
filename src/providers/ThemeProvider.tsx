import { useColorScheme } from 'nativewind';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { View } from 'react-native';

import { lightTheme, darkTheme, brandTheme, christmasTheme } from '@/theme/themes';

interface ThemeContextType {
  theme: string;
  changeTheme: (themeName: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  changeTheme: (themeName: string) => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState('system');

  const getTheme = () => {
    if (theme === 'system') {
      return colorScheme.colorScheme === 'dark' ? darkTheme : lightTheme;
    }
    switch (theme) {
      case 'light':
        return lightTheme;
      case 'dark':
        return darkTheme;
      case 'brand':
        return brandTheme;
      case 'christmas':
        return christmasTheme;
      default:
        return lightTheme;
    }
  };

  const changeTheme = (themeName: string) => {
    setTheme(themeName);
  };

  useEffect(() => {
    if (theme === 'system') {
      changeTheme('system');
    }
  }, [colorScheme]);

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      <View style={getTheme()} className="flex-1">
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
