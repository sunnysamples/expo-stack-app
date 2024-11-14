import { vars } from 'nativewind';

const lightTheme = vars({
  '--foreground': '0 0 0',
  '--background': '255 255 255',
  '--input-disabled': '211 211 211',
  '--text-sm': '0.875rem',
  '--text-base': '1rem',
  '--text-lg': '1.125rem',
  '--text-xl': '1.25rem',
  '--font-normal': '400',
  '--font-medium': '500',
  '--font-bold': '700',
});

const darkTheme = vars({
  '--foreground': '255 255 255',
  '--background': '0 0 0',
  '--input-disabled': '105 105 105',
  '--text-sm': '0.875rem',
  '--text-base': '1rem',
  '--text-lg': '1.125rem',
  '--text-xl': '1.25rem',
  '--font-normal': '400',
  '--font-medium': '500',
  '--font-bold': '700',
});

const brandTheme = vars({
  '--foreground': '#1a202c',
  '--background': '#edf2f7',
  '--text-sm': '0.875rem',
  '--text-base': '1rem',
  '--text-lg': '1.125rem',
  '--text-xl': '1.25rem',
  '--font-normal': '400',
  '--font-medium': '500',
  '--font-bold': '700',
});

const christmasTheme = vars({
  '--foreground': '255 0 0',
  '--background': '0 255 0',
  '--input-disabled': '192 192 192',
  '--text-sm': '0.875rem',
  '--text-base': '1rem',
  '--text-lg': '1.125rem',
  '--text-xl': '1.25rem',
  '--font-normal': '400',
  '--font-medium': '500',
  '--font-bold': '700',
});

export { lightTheme, darkTheme, brandTheme, christmasTheme };
