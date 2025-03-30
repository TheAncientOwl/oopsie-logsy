/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file Filters.tsx
 * @author Alexandru Delegeanu
 * @version 0.9
 * @description Filters component
 */

import { type FilterTabData } from '@/components/app/filters/interfaces';
import {
  ApplyIcon,
  ClearIcon,
  ExportIcon,
  ImportIcon,
  NewIcon,
  SoundOffIcon,
  SoundOnIcon,
} from '@/components/ui/Icons';
import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import { useColorModeValue } from '@/hooks/useColorMode';
import { Box, ButtonGroup, Collapsible, HStack, Span, Stack, Tabs } from '@chakra-ui/react';
import { Filter } from './Filter';

interface FiltersProps {
  filtersOpen: boolean;
}

const overAlternativesHC = {
  data: [
    { label: 'Timestamp', value: 'Timestamp' },
    { label: 'Channel', value: 'Channel' },
    { label: 'Level', value: 'Level' },
    { label: 'Payload', value: 'Payload' },
  ],
};

const filterTabsHC: Array<FilterTabData> = [
  {
    id: '01JQM6ZMY2CJW0SV24CW5MT63Z',
    name: 'FilterGroup1',
    filters: [
      {
        id: '01JQM6ZSJECYSD1R0J4MNWDXA8',
        name: 'Filter1',
        isActive: true,
        isHighlightOnly: false,
        components: [
          {
            id: '01JQM708N9XAYX1GJX84YXKMRY',
            over: 'Payload',
            data: '.*',
            isRegex: false,
            isEquals: true,
          },
          {
            id: '02JQM708N9XAYX1GJX84YXKMRY',
            over: 'Timestamp',
            data: '.*',
            isRegex: true,
            isEquals: true,
          },
          {
            id: '03JQM708N9XAYX1GJX84YXKMRY',
            over: 'Level',
            data: '.*',
            isRegex: true,
            isEquals: true,
          },
          {
            id: '04JQM708N9XAYX1GJX84YXKMRY',
            over: 'Payload',
            data: '.*',
            isRegex: false,
            isEquals: true,
          },
        ],
      },
      {
        id: '02JQM6ZSJECYSD1R0J4MNWDXA8',
        name: 'Filter2',
        isActive: true,
        isHighlightOnly: false,
        components: [
          {
            id: '01JQM708N9XAYX1GJX84YXKMRY',
            over: 'Payload',
            data: '.*',
            isRegex: false,
            isEquals: true,
          },
          {
            id: '02JQM708N9XAYX1GJX84YXKMRY',
            over: 'Timestamp',
            data: '.*',
            isRegex: true,
            isEquals: true,
          },
          {
            id: '03JQM708N9XAYX1GJX84YXKMRY',
            over: 'Level',
            data: '.*',
            isRegex: true,
            isEquals: true,
          },
          {
            id: '04JQM708N9XAYX1GJX84YXKMRY',
            over: 'Payload',
            data: '.*',
            isRegex: false,
            isEquals: true,
          },
        ],
      },
    ],
  },
  {
    id: '01JQM74SS15G4T8KVBZ3M4JA55',
    name: 'FilterGroup2',
    filters: [
      {
        id: '01JQM74YEJQN9SGX2E8YM2FD34',
        name: 'Filter1',
        isActive: true,
        isHighlightOnly: false,
        components: [
          {
            id: '01JQM751WVAYSDK2ARNG5PMD45',
            over: 'Payload',
            data: '.*',
            isRegex: true,
            isEquals: false,
          },
          {
            id: '02JQM751WVAYSDK2ARNG5PMD45',
            over: 'Timestamp',
            data: '.*',
            isRegex: true,
            isEquals: true,
          },
          {
            id: '03JQM751WVAYSDK2ARNG5PMD45',
            over: 'Level',
            data: '.*',
            isRegex: true,
            isEquals: true,
          },
          {
            id: '04JQM751WVAYSDK2ARNG5PMD45',
            over: 'Payload',
            data: '.*',
            isRegex: true,
            isEquals: true,
          },
        ],
      },
    ],
  },
];

export const Filters = ({ filtersOpen }: FiltersProps) => {
  const bg = useColorModeValue('gray.200', 'gray.900');
  const boxBorder = useColorModeValue('gray.700', 'gray.500');

  return (
    <Collapsible.Root
      open={filtersOpen}
      position='fixed'
      bottom='0'
      left='0'
      right='0'
      zIndex={9999}
    >
      <Collapsible.Content>
        <Box
          bg={bg}
          borderTop='1px solid'
          borderColor={boxBorder}
          overflowY='scroll'
          height='45vh' // TODO: make height resizeable by dragging
        >
          <Tabs.Root variant='line' defaultValue={filterTabsHC[0].name}>
            <Tabs.List position='sticky' top='0' bg={bg} zIndex='10000'>
              {filterTabsHC.map(tab => (
                <Tabs.Trigger colorPalette='green' key={tab.id} value={tab.name}>
                  {tab.name}
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
            {filterTabsHC.map(tab => (
              <Tabs.Content key={tab.id} value={tab.name}>
                <HStack mb='1em' padding='0 0.5em'>
                  <ButtonGroup size='sm' variant='subtle' colorPalette='green'>
                    <TooltipIconButton tooltip='Apply filters'>
                      <ApplyIcon />
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
                    <Filter key={filter.id} {...filter} overAlternatives={overAlternativesHC} />
                  ))}
                </Stack>
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </Box>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
