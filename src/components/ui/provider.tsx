/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file provider.tsx
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description ChakraUI provider utility
 */

'use client';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ColorModeProvider, type ColorModeProviderProps } from './color-mode';

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
