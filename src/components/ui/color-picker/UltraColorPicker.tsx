/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file UltraColorPicker.tsx
 * @author Alexandru Delegeanu
 * @version 0.11
 * @description ColorPicker with basic box, defaults and color filters.
 */

import {
  ColorPicker,
  ColorPickerValueChangeDetails,
  HStack,
  Icon,
  parseColor,
  Tabs,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { StarIcon, StarsFormation, StarsIcon } from '../icons';
import { ChannelSliders } from './ChannelSlidersPicker';
import { TColorPalette } from '@/store/theme/data';

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
              <ColorPicker.SwatchIndicator boxSize='3' bgColor='white' />
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
  zIndex?: number | string;
  colorPalette: TColorPalette;
};

export const UltraColorPicker: React.FC<TUltraColorPickerProps> = props => {
  const [activeTab, setActiveTab] = useState<'presets' | 'picker' | 'channels'>('presets');

  const handleOnValueChange = (details: ColorPickerValueChangeDetails) => {
    if (activeTab === 'presets') {
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
      colorPalette={props.colorPalette}
    >
      <ColorPicker.HiddenInput />
      <ColorPicker.Control>
        <ColorPicker.Trigger cursor='pointer' />
      </ColorPicker.Control>
      <ColorPicker.Positioner>
        <ColorPicker.Content minWidth='350px' zIndex={props.zIndex}>
          <HStack>
            <ColorPicker.Label>{props.label}</ColorPicker.Label>
            <ColorPicker.Input colorPalette={props.colorPalette} />
          </HStack>

          <Tabs.Root variant='line' value={activeTab} colorPalette={props.colorPalette}>
            <HStack>
              <Tabs.Trigger value='presets' onClick={() => setActiveTab('presets')}>
                <HStack>
                  <Icon as={StarIcon} />
                  Presets
                </HStack>
              </Tabs.Trigger>
              <Tabs.Trigger value='picker' onClick={() => setActiveTab('picker')}>
                <HStack>
                  <Icon as={StarsFormation} />
                  Picker
                </HStack>
              </Tabs.Trigger>
              <Tabs.Trigger value='channels' onClick={() => setActiveTab('channels')}>
                <HStack>
                  <Icon as={StarsIcon} />
                  Channels
                </HStack>
              </Tabs.Trigger>
            </HStack>

            <Tabs.Content value='presets'>
              <PresetsPicker />
            </Tabs.Content>
            <Tabs.Content value='picker'>
              <SimplePicker />
            </Tabs.Content>
            <Tabs.Content value='channels'>
              <SliderPicker />
            </Tabs.Content>
          </Tabs.Root>
        </ColorPicker.Content>
      </ColorPicker.Positioner>
    </ColorPicker.Root>
  );
};
