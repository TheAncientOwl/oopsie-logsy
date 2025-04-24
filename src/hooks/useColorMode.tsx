/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file useColorMode.tsx
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description Color mode hooks
 */

import { useTheme } from 'next-themes';

export type TColorMode = 'light' | 'dark';

export type TUseColorModeReturn = {
  colorMode: TColorMode;
  setColorMode: (colorMode: TColorMode) => void;
  toggleColorMode: () => void;
};

export const useColorMode = (): TUseColorModeReturn => {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleColorMode = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return {
    colorMode: resolvedTheme as TColorMode,
    setColorMode: setTheme,
    toggleColorMode,
  };
};

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode();
  return colorMode === 'dark' ? dark : light;
}
