/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file Filters.tsx
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description Filters component
 */

import {
  CheckedIcon,
  ClearIcon,
  ExportIcon,
  ImportIcon,
  NewIcon,
  SoundOffIcon,
  SoundOnIcon,
} from '@/components/ui/icons';
import { TooltipIconButton } from '@/components/ui/TooltipIconButton';
import { Box, ButtonGroup, HStack, Span, Stack, Tabs } from '@chakra-ui/react';
import { useColorModeValue } from '../../ui/color-mode';
import { Filter } from './Filter';

interface FiltersProps {
  filtersOpen: boolean;
}

const Filters = ({ filtersOpen }: FiltersProps) => {
  const filterTabs = [
    {
      id: 1,
      name: 'filter-group1',
      title: 'FilterGroup1',
      filters: [
        {
          id: 1,
          name: 'Filter1',
          over: 'Payload',
          active: true,
          overAlternatives: [
            { label: 'Timestamp', value: 'Timestamp' },
            { label: 'Channel', value: 'Channel' },
            { label: 'Level', value: 'Level' },
            { label: 'Payload', value: 'Payload' },
          ],
          highlightOnly: false,
          isRegex: false,
          formula: 'some string to filter',
          colors: {
            bg: '#111111',
            fg: '#000000',
          },
        },
        {
          id: 2,
          name: 'Filter2',
          over: 'Level',
          active: false,
          overAlternatives: [
            { label: 'Timestamp', value: 'Timestamp' },
            { label: 'Channel', value: 'Channel' },
            { label: 'Level', value: 'Level' },
            { label: 'Payload', value: 'Payload' },
          ],
          highlightOnly: false,
          isRegex: true,
          formula: '(warn|error)',
          colors: {
            bg: '#111111',
            fg: '#000000',
          },
        },
      ],
    },
    { id: 2, name: 'filter-group2', title: 'FilterGroup2', filters: [] },
    { id: 3, name: 'filter-group3', title: 'FilterGroup3', filters: [] },
  ];

  const bg = useColorModeValue('gray.200', 'gray.900');
  const boxBorder = useColorModeValue('gray.700', 'gray.200');

  return (
    <Box
      bg={bg}
      borderTop='1px solid'
      borderColor={boxBorder}
      display={filtersOpen ? 'block' : 'none'}
      position='fixed'
      bottom='0'
      left='0'
      right='0'
      zIndex={9999}
      overflowY='scroll'
      maxHeight='45vh' // TODO: make height resizeable by dragging
    >
      <Tabs.Root variant='line' defaultValue={filterTabs[0].name}>
        <Tabs.List position='sticky' top='0' bg={bg} zIndex='10000'>
          {filterTabs.map(tab => (
            <Tabs.Trigger colorPalette='green' key={tab.id} value={tab.name}>
              {tab.title}
            </Tabs.Trigger>
          ))}
          <TooltipIconButton
            tooltip='New filters group'
            size='xs'
            variant='subtle'
            colorPalette='green'
            position='absolute'
            right='0.5em'
            top='0.5em'
          >
            <NewIcon />
          </TooltipIconButton>
        </Tabs.List>
        {filterTabs.map(tab => (
          <Tabs.Content key={tab.id} value={tab.name}>
            <HStack mb='1em' padding='0 0.5em'>
              <ButtonGroup size='sm' variant='subtle' colorPalette='green'>
                <TooltipIconButton tooltip='Apply filters'>
                  <CheckedIcon />
                </TooltipIconButton>
                <TooltipIconButton tooltip='New filter'>
                  <NewIcon />
                </TooltipIconButton>
                <TooltipIconButton tooltip='Unmute All'>
                  <SoundOnIcon />
                </TooltipIconButton>
                <TooltipIconButton tooltip='Mute all'>
                  <SoundOffIcon />
                </TooltipIconButton>
              </ButtonGroup>
              <Span flex='1' />
              <ButtonGroup size='sm' variant='subtle' colorPalette='green'>
                <TooltipIconButton tooltip='Import filters'>
                  <ImportIcon />
                </TooltipIconButton>
                <TooltipIconButton tooltip='Export filters'>
                  <ExportIcon />
                </TooltipIconButton>
                <TooltipIconButton tooltip='Clear filters'>
                  <ClearIcon />
                </TooltipIconButton>
              </ButtonGroup>
            </HStack>
            <Stack gap='0'>
              {tab.filters.map(filter => (
                <Filter key={`${tab.id}-${filter.id}`} {...filter} />
              ))}
            </Stack>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </Box>
  );
};

export default Filters;
