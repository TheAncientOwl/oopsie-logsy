/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file Filters.tsx
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Filters component
 */

import { Box, Button, Heading, HStack, Stack, Tabs } from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';

interface FiltersProps {
  filtersOpen: boolean;
}

const Filters = ({ filtersOpen }: FiltersProps) => {
  const bg = useColorModeValue('gray.100', 'gray.700');

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

  return (
    <Box
      display={filtersOpen ? 'block' : 'none'}
      bg={bg}
      position='fixed'
      bottom='0'
      left='0'
      right='0'
      zIndex={9999}
      height='40vh' // TODO: make height resizeable by dragging
    >
      <Tabs.Root variant='line' defaultValue={filterTabs[0].name}>
        <Tabs.List>
          {filterTabs.map(tab => (
            <Tabs.Trigger
              key={tab.id}
              value={tab.name}
              style={{
                all: 'unset', // Remove button styles
                borderBottom: '2px solid transparent',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
              }}
            >
              {tab.title}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {filterTabs.map(tab => (
          <Tabs.Content key={tab.id} value={tab.name}>
            <HStack>
              <Button size='xs'>Apply</Button>
              <Button size='xs'>Enable All</Button>
              <Button size='xs'>Disable All</Button>
              <Button size='xs'>Import</Button>
              <Button size='xs'>Export</Button>
              <Button size='xs'>Clear</Button>
            </HStack>
            <Box>
              <Stack border='1px solid green'>
                {/* TODO: move into Filter component */}
                {tab.filters.map(filter => (
                  <Box key={`${tab.id}-${filter.id}`} borderBottom='2px solid white' paddingBottom='0.25em'>
                    <Heading size='xl'>{filter.name}</Heading>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </Box>
  );
};

export default Filters;
