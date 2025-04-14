/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file UltraColorPicker.tsx
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description ColorPicker with basic box, defaults and color filters.
 */

import {
  Collapsible,
  ColorPicker,
  ColorPickerValueChangeDetails,
  Heading,
  HStack,
  parseColor,
  Portal,
} from '@chakra-ui/react';
import React, { PropsWithChildren, useCallback, useState } from 'react';
import { StarIcon, StarsFormation, StarsIcon } from '../Icons';
import { ChannelSliders } from './ChannelSlidersPicker';

interface BoxColorPickerProps {
  label?: string;
  defaultValue: string;
  onValueChange?: (details: ColorPickerValueChangeDetails) => void;
  onValueChangeEnd: (details: ColorPickerValueChangeDetails) => void;
}

const swatches = ['red', 'orange', 'yellow', 'lime', 'blue', 'indigo', 'violet'];

enum EPickerState {
  Simple,
  Defaults,
  Advanced,
}

interface PickerStateProps extends PropsWithChildren {
  open: boolean;
  defaultOpen: boolean;
  onActivate: () => void;
  label: string;
  icon: () => React.ReactNode;
}

const PickerState: React.FC<PickerStateProps> = props => {
  return (
    <Collapsible.Root defaultOpen={true} open={props.open}>
      <Collapsible.Trigger cursor='pointer' onClick={props.onActivate}>
        <HStack>
          {props.icon()}
          <Heading size='md' fontWeight={props.open ? 'bold' : 'normal'}>
            {props.label}
          </Heading>
        </HStack>
      </Collapsible.Trigger>
      <Collapsible.Content>{props.children}</Collapsible.Content>
    </Collapsible.Root>
  );
};

export const UltraColorPicker: React.FC<BoxColorPickerProps> = props => {
  const [pickerState, setPickerState] = useState(EPickerState.Simple);

  const setSimpleState = useCallback(() => {
    setPickerState(EPickerState.Simple);
  }, [setPickerState]);

  const setDefaultsState = useCallback(() => {
    setPickerState(EPickerState.Defaults);
  }, [setPickerState]);

  const setAdvancedState = useCallback(() => {
    setPickerState(EPickerState.Advanced);
  }, [setPickerState]);

  return (
    <ColorPicker.Root
      defaultValue={parseColor(props.defaultValue)}
      onValueChange={props.onValueChange}
      onValueChangeEnd={props.onValueChangeEnd}
      positioning={{ placement: 'bottom' }}
    >
      <ColorPicker.HiddenInput />
      <ColorPicker.Control>
        <ColorPicker.Trigger cursor='pointer' />
      </ColorPicker.Control>
      <Portal>
        <ColorPicker.Positioner>
          <ColorPicker.Content zIndex='99999999'>
            <HStack>
              <ColorPicker.Label>{props.label}</ColorPicker.Label>
              <ColorPicker.Input colorPalette='green' />
            </HStack>

            <PickerState
              label='Simple'
              icon={StarIcon}
              open={pickerState === EPickerState.Simple}
              defaultOpen={true}
              onActivate={setSimpleState}
            >
              <ColorPicker.Area mt='10px' />
              <HStack>
                <ColorPicker.EyeDropper size='xs' variant='outline' />
                <ColorPicker.Sliders />
              </HStack>
            </PickerState>

            <PickerState
              label='Defaults'
              icon={StarsFormation}
              open={pickerState === EPickerState.Defaults}
              defaultOpen={false}
              onActivate={setDefaultsState}
            >
              <ColorPicker.SwatchGroup>
                {swatches.map(item => (
                  <ColorPicker.SwatchTrigger key={item} mt='10px' value={item} cursor='pointer'>
                    <ColorPicker.Swatch value={item}>
                      <ColorPicker.SwatchIndicator boxSize='3' bg='white' />
                    </ColorPicker.Swatch>
                  </ColorPicker.SwatchTrigger>
                ))}
              </ColorPicker.SwatchGroup>
            </PickerState>

            <PickerState
              label='Advanced'
              icon={StarsIcon}
              open={pickerState === EPickerState.Advanced}
              defaultOpen={false}
              onActivate={setAdvancedState}
            >
              <ColorPicker.FormatSelect mt='10px' />
              <ChannelSliders format='hsla' />
              <ChannelSliders format='hsba' />
              <ChannelSliders format='rgba' />
            </PickerState>

            {/* <Collapsible.Root defaultOpen={true} open={boxOpen}>
              <Collapsible.Trigger cursor='pointer' onClick={toggleBoxOpen}>
                <HStack>
                  <StarIcon />
                  <Heading size='md' fontWeight={boxOpen ? 'bold' : 'normal'}>
                    Simple
                  </Heading>
                </HStack>
              </Collapsible.Trigger>
              <Collapsible.Content>
                <ColorPicker.Area mt='10px' />
                <HStack>
                  <ColorPicker.EyeDropper size='xs' variant='outline' />
                  <ColorPicker.Sliders />
                </HStack>
              </Collapsible.Content>
            </Collapsible.Root> */}

            {/* <Collapsible.Root defaultOpen={false} open={!boxOpen}>
              <Collapsible.Trigger cursor='pointer' onClick={toggleBoxOpen}>
                <HStack>
                  <StarsIcon />
                  <Heading size='md' fontWeight={boxOpen ? 'normal' : 'bold'}>
                    Advanced
                  </Heading>
                </HStack>
              </Collapsible.Trigger>
              <Collapsible.Content>
                <ColorPicker.FormatSelect mt='10px' />
                <ChannelSliders format='hsla' />
                <ChannelSliders format='hsba' />
                <ChannelSliders format='rgba' />
              </Collapsible.Content>
            </Collapsible.Root> */}
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </Portal>
    </ColorPicker.Root>
  );
};
