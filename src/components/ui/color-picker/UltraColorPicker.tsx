/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file UltraColorPicker.tsx
 * @author Alexandru Delegeanu
 * @version 0.6
 * @description ColorPicker with basic box, defaults and color filters.
 */

import {
  Collapsible,
  ColorPicker,
  ColorPickerValueChangeDetails,
  Heading,
  HStack,
  Icon,
  parseColor,
  Portal,
} from '@chakra-ui/react';
import React, { PropsWithChildren, useState } from 'react';
import { IconType } from 'react-icons';
import { StarIcon, StarsFormation, StarsIcon } from '../Icons';
import { ChannelSliders } from './ChannelSlidersPicker';

const swatches: Array<ColorPickerValueChangeDetails> = [
  'red',
  'orange',
  'yellow',
  'green',
  'dodgerblue',
  'purple',
  'violet',
  'white',
  'gray',
  'black',
].map(colorString => ({ value: parseColor(colorString), valueAsString: colorString }));

enum EUltraColorPickerState {
  Presets,
  Simple,
  Advanced,
}

type TPickerStateProps = PropsWithChildren & {
  open: boolean;
  defaultOpen: boolean;
  onActivate: () => void;
  label: string;
  icon: IconType;
};

const UltraPickerState: React.FC<TPickerStateProps> = props => {
  return (
    <Collapsible.Root defaultOpen={true} open={props.open}>
      <Collapsible.Trigger cursor='pointer' onClick={props.onActivate} width='100%'>
        <HStack>
          <Icon as={props.icon} />
          <Heading size='md' fontWeight={props.open ? 'bold' : 'normal'}>
            {props.label}
          </Heading>
        </HStack>
      </Collapsible.Trigger>
      <Collapsible.Content>{props.children}</Collapsible.Content>
    </Collapsible.Root>
  );
};

const PresetsPicker: React.FC = () => {
  return (
    <>
      <ColorPicker.SwatchGroup>
        {swatches.map(item => (
          <ColorPicker.SwatchTrigger
            key={item.valueAsString}
            mt='10px'
            value={item.valueAsString}
            cursor='pointer'
          >
            <ColorPicker.Swatch value={item.valueAsString}>
              <ColorPicker.SwatchIndicator boxSize='3' bg='white' />
            </ColorPicker.Swatch>
          </ColorPicker.SwatchTrigger>
        ))}
      </ColorPicker.SwatchGroup>
    </>
  );
};

const SimplePicker: React.FC = () => {
  return (
    <>
      <ColorPicker.Area mt='10px' cursor='pointer' />
      <HStack>
        <ColorPicker.EyeDropper size='xs' variant='outline' />
        <ColorPicker.Sliders cursor='pointer' />
      </HStack>
    </>
  );
};

const SliderPicker: React.FC = () => {
  return (
    <>
      <ColorPicker.FormatSelect mt='10px' />
      <ChannelSliders format='hsla' />
      <ChannelSliders format='hsba' />
      <ChannelSliders format='rgba' />
    </>
  );
};

type TUltraColorPickerProps = {
  label: string;
  defaultValue: string;
  onValueChange: (details: ColorPickerValueChangeDetails) => void;
  onValueChangeEnd: (details: ColorPickerValueChangeDetails) => void;
};

export const UltraColorPicker: React.FC<TUltraColorPickerProps> = props => {
  const [pickerState, setPickerState] = useState(EUltraColorPickerState.Presets);

  const setSimpleState = () => {
    setPickerState(EUltraColorPickerState.Simple);
  };

  const setPresetsState = () => {
    setPickerState(EUltraColorPickerState.Presets);
  };

  const setAdvancedState = () => {
    setPickerState(EUltraColorPickerState.Advanced);
  };

  const handleOnValueChange = (details: ColorPickerValueChangeDetails) => {
    if (pickerState === EUltraColorPickerState.Presets) {
      props.onValueChange(details);
      props.onValueChangeEnd(details);
    } else {
      props.onValueChange(details);
    }
  };

  return (
    <ColorPicker.Root
      defaultValue={parseColor(props.defaultValue)}
      onValueChange={handleOnValueChange}
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

            <UltraPickerState
              label='Presets'
              icon={StarIcon}
              open={pickerState === EUltraColorPickerState.Presets}
              defaultOpen={false}
              onActivate={setPresetsState}
            >
              <PresetsPicker />
            </UltraPickerState>

            <UltraPickerState
              label='Simple'
              icon={StarsFormation}
              open={pickerState === EUltraColorPickerState.Simple}
              defaultOpen={true}
              onActivate={setSimpleState}
            >
              <SimplePicker />
            </UltraPickerState>

            <UltraPickerState
              label='Advanced'
              icon={StarsIcon}
              open={pickerState === EUltraColorPickerState.Advanced}
              defaultOpen={false}
              onActivate={setAdvancedState}
            >
              <SliderPicker />
            </UltraPickerState>
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </Portal>
    </ColorPicker.Root>
  );
};
