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
import React from 'react';

export type ColorModeProviderProps = ThemeProviderProps;

export const ColorModeProvider: React.FC<ColorModeProviderProps> = props => {
  return <ThemeProvider attribute='class' disableTransitionOnChange {...props} />;
};
