/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file ChannelSliders.tsx
 * @author Alexandru Delegeanu
 * @version 0.5
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

type TChannelSliderProps = {
  format: ColorPicker.ColorFormat;
};

export const ChannelSliders: React.FC<TChannelSliderProps> = props => {
  const channels = getColorChannels(props.format);

  return (
    <ColorPicker.View format={props.format}>
      <For each={channels}>
        {channel => (
          <Stack gap='1' key={channel}>
            <ColorPicker.ChannelText minW='5ch'>{channel}</ColorPicker.ChannelText>
            <ColorPicker.ChannelSlider channel={channel} cursor='pointer' />
          </Stack>
        )}
      </For>
    </ColorPicker.View>
  );
};

type TChannelSliderPickerProps = {
  defaultValue: string;
  onValueChange?: (details: ColorPickerValueChangeDetails) => void;
  onValueChangeEnd: (details: ColorPickerValueChangeDetails) => void;
};

export const ChannelSlidersPicker: React.FC<TChannelSliderPickerProps> = props => {
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
          <ColorPicker.Content zIndex={10000}>
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
