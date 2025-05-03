/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file FilterTabs.tsx
 * @author Alexandru Delegeanu
 * @version 0.31
 * @description Filters component
 */

import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import { NewIcon, SaveIcon } from '@/components/ui/icons';
import { DraggableList } from '@/components/ui/lists/DraggableList';
import { type TRootState } from '@/store';
import {
  addNewFilterTab,
  focusFilterTab,
  invokeGetTabs,
  invokeSetTabs,
  reorderTabs,
} from '@/store/filters/handlers';
import { Box, ButtonGroup, Collapsible, HStack, Stack, Tabs } from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FilterTabContent, FilterTabHeader } from './FilterTab';
import { FilterTabToolBox } from './FilterTabToolBox';

type TFiltersProps = {
  filtersOpen: boolean;
  onHeightChange: (newHeight: number) => void;
};

const DRAG_HANDLE_HEIGHT = '3px';

const FilterTabsImpl: React.FC<TFiltersProps & TPropsFromRedux> = props => {
  useEffect(() => {
    props.invokeGetTabs(props.overAlternatives);
  }, []);

  const tabsRef = useRef<HTMLDivElement>(null);

  const startResizing = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = tabsRef.current?.offsetHeight || 0;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!tabsRef.current) return;
      const newHeight = startHeight + (startY - moveEvent.clientY);
      if (newHeight >= 200 && newHeight <= window.innerHeight * 0.9) {
        tabsRef.current.style.height = `${newHeight}px`;
        props.onHeightChange(newHeight);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <Collapsible.Root
      open={props.filtersOpen}
      position='fixed'
      bottom='0'
      left='0'
      right='0'
      zIndex={9999}
      resize='vertical'
    >
      <Collapsible.Content>
        <Tabs.Root
          variant='line'
          defaultValue={props.focusedTab}
          value={props.focusedTab}
          ref={tabsRef}
          backgroundColor={props.theme.general.background}
          overflowY='scroll'
          height='400px'
          minH='200px'
          maxH='90vh'
        >
          <Stack
            gap='0.5em'
            top='0'
            position='sticky'
            backgroundColor={props.theme.general.background}
            pb='0.5em'
            zIndex={15000}
          >
            <Box
              height={DRAG_HANDLE_HEIGHT}
              backgroundColor={props.theme.general.dragHandle}
              cursor='row-resize'
              onMouseDown={startResizing}
            />

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
                    props.invokeSetTabs(
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
  theme: state.theme.themes[state.theme.activeThemeIndex].filters,
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
