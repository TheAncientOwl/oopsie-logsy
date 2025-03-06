/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file Settings.tsx
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description App settings
 */

import { Box, Heading, HStack, IconButton } from '@chakra-ui/react';
import { SlSettings } from 'react-icons/sl';
import { ColorModeButton, useColorModeValue } from '../../ui/color-mode';

interface SettingsProps {
  menuOpen: boolean;
  onMenuClose: () => void;
}

const Settings = ({ menuOpen, onMenuClose }: SettingsProps) => {
  const bg = useColorModeValue('white', 'gray.900');
  const border = useColorModeValue('gray.700', 'gray.200');

  return (
    <Box
      bg={bg}
      border='2px solid'
      borderColor={border}
      display={menuOpen ? 'block' : 'none'}
      position='fixed'
      top='0'
      left='0'
      zIndex={9999}
      minWidth={'80vw'}
      padding={'1em'}
    >
      <HStack marginBottom={'0.5em'}>
        <IconButton colorPalette='red' variant='surface' size='sm' onClick={onMenuClose}>
          <SlSettings />
        </IconButton>
        <Heading size='2xl'>Settings</Heading>
        <ColorModeButton />
      </HStack>
    </Box>
  );
};

export default Settings;
