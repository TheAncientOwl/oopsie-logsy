/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file FilterTabs.tsx
 * @author Alexandru Delegeanu
 * @version 0.22
 * @description Filters component
 */

import { NewIcon, SaveIcon } from '@/components/ui/Icons';
import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import { useColorModeValue } from '@/hooks/useColorMode';
import { type TRootState } from '@/store';
import {
  addNewFilterTab,
  focusFilterTab,
  invokeGetTabs,
  invokeSetTabs,
  reorderTabs,
} from '@/store/filters/handlers';
import { Box, ButtonGroup, Collapsible, HStack, Tabs } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FilterTabContent, FilterTabHeader } from './FilterTab';
import { FilterTabToolBox } from './FilterTabToolBox';
import { DraggableList } from '@/components/ui/lists/DraggableList';

type TFiltersProps = TPropsFromRedux & {
  filtersOpen: boolean;
};

const FilterTabsImpl: React.FC<TFiltersProps> = (props: TFiltersProps) => {
  useEffect(() => {
    props.invokeGetTabs();
  }, []);

  const bg = useColorModeValue('gray.200', 'gray.900');
  const boxBorder = useColorModeValue('gray.700', 'gray.500');

  const handleSaveClick = () => {
    props.invokeSetTabs(props.tabs, props.filters, props.components);
  };

  return (
    <Collapsible.Root
      open={props.filtersOpen}
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
          height='60vh' // TODO: make height resizeable by dragging
        >
          <Tabs.Root variant='line' defaultValue={props.focusedTab} value={props.focusedTab}>
            <HStack mb='0.75em' position='sticky' top='0' zIndex='10000' bg={bg} pb='5px'>
              <ButtonGroup ml='0.5em' pt='0.25em' colorPalette='green' size='xs' variant='subtle'>
                <TooltipIconButton tooltip='New filters tab' onClick={props.addNewFilterTab}>
                  <NewIcon />
                </TooltipIconButton>
                <TooltipIconButton
                  disabled={!props.canSaveTabs}
                  tooltip='Save tabs'
                  onClick={handleSaveClick}
                >
                  <SaveIcon />
                </TooltipIconButton>
              </ButtonGroup>

              <Box overflowX='scroll'>
                <DraggableList.Container
                  items={props.tabs}
                  direction='horizontal'
                  onDragEnd={(activeId, overId) => {
                    console.infoX(FilterTabsImpl.name, 'Reordering', { activeId }, { overId });
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

            {props.tabs.map(tab => (
              <FilterTabContent key={tab.id} tabId={tab.id} filterIds={tab.filterIDs} />
            ))}
          </Tabs.Root>
        </Box>
      </Collapsible.Content>
    </Collapsible.Root>
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
});

const mapDispatch = {
  addNewFilterTab: addNewFilterTab.dispatch,
  invokeGetTabs: invokeGetTabs.dispatch,
  invokeSetTabs: invokeSetTabs.dispatch,
  reorderTabs: reorderTabs.dispatch,
  focusFilterTab: focusFilterTab.dispatch,
};

const connector = connect(mapState, mapDispatch);
type TPropsFromRedux = ConnectedProps<typeof connector>;

export const FilterTabs = connector(FilterTabsImpl);
// </redux>
