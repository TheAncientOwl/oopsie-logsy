/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file Filters.tsx
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description Filters component
 */

import { Box, Button, ButtonGroup, HStack, Span, Stack, Tabs } from '@chakra-ui/react';
import { CiExport, CiImport } from 'react-icons/ci';
import { FaCheck, FaPlus } from 'react-icons/fa';
import { GoMute, GoUnmute } from 'react-icons/go';
import { SiCcleaner } from 'react-icons/si';
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
          <Button
            size='xs'
            variant='subtle'
            colorPalette='green'
            position='absolute'
            right='0.5em'
            top='0.5em'
          >
            <FaPlus /> New
          </Button>
        </Tabs.List>
        {filterTabs.map(tab => (
          <Tabs.Content key={tab.id} value={tab.name}>
            <HStack mb='1em' padding='0 0.5em'>
              <ButtonGroup size='xs' variant='subtle' colorPalette='green'>
                <Button>
                  <FaCheck />
                  Apply
                </Button>
                <Button>
                  <FaPlus /> New
                </Button>
                <Button>
                  <GoUnmute /> Mute All
                </Button>
                <Button>
                  <GoMute /> Mute All
                </Button>
              </ButtonGroup>
              <Span flex='1' />
              <ButtonGroup size='xs' variant='subtle' colorPalette='green'>
                <Button>
                  <CiImport /> Import
                </Button>
                <Button>
                  <CiExport /> Export
                </Button>
                <Button>
                  <SiCcleaner /> Clear
                </Button>
              </ButtonGroup>
            </HStack>
            <Stack gap='0'>
              {tab.filters.map((filter, index) => (
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
