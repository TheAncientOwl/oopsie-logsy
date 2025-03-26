/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file DebugMenu.tsx
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Debug tools menu.
 */

import { Box, ButtonGroup } from '@chakra-ui/react';
import { PiMaskHappy, PiMaskSad } from 'react-icons/pi';
import { ColorModeButton } from './components/ui/buttons/ColorModeButton';
import { TooltipIconButton } from './components/ui/buttons/TooltipIconButton';

interface DebugMenuProps {
  strictModeOn: boolean;
  onStrictModeToggle: () => void;
}

export const DebugMenu = ({ strictModeOn, onStrictModeToggle }: DebugMenuProps) => {
  return (
    <Box
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 8888,
        display: 'flex',
      }}
    >
      <ButtonGroup size='xs'>
        <TooltipIconButton
          tooltip={strictModeOn ? 'Toggle strict mode off' : 'Toggle strict mode on'}
          onClick={onStrictModeToggle}
          colorPalette={strictModeOn ? 'green' : 'orange'}
        >
          {strictModeOn ? <PiMaskHappy /> : <PiMaskSad />}
        </TooltipIconButton>
        <ColorModeButton />
      </ButtonGroup>
    </Box>
  );
};
