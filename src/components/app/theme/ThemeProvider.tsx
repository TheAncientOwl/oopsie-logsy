/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file ThemeProvider.tsx
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description ChakraUI theme provider
 */

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import React, { type PropsWithChildren } from 'react';

type ThemeProviderProps = PropsWithChildren<{}>;

export const ThemeProvider: React.FC<ThemeProviderProps> = props => {
  return (
    <ChakraProvider value={defaultSystem}>
      <NextThemeProvider attribute='class' disableTransitionOnChange children={props.children} />
    </ChakraProvider>
  );
};
