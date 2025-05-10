/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file ToolBar.tsx
 * @author Alexandru Delegeanu
 * @version 0.8
 * @description App main toolbar
 */

import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import { FiltersIcon, NextIcon, PrevIcon, SettingsIcon } from '@/components/ui/icons';
import { TRootState } from '@/store';
import { ButtonGroup, Flex, Input } from '@chakra-ui/react';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

type TToolBarProps = {
  onSettingsToggle: () => void;
  onFiltersToggle: () => void;
};

const ToolBarImpl = React.forwardRef<HTMLDivElement, TToolBarProps & TPropsFromRedux>(
  (props, ref) => {
    return (
      <Flex
        ref={ref}
        position='sticky'
        top='0'
        padding='0.5em'
        gap='0.5em'
        justify='center'
        alignItems='center'
        backgroundColor={props.theme.background}
      >
        <Flex gap='0.25em'>
          <ButtonGroup>
            <TooltipIconButton
              tooltip='Open Settings'
              onClick={props.onSettingsToggle}
              variant={props.theme.buttons.settings.variant}
              colorPalette={props.theme.buttons.settings.colorPalette}
            >
              <SettingsIcon />
            </TooltipIconButton>

            <TooltipIconButton
              tooltip='Toggle filters'
              onClick={props.onFiltersToggle}
              variant={props.theme.buttons.filters.variant}
              colorPalette={props.theme.buttons.filters.colorPalette}
            >
              <FiltersIcon />
            </TooltipIconButton>

            <TooltipIconButton
              tooltip='Prev'
              variant={props.theme.buttons.prev.variant}
              colorPalette={props.theme.buttons.prev.colorPalette}
            >
              <PrevIcon />
            </TooltipIconButton>

            <TooltipIconButton
              tooltip='Next'
              variant={props.theme.buttons.next.variant}
              colorPalette={props.theme.buttons.next.colorPalette}
            >
              <NextIcon />
            </TooltipIconButton>
          </ButtonGroup>
        </Flex>
        <Input
          placeholder='search'
          backgroundColor={props.theme.input.background}
          colorPalette={props.theme.input.colorPalette}
          variant={props.theme.input.variant}
          color={props.theme.input.text}
        />
      </Flex>
    );
  }
);

// <redux>
const mapState = (state: TRootState) => ({
  theme: state.theme.themes[state.theme.activeThemeIndex].toolbar,
});

const mapDispatch = {};

const connector = connect(mapState, mapDispatch, null, { forwardRef: true });
type TPropsFromRedux = ConnectedProps<typeof connector>;

export const ToolBar = connector(ToolBarImpl);
// </redux>
