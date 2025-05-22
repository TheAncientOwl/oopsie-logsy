/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file FilterTabs.tsx
 * @author Alexandru Delegeanu
 * @version 0.33
 * @description Filters component
 */

import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import { NewIcon, SaveIcon } from '@/components/ui/icons';
import { DraggableList } from '@/components/ui/lists/DraggableList';
import { type TRootState } from '@/store';
import {
  addNewFilterTab,
  focusFilterTab,
  invokeGetFilters,
  invokeApplyFilters,
  reorderTabs,
} from '@/store/filters/handlers';
import { Box, ButtonGroup, HStack, Stack, Tabs } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FilterTabContent, FilterTabHeader } from './FilterTab';
import { FilterTabToolBox } from './FilterTabToolBox';

const FilterTabsImpl: React.FC<TPropsFromRedux> = props => {
  useEffect(() => {
    props.invokeGetFilters(props.overAlternatives);
  }, []);

  return (
    <Tabs.Root
      variant='line'
      defaultValue={props.focusedTab}
      value={props.focusedTab}
      backgroundColor={props.theme.general.background}
      overflowY='scroll'
      height='100%'
    >
      <Stack
        gap='0.5em'
        top='0'
        position='sticky'
        backgroundColor={props.theme.general.background}
        pb='0.5em'
        zIndex={1000}
      >
        <HStack>
          <ButtonGroup ml='0.5em' pt='0.25em' size='xs'>
            <TooltipIconButton
              tooltip='New filters tab'
              onClick={props.addNewFilterTab}
              variant={props.theme.tabs.buttons.addNewTab.variant}
              colorPalette={props.theme.tabs.buttons.addNewTab.colorPalette}
            >
              <NewIcon />
            </TooltipIconButton>
            <TooltipIconButton
              disabled={!props.canSaveTabs}
              tooltip='Save tabs'
              onClick={() => {
                props.invokeApplyFilters(
                  props.tabs,
                  props.filters,
                  props.components,
                  props.overAlternatives
                );
              }}
              variant={props.theme.tabs.buttons.saveTabs.variant}
              colorPalette={props.theme.tabs.buttons.saveTabs.colorPalette}
            >
              <SaveIcon />
            </TooltipIconButton>
          </ButtonGroup>

          <Box overflowX='scroll'>
            <DraggableList.Container
              items={props.tabs}
              direction='horizontal'
              onDragEnd={(activeId, overId) => {
                props.reorderTabs(activeId, overId);
              }}
              onDragButNotMoved={activeId => {
                props.focusFilterTab(activeId);
              }}
            >
              <Tabs.List>
                {props.tabs.map(tab => (
                  <FilterTabHeader key={tab.id} tabId={tab.id} name={tab.name} />
                ))}
              </Tabs.List>
            </DraggableList.Container>
          </Box>
        </HStack>

        <FilterTabToolBox />
      </Stack>

      {props.tabs.map(tab => (
        <FilterTabContent key={tab.id} tabId={tab.id} filterIds={tab.filterIDs} />
      ))}
    </Tabs.Root>
  );
};

// <redux>
const mapState = (state: TRootState) => ({
  tabs: state.filters.tabs,
  filters: state.filters.filters,
  components: state.filters.components,
  loading: state.filters.loading,
  focusedTab: state.filters.focusedTabId,
  canSaveTabs: state.filters.canSaveData,
  overAlternatives: state.filters.overAlternatives,
  theme: state.theme.themes[state.theme.activeThemeIndex].filters,
});

const mapDispatch = {
  addNewFilterTab: addNewFilterTab.dispatch,
  invokeGetFilters: invokeGetFilters.dispatch,
  invokeApplyFilters: invokeApplyFilters.dispatch,
  reorderTabs: reorderTabs.dispatch,
  focusFilterTab: focusFilterTab.dispatch,
};

const connector = connect(mapState, mapDispatch);
type TPropsFromRedux = ConnectedProps<typeof connector>;

export const FilterTabs = connector(FilterTabsImpl);
// </redux>
