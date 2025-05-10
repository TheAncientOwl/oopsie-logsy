/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file ColorPicker.tsx
 * @author Alexandru Delegeanu
 * @version 0.8
 * @description Pick fg/bg colors of logs.
 */

import React from 'react';

import { UltraColorPicker } from '@/components/ui/color-picker/UltraColorPicker';
import { TFilterColors } from '@/store/filters/data';
import { setFilterBg, setFilterFg } from '@/store/filters/handlers';
import { ColorPickerValueChangeDetails, HStack } from '@chakra-ui/react';
import { connect, ConnectedProps } from 'react-redux';
import { TRootState } from '@/store';

type TColorPickerProps = TPropsFromRedux & {
  tabId: string;
  filterId: string;
  defaultColors: TFilterColors;
  onColorChangeFg: (details: ColorPickerValueChangeDetails) => void;
  onColorChangeBg: (details: ColorPickerValueChangeDetails) => void;
};

const FilterColorPickerImpl: React.FC<TColorPickerProps> = props => {
  return (
    <HStack>
      <UltraColorPicker
        zIndex={50}
        colorPalette={props.theme.colorPickerColorPalette}
        label='Foreground'
        defaultValue={props.defaultColors.fg}
        onValueChangeEnd={(details: ColorPickerValueChangeDetails) => {
          props.setFilterFg(props.filterId, details.valueAsString);
        }}
        onValueChange={props.onColorChangeFg}
      />
      <UltraColorPicker
        zIndex={50}
        colorPalette={props.theme.colorPickerColorPalette}
        label='Background'
        defaultValue={props.defaultColors.bg}
        onValueChangeEnd={(details: ColorPickerValueChangeDetails) => {
          props.setFilterBg(props.filterId, details.valueAsString);
        }}
        onValueChange={props.onColorChangeBg}
      />
    </HStack>
  );
};

// <redux>
const mapState = (state: TRootState) => ({
  theme: state.theme.themes[state.theme.activeThemeIndex].filters.filter,
});

const mapDispatch = {
  setFilterFg: setFilterFg.dispatch,
  setFilterBg: setFilterBg.dispatch,
};

const connector = connect(mapState, mapDispatch);
type TPropsFromRedux = ConnectedProps<typeof connector>;

export const FilterColorPicker = connector(FilterColorPickerImpl);
// </redux>
