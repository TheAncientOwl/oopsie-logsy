/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file CheckBox.tsx
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description CheckBox UI element.
 */

import { Checkbox as ChakraCheckbox, CheckboxRootProps } from '@chakra-ui/react';
import React, { PropsWithChildren } from 'react';

interface CheckBoxProps extends PropsWithChildren, CheckboxRootProps {}

export const CheckBox: React.FC<CheckBoxProps> = props => {
  return (
    <ChakraCheckbox.Root cursor='pointer' variant='subtle' colorPalette='green' {...props}>
      <ChakraCheckbox.HiddenInput />
      <ChakraCheckbox.Control>
        <ChakraCheckbox.Indicator />
      </ChakraCheckbox.Control>
      <ChakraCheckbox.Label>{props.children}</ChakraCheckbox.Label>
    </ChakraCheckbox.Root>
  );
};
