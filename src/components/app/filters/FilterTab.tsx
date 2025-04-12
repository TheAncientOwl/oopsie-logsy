/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file FilterTab.tsx
 * @author Alexandru Delegeanu
 * @version 0.7
 * @description Filter tab.
 */

import React, { useCallback } from 'react';

import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import {
  ApplyIcon,
  ClearIcon,
  DeleteIcon,
  NewIcon,
  SoundOffIcon,
  SoundOnIcon,
} from '@/components/ui/Icons';
import { TFilterTab, TOverAlternative } from '@/store/filters/data';
import {
  addNewFilter,
  deleteAllFilters,
  deleteFilterTab,
  focusFilterTab,
  muteAllFilters,
  unmuteAllFilters,
} from '@/store/filters/handlers';
import { ButtonGroup, HStack, ListCollection, Separator, Stack, Tabs } from '@chakra-ui/react';
import { connect, ConnectedProps } from 'react-redux';
import { Filter } from './Filter';

interface FilterTabHeaderProps extends HeaderPropsFromRedux {
  tabId: string;
  name: string;
}

export const FilterTabHeaderImpl: React.FC<FilterTabHeaderProps> = (
  props: FilterTabHeaderProps
) => {
  const handleFocusClick = useCallback(() => {
    props.focusFilterTab(props.tabId);
  }, [props.focusFilterTab, props.tabId]);

  return (
    <Tabs.Trigger
      minWidth={`${props.name.length}ch`}
      colorPalette='green'
      value={props.tabId}
      onClick={handleFocusClick}
    >
      {props.name}
    </Tabs.Trigger>
  );
};

// <redux-content>
const mapStateHeader = () => ({});

const mapDispatchHeader = {
  focusFilterTab: focusFilterTab.dispatch,
};

const connectorHeader = connect(mapStateHeader, mapDispatchHeader);
type HeaderPropsFromRedux = ConnectedProps<typeof connectorHeader>;

export const FilterTabHeader = connectorHeader(FilterTabHeaderImpl);
// </redux-content>

interface FilterContentTabProps extends ContentPropsFromRedux {
  tab: TFilterTab;
  overAlternatives: ListCollection<TOverAlternative>;
}

const FilterTabContentImpl: React.FC<FilterContentTabProps> = (props: FilterContentTabProps) => {
  const handleNewFilterClick = useCallback(() => {
    props.addNewFilter(props.tab.id);
  }, [props.addNewFilter, props.tab.id]);

  const handleMuteAllClick = useCallback(() => {
    props.muteAllFilters(props.tab.id);
  }, [props.muteAllFilters, props.tab.id]);

  const handleUnmuteAllClick = useCallback(() => {
    props.unmuteAllFilters(props.tab.id);
  }, [props.unmuteAllFilters, props.tab.id]);

  const handleClearClick = useCallback(() => {
    props.deleteAllFilters(props.tab.id);
  }, [props.deleteAllFilters, props.tab.id]);

  const handleDeleteFilterTabClick = useCallback(() => {
    props.deleteFilterTab(props.tab.id);
  }, [props.deleteFilterTab, props.tab.id]);

  return (
    <Tabs.Content value={props.tab.id}>
      <HStack mb='1em' padding='0 0.5em'>
        <ButtonGroup size='sm' variant='subtle' colorPalette='green'>
          <TooltipIconButton tooltip='Apply filters'>
            <ApplyIcon />
          </TooltipIconButton>
          <TooltipIconButton tooltip='New filter' onClick={handleNewFilterClick}>
            <NewIcon />
          </TooltipIconButton>
          <TooltipIconButton tooltip='Unmute All' onClick={handleUnmuteAllClick}>
            <SoundOnIcon />
          </TooltipIconButton>
          <TooltipIconButton tooltip='Mute all' onClick={handleMuteAllClick}>
            <SoundOffIcon />
          </TooltipIconButton>

          <Separator orientation='vertical' height='7' size='md' />

          <TooltipIconButton colorPalette='red' tooltip='Clear filters' onClick={handleClearClick}>
            <ClearIcon />
          </TooltipIconButton>
          <TooltipIconButton
            colorPalette='red'
            tooltip='Delete Tab'
            onClick={handleDeleteFilterTabClick}
          >
            <DeleteIcon />
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

// <redux-content>
const mapStateContent = () => ({});

const mapDispatchContent = {
  addNewFilter: addNewFilter.dispatch,
  muteAllFilters: muteAllFilters.dispatch,
  unmuteAllFilters: unmuteAllFilters.dispatch,
  deleteAllFilters: deleteAllFilters.dispatch,
  deleteFilterTab: deleteFilterTab.dispatch,
};

const connectorContent = connect(mapStateContent, mapDispatchContent);
type ContentPropsFromRedux = ConnectedProps<typeof connectorContent>;

export const FilterTabContent = connectorContent(FilterTabContentImpl);
// </redux-content>
