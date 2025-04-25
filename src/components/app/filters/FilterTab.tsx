/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file FilterTab.tsx
 * @author Alexandru Delegeanu
 * @version 0.16
 * @description Filter tab.
 */

import React from 'react';

import { DraggableList } from '@/components/ui/lists/DraggableList';
import { For } from '@/components/ui/utils/For';
import { type UUID } from '@/store/common/identifier';
import { reorderFilters } from '@/store/filters/handlers';
import { Tabs } from '@chakra-ui/react';
import { connect, ConnectedProps } from 'react-redux';
import { Filter } from './Filter';

type TFilterTabHeaderProps = {
  tabId: UUID;
  name: string;
};

export const FilterTabHeader: React.FC<TFilterTabHeaderProps> = props => {
  return (
    <DraggableList.Item id={props.tabId} allDraggable>
      <Tabs.Trigger minWidth={`${props.name.length}ch`} colorPalette='green' value={props.tabId}>
        {props.name}
      </Tabs.Trigger>
    </DraggableList.Item>
  );
};

type TFilterContentTabProps = {
  tabId: UUID;
  filterIds: Array<UUID>;
};

export const FilterTabContentImpl: React.FC<
  TFilterContentTabProps & TContentPropsFromRedux
> = props => {
  return (
    <Tabs.Content value={props.tabId}>
      <DraggableList.Container
        items={props.filterIds}
        direction='vertical'
        onDragEnd={(activeId, overId) => {
          console.infoX(FilterTabContentImpl.name, 'Should reorder');
          props.reorderFilters(props.tabId, activeId, overId);
        }}
      >
        <For each={props.filterIds}>
          {filterId => <Filter key={filterId} tabId={props.tabId} filterId={filterId} />}
        </For>
      </DraggableList.Container>
    </Tabs.Content>
  );
};

// <redux>
const mapStateContent = () => ({});

const mapDispatchContent = {
  reorderFilters: reorderFilters.dispatch,
};

const connectorContent = connect(mapStateContent, mapDispatchContent);
type TContentPropsFromRedux = ConnectedProps<typeof connectorContent>;

export const FilterTabContent = connectorContent(FilterTabContentImpl);
// </redux>
