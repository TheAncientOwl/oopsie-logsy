/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file FilterTab.tsx
 * @author Alexandru Delegeanu
 * @version 0.2
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
import { focusFilterTab, newFilter } from '@/store/filters/action';
import { type TFilterTab, type TOverAlternative } from '@/store/filters/reducer';
import { ButtonGroup, HStack, ListCollection, Span, Stack, Tabs } from '@chakra-ui/react';
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
    <Tabs.Trigger colorPalette='green' value={props.tabId} onClick={handleFocusClick}>
      {props.name}
    </Tabs.Trigger>
  );
};

// <redux-content>
const mapStateHeader = () => ({});

const mapDispatchHeader = {
  focusFilterTab,
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
    props.newFilter(props.tab.id);
  }, [props.newFilter, props.tab.id]);

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

// <redux-content>
const mapStateContent = () => ({});

const mapDispatchContent = {
  newFilter,
};

const connectorContent = connect(mapStateContent, mapDispatchContent);
type ContentPropsFromRedux = ConnectedProps<typeof connectorContent>;

export const FilterTabContent = connectorContent(FilterTabContentImpl);
// </redux-content>
