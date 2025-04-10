/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file FilterTab.tsx
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Filter tab.
 */

import React, { useCallback } from 'react';

import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import {
  ApplyIcon,
  ClearIcon,
  ExportIcon,
  ImportIcon,
  NewIcon,
  SoundOffIcon,
  SoundOnIcon,
} from '@/components/ui/Icons';
import { RootState } from '@/store';
import { newFilter } from '@/store/filters/action';
import { type TFilterTab, type TOverAlternative } from '@/store/filters/reducer';
import { ButtonGroup, HStack, ListCollection, Span, Stack, Tabs } from '@chakra-ui/react';
import { connect, ConnectedProps } from 'react-redux';
import { Filter } from './Filter';

interface FilterTabHeaderProps {
  name: string;
}

export const FilterTabHeader: React.FC<FilterTabHeaderProps> = (props: FilterTabHeaderProps) => {
  return (
    <Tabs.Trigger colorPalette='green' value={props.name}>
      {props.name}
    </Tabs.Trigger>
  );
};

interface FilterContentTabProps extends PropsFromRedux {
  tab: TFilterTab;
  overAlternatives: ListCollection<TOverAlternative>;
}

const FilterTabContentImpl: React.FC<FilterContentTabProps> = (props: FilterContentTabProps) => {
  const handleNewFilterClick = useCallback(() => {
    props.newFilter(props.tab.id);
  }, [props.newFilter, props.tab.id]);

  return (
    <Tabs.Content value={props.tab.name}>
      <HStack mb='1em' padding='0 0.5em'>
        <ButtonGroup size='sm' variant='subtle' colorPalette='green'>
          <TooltipIconButton tooltip='Apply filters'>
            <ApplyIcon />
          </TooltipIconButton>
          <TooltipIconButton tooltip='New filter' onClick={handleNewFilterClick}>
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
        {props.tab.filters.map(filter => (
          <Filter
            key={filter.id}
            tabId={props.tab.id}
            filter={filter}
            overAlternatives={props.overAlternatives}
          />
        ))}
      </Stack>
    </Tabs.Content>
  );
};

// <redux>
const mapState = (state: RootState) => ({});

const mapDispatch = {
  newFilter,
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

export const FilterTabContent = connector(FilterTabContentImpl);
// </redux>
