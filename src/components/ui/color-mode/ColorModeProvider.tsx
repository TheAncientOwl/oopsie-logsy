/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file ColorModeProvider.tsx
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description ChakraUI color mode provider
 */

import { ThemeProvider, type ThemeProviderProps } from 'next-themes';

export interface ColorModeProviderProps extends ThemeProviderProps {}

export function ColorModeProvider(props: ColorModeProviderProps) {
  return <ThemeProvider attribute='class' disableTransitionOnChange {...props} />;
}
