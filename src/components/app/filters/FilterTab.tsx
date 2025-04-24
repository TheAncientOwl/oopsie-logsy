/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file FilterTab.tsx
 * @author Alexandru Delegeanu
 * @version 0.14
 * @description Filter tab.
 */

import React from 'react';

import { UUID } from '@/store/common/identifier';
import { focusFilterTab } from '@/store/filters/handlers';
import { Stack, Tabs } from '@chakra-ui/react';
import { connect, ConnectedProps } from 'react-redux';
import { Filter } from './Filter';

type TFilterTabHeaderProps = THeaderPropsFromRedux & {
  tabId: string;
  name: string;
};

export const FilterTabHeaderImpl: React.FC<TFilterTabHeaderProps> = (
  props: TFilterTabHeaderProps
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
type THeaderPropsFromRedux = ConnectedProps<typeof connectorHeader>;

export const FilterTabHeader = connectorHeader(FilterTabHeaderImpl);
// </redux>

type TFilterContentTabProps = {
  tabId: UUID;
  filterIds: Array<UUID>;
};

export const FilterTabContent: React.FC<TFilterContentTabProps> = (
  props: TFilterContentTabProps
) => {
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
