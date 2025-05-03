/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file FilterTab.tsx
 * @author Alexandru Delegeanu
 * @version 0.18
 * @description Filter tab.
 */

import React from 'react';

import { DraggableList } from '@/components/ui/lists/DraggableList';
import { For } from '@/components/ui/utils/For';
import { TRootState } from '@/store';
import { type UUID } from '@/store/common/identifier';
import { prepareFiltersForDrag, reorderFilters } from '@/store/filters/handlers';
import { Tabs } from '@chakra-ui/react';
import { connect, ConnectedProps } from 'react-redux';
import { Filter } from './Filter';

type TFilterTabHeaderProps = {
  tabId: UUID;
  name: string;
};

export const FilterTabHeaderImpl: React.FC<
  TFilterTabHeaderProps & THeaderPropsFromRedux
> = props => {
  return (
    <DraggableList.Item id={props.tabId} allDraggable>
      <Tabs.Trigger
        minWidth={`${props.name.length}ch`}
        value={props.tabId}
        color={props.theme.general.text}
        colorPalette={props.theme.tabs.headerColorPalette}
      >
        {props.name}
      </Tabs.Trigger>
    </DraggableList.Item>
  );
};

// <redux>
const mapStateHeader = (state: TRootState) => ({
  theme: state.theme.themes[state.theme.activeThemeIndex].filters,
});

const mapDispatchHeader = {
  reorderFilters: reorderFilters.dispatch,
  prepareFiltersForDrag: prepareFiltersForDrag.dispatch,
};

const connectorHeader = connect(mapStateHeader, mapDispatchHeader);
type THeaderPropsFromRedux = ConnectedProps<typeof connectorHeader>;

export const FilterTabHeader = connectorHeader(FilterTabHeaderImpl);
// </redux>

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
          props.reorderFilters(props.tabId, activeId, overId);
        }}
        onDragButNotMoved={activeId => {
          props.reorderFilters(props.tabId, activeId, activeId);
        }}
        onDragStart={() => {
          props.prepareFiltersForDrag(props.tabId);
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
  prepareFiltersForDrag: prepareFiltersForDrag.dispatch,
};

const connectorContent = connect(mapStateContent, mapDispatchContent);
type TContentPropsFromRedux = ConnectedProps<typeof connectorContent>;

export const FilterTabContent = connectorContent(FilterTabContentImpl);
// </redux>
