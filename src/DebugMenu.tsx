/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file DebugMenu.tsx
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description Debug tools menu.
 */

import { Box, ButtonGroup } from '@chakra-ui/react';
import { PiMaskHappy, PiMaskSad } from 'react-icons/pi';
import { ColorModeButton } from './components/ui/buttons/ColorModeButton';
import { TooltipIconButton } from './components/ui/buttons/TooltipIconButton';

type TDebugMenuProps = {
  strictModeOn: boolean;
  onStrictModeToggle: () => void;
};

export const DebugMenu: React.FC<TDebugMenuProps> = props => {
  return (
    <Box position='fixed' top='10px' right='10px' zIndex={7000} display='flex'>
      <ButtonGroup size='xs'>
        <TooltipIconButton
          tooltip={props.strictModeOn ? 'Toggle strict mode off' : 'Toggle strict mode on'}
          onClick={props.onStrictModeToggle}
          colorPalette={props.strictModeOn ? 'green' : 'orange'}
        >
          {props.strictModeOn ? <PiMaskHappy /> : <PiMaskSad />}
        </TooltipIconButton>
        <ColorModeButton />
      </ButtonGroup>
    </Box>
  );
};
