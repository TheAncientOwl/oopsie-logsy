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

import { Box, Button, ButtonGroup, Heading, HStack, IconButton, Span, Stack, Tabs } from '@chakra-ui/react';
import { useColorModeValue } from '../../ui/color-mode';
import { GoMute, GoUnmute } from 'react-icons/go';
import { CiExport, CiImport } from 'react-icons/ci';
import { SiCcleaner } from 'react-icons/si';
import { FaCheck, FaPlus } from 'react-icons/fa';

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
      height='40vh' // TODO: make height resizeable by dragging
    >
      <Tabs.Root variant='line' defaultValue={filterTabs[0].name}>
        <Tabs.List position='relative'>
          {filterTabs.map(tab => (
            <Tabs.Trigger colorPalette='green' key={tab.id} value={tab.name}>
              {tab.title}
            </Tabs.Trigger>
          ))}
          <Button size='xs' variant='subtle' colorPalette='green' position='absolute' right='0.5em' top='0.5em'>
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
            <Stack border='1px solid green'>
              {/* TODO: move into Filter component */}
              {tab.filters.map(filter => (
                <Box
                  key={`${tab.id}-${filter.id}`}
                  padding='0.5em 1em'
                  borderBottom='2px solid white'
                  paddingBottom='0.25em'
                >
                  <Heading size='xl'>{filter.name}</Heading>
                </Box>
              ))}
            </Stack>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </Box>
  );
};

export default Filters;
