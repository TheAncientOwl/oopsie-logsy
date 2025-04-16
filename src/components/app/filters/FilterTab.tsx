/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file FilterTab.tsx
 * @author Alexandru Delegeanu
 * @version 0.11
 * @description Filter tab.
 */

import React from 'react';

import { TFilterTab, TOverAlternative } from '@/store/filters/data';
import { focusFilterTab } from '@/store/filters/handlers';
import { ListCollection, Stack, Tabs } from '@chakra-ui/react';
import { connect, ConnectedProps } from 'react-redux';
import { Filter } from './Filter';

interface FilterTabHeaderProps extends HeaderPropsFromRedux {
  tabId: string;
  name: string;
}

export const FilterTabHeaderImpl: React.FC<FilterTabHeaderProps> = (
  props: FilterTabHeaderProps
) => {
  const handleFocusClick = () => {
    props.focusFilterTab(props.tabId);
  };

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

// <redux>
const mapStateHeader = () => ({});

const mapDispatchHeader = {
  focusFilterTab: focusFilterTab.dispatch,
};

const connectorHeader = connect(mapStateHeader, mapDispatchHeader);
type HeaderPropsFromRedux = ConnectedProps<typeof connectorHeader>;

export const FilterTabHeader = connectorHeader(FilterTabHeaderImpl);
// </redux>

interface FilterContentTabProps {
  tab: TFilterTab;
  overAlternatives: ListCollection<TOverAlternative>;
}

export const FilterTabContent: React.FC<FilterContentTabProps> = (props: FilterContentTabProps) => {
  return (
    <Tabs.Content value={props.tab.id}>
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
