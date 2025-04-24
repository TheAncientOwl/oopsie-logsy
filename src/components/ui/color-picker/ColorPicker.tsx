/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file ColorPicker.tsx
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description ColorPicker with box.
 */

import {
  ColorPicker as ChakraColorPicker,
  ColorPickerValueChangeDetails,
  Heading,
  HStack,
  parseColor,
  Portal,
  Stack,
} from '@chakra-ui/react';
import React from 'react';

type TBoxColorPickerProps = {
  label?: string;
  defaultValue: string;
  onValueChange?: (details: ColorPickerValueChangeDetails) => void;
  onValueChangeEnd: (details: ColorPickerValueChangeDetails) => void;
};

export const ColorPicker: React.FC<TBoxColorPickerProps> = props => {
  return (
    <ChakraColorPicker.Root
      defaultValue={parseColor(props.defaultValue)}
      onValueChange={props.onValueChange}
      onValueChangeEnd={props.onValueChangeEnd}
      positioning={{ placement: 'bottom' }}
    >
      <ChakraColorPicker.HiddenInput />
      <ChakraColorPicker.Control>
        <ChakraColorPicker.Trigger cursor='pointer' />
      </ChakraColorPicker.Control>
      <Portal>
        <ChakraColorPicker.Positioner>
          <ChakraColorPicker.Content zIndex='99999999'>
            {props.label ? <Heading size='md'>{props.label}</Heading> : <></>}
            <ChakraColorPicker.Area />
            <Stack>
              <HStack>
                <ChakraColorPicker.EyeDropper size='xs' variant='outline' />
                <ChakraColorPicker.Sliders />
              </HStack>
              <ChakraColorPicker.Input />
            </Stack>
          </ChakraColorPicker.Content>
        </ChakraColorPicker.Positioner>
      </Portal>
    </ChakraColorPicker.Root>
  );
};
