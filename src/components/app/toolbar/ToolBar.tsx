/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file ToolBar.tsx
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description App main toolbar
 */

import { Flex, IconButton, Input } from '@chakra-ui/react';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { GiSettingsKnobs } from 'react-icons/gi';
import { SlSettings } from 'react-icons/sl';
import { useColorModeValue } from '../../ui/color-mode';

interface ToolBarProps {
  onSettingsOpen: () => void;
  onFiltersOpen: () => void;
}

const ToolBar = ({ onSettingsOpen, onFiltersOpen }: ToolBarProps) => {
  const bg = useColorModeValue('white', 'black');

  return (
    <Flex position='sticky' top='0' bg={bg} padding='0.5em' gap='0.5em' justify='center' alignItems='center'>
      <Flex gap='0.25em'>
        <IconButton colorPalette='green' variant='outline' onClick={onSettingsOpen}>
          <SlSettings />
        </IconButton>
        <IconButton colorPalette='green' variant='outline' onClick={onFiltersOpen}>
          <GiSettingsKnobs />
        </IconButton>
        <IconButton colorPalette='green' variant='outline'>
          <BsArrowLeft />
        </IconButton>
        <IconButton colorPalette='green' variant='outline'>
          <BsArrowRight />
        </IconButton>
      </Flex>
      <Input colorPalette='green' variant='subtle' placeholder='search' />
    </Flex>
  );
};

export default ToolBar;
