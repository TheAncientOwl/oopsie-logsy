/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file ToolBar.tsx
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description App main toolbar
 */

import { Flex, IconButton, Input } from '@chakra-ui/react';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { GiSettingsKnobs } from 'react-icons/gi';
import { SlSettings } from 'react-icons/sl';

interface ToolBarProps {
  onSettingsOpen: () => void;
  onFiltersOpen: () => void;
}

const ToolBar = ({ onSettingsOpen, onFiltersOpen }: ToolBarProps) => {
  return (
    <Flex padding='0.5em' gap='0.5em' justify='center' alignItems='center'>
      <Flex gap='0.25em'>
        <IconButton onClick={onSettingsOpen}>
          <SlSettings />
        </IconButton>
        <IconButton onClick={onFiltersOpen}>
          <GiSettingsKnobs />
        </IconButton>
        <IconButton>
          <BsArrowLeft />
        </IconButton>
        <IconButton>
          <BsArrowRight />
        </IconButton>
      </Flex>
      <Input variant='subtle' placeholder='search' />
    </Flex>
  );
};

export default ToolBar;
