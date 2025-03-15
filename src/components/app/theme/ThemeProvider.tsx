/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file ThemeProvider.tsx
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description ChakraUI theme provider
 */

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { type PropsWithChildren } from 'react';

type ThemeProviderProps = PropsWithChildren<{}>;

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <ChakraProvider value={defaultSystem}>
      <NextThemeProvider attribute='class' disableTransitionOnChange children={children} />
    </ChakraProvider>
  );
};
