/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file ToolBar.tsx
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description App main toolbar
 */

import { SettingsIcon } from '@/components/ui/Icons';
import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import { useColorModeValue } from '@/hooks/useColorMode';
import { ButtonGroup, Flex, Input } from '@chakra-ui/react';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { GiSettingsKnobs } from 'react-icons/gi';

interface ToolBarProps {
  onSettingsOpen: () => void;
  onFiltersOpen: () => void;
}

export const ToolBar = ({ onSettingsOpen, onFiltersOpen }: ToolBarProps) => {
  const bg = useColorModeValue('white', 'black');

  return (
    <Flex
      position='sticky'
      top='0'
      bg={bg}
      padding='0.5em'
      gap='0.5em'
      justify='center'
      alignItems='center'
    >
      <Flex gap='0.25em'>
        <ButtonGroup colorPalette='green' variant='outline'>
          <TooltipIconButton tooltip='Open Settings' onClick={onSettingsOpen}>
            <SettingsIcon />
          </TooltipIconButton>
          <TooltipIconButton tooltip='Toggle filters' onClick={onFiltersOpen}>
            <GiSettingsKnobs />
          </TooltipIconButton>
          <TooltipIconButton tooltip='Prev'>
            <BsArrowLeft />
          </TooltipIconButton>
          <TooltipIconButton tooltip='Next'>
            <BsArrowRight />
          </TooltipIconButton>
        </ButtonGroup>
      </Flex>
      <Input colorPalette='green' variant='subtle' placeholder='search' />
    </Flex>
  );
};
