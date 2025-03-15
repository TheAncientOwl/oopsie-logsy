/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file Settings.tsx
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description App settings
 */

import { SettingsIcon } from '@/components/ui/Icons';
import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import { Box, Heading, HStack, Separator } from '@chakra-ui/react';
import { ColorModeButton, useColorModeValue } from '@/components/ui/buttons/ColorMode';
import { LogRegexConfigurator } from './LogRegexConfigurator';

interface SettingsProps {
  menuOpen: boolean;
  onMenuClose: () => void;
}

export const Settings = ({ menuOpen, onMenuClose }: SettingsProps) => {
  const bg = useColorModeValue('white', 'gray.900');
  const border = useColorModeValue('gray.700', 'gray.200');

  return (
    <Box
      bg={bg}
      border='1px solid'
      borderColor={border}
      display={menuOpen ? 'block' : 'none'}
      position='fixed'
      top='0'
      left='0'
      zIndex={10000}
      width='min(700px,100vw)'
      height='100vh'
      padding={'1em'}
      overflow='scroll'
    >
      <HStack marginBottom={'0.5em'}>
        <TooltipIconButton
          tooltip='Close'
          colorPalette='red'
          variant='surface'
          size='sm'
          onClick={onMenuClose}
        >
          <SettingsIcon />
        </TooltipIconButton>
        <Heading size='2xl' ml='0.25em'>
          Settings
        </Heading>
        <ColorModeButton />
      </HStack>
      <LogRegexConfigurator />
      <Separator borderColor={border} mt='1em' />
    </Box>
  );
};
