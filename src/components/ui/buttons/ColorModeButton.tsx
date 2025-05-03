/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file ColorModeButton.tsx
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description ColorMode toggle button
 */

import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import { ColorModeIcon } from '@/components/ui/icons';
import { TRootState } from '@/store';
import { setActiveThemeIndex } from '@/store/theme/handlers';
import { ClientOnly, Skeleton, type IconButtonProps } from '@chakra-ui/react';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

type TColorModeButtonProps = Omit<IconButtonProps, 'aria-label'>;

const ColorModeButtonImpl: React.FC<TColorModeButtonProps & TPropsFromRedux> = props => {
  const isLightThemeActive = props.activeThemeIndex === 1;

  return (
    <ClientOnly fallback={<Skeleton boxSize='8' />}>
      <TooltipIconButton
        tooltip={isLightThemeActive ? 'Toggle dark theme' : 'Toggle light theme'}
        onClick={() => {
          props.setActiveThemeIndex(isLightThemeActive ? 0 : 1);
        }}
        variant='subtle'
        colorPalette={isLightThemeActive ? 'white' : 'black'}
        aria-label='Toggle color mode'
        {...props}
      >
        <ColorModeIcon />
      </TooltipIconButton>
    </ClientOnly>
  );
};

// <redux>
const mapState = (state: TRootState) => ({
  activeThemeIndex: state.theme.activeThemeIndex,
});

const mapDispatch = {
  setActiveThemeIndex: setActiveThemeIndex.dispatch,
};

const connector = connect(mapState, mapDispatch);
type TPropsFromRedux = ConnectedProps<typeof connector>;

export const ColorModeButton = connector(ColorModeButtonImpl);
// </redux>
