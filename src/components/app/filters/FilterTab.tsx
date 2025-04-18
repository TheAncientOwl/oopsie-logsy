/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file FilterTab.tsx
 * @author Alexandru Delegeanu
 * @version 0.12
 * @description Filter tab.
 */

import React from 'react';

import { UUID } from '@/store/common/types';
import { focusFilterTab } from '@/store/filters/handlers';
import { Stack, Tabs } from '@chakra-ui/react';
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
  tabId: UUID;
  filterIds: Array<UUID>;
}

export const FilterTabContent: React.FC<FilterContentTabProps> = (props: FilterContentTabProps) => {
  return (
    <Tabs.Content value={props.tabId}>
      <Stack gap='0'>
        {props.filterIds.map(filterId => (
          <Filter key={filterId} tabId={props.tabId} filterId={filterId} />
        ))}
      </Stack>
    </Tabs.Content>
  );
};
