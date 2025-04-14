/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file ChannelSliders.tsx
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description ColorPicker with channel sliders.
 */

import {
  ColorPicker,
  ColorPickerValueChangeDetails,
  For,
  Portal,
  Stack,
  getColorChannels,
  parseColor,
} from '@chakra-ui/react';
import React from 'react';

interface ChannelSliderProps {
  format: ColorPicker.ColorFormat;
}

export const ChannelSliders: React.FC<ChannelSliderProps> = props => {
  const channels = getColorChannels(props.format);

  return (
    <ColorPicker.View format={props.format}>
      <For each={channels}>
        {channel => (
          <Stack gap='1' key={channel}>
            <ColorPicker.ChannelText minW='5ch'>{channel}</ColorPicker.ChannelText>
            <ColorPicker.ChannelSlider channel={channel} />
          </Stack>
        )}
      </For>
    </ColorPicker.View>
  );
};

interface ChannelSliderPickerProps {
  defaultValue: string;
  onValueChange?: (details: ColorPickerValueChangeDetails) => void;
  onValueChangeEnd: (details: ColorPickerValueChangeDetails) => void;
}

export const ChannelSlidersPicker: React.FC<ChannelSliderPickerProps> = props => {
  return (
    <ColorPicker.Root
      defaultValue={parseColor(props.defaultValue)}
      onValueChangeEnd={props.onValueChangeEnd}
      onValueChange={props.onValueChange}
    >
      <ColorPicker.Control>
        <ColorPicker.Trigger cursor='pointer' />
      </ColorPicker.Control>
      <Portal>
        <ColorPicker.Positioner>
          <ColorPicker.Content zIndex='99999999'>
            <ColorPicker.FormatSelect />
            <ChannelSliders format='hsla' />
            <ChannelSliders format='hsba' />
            <ChannelSliders format='rgba' />
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </Portal>
    </ColorPicker.Root>
  );
};
