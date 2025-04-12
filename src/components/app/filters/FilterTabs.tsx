/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file FilterTabs.tsx
 * @author Alexandru Delegeanu
 * @version 0.13
 * @description Filters component
 */

import { NewIcon, SaveIcon } from '@/components/ui/Icons';
import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import { useColorModeValue } from '@/hooks/useColorMode';
import { RootState } from '@/store';
import { makeOverAlternatives } from '@/store/filters/data';
import { addNewFilterTab, invokeGetTabs, invokeSetTabs } from '@/store/filters/handlers';
import { Box, ButtonGroup, Collapsible, createListCollection, Tabs } from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FilterTabContent, FilterTabHeader } from './FilterTab';

interface FiltersProps extends PropsFromRedux {
  filtersOpen: boolean;
}

const FilterTabsImpl: React.FC<FiltersProps> = (props: FiltersProps) => {
  useEffect(() => {
    props.invokeGetTabs();
  }, []);

  const bg = useColorModeValue('gray.200', 'gray.900');
  const boxBorder = useColorModeValue('gray.700', 'gray.500');

  const overAlternatives = useMemo(
    () => createListCollection({ items: makeOverAlternatives(props.logRegexTags).data }),
    [props.logRegexTags]
  );

  const handleSaveClick = useCallback(() => {
    props.invokeSetTabs(props.filterTabs);
  }, [props.invokeSetTabs, props.filterTabs]);

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
            <Tabs.List position='sticky' top='0' bg={bg} zIndex='10000'>
              {props.filterTabs.map(tab => (
                <FilterTabHeader key={tab.id} tabId={tab.id} name={tab.name} />
              ))}

              <ButtonGroup
                colorPalette='green'
                size='xs'
                variant='subtle'
                position='absolute'
                right='0.5em'
                top='0.5em'
              >
                <TooltipIconButton tooltip='New filters tab' onClick={props.addNewFilterTab}>
                  <NewIcon />
                </TooltipIconButton>
                <TooltipIconButton
                  colorPalette={props.canSaveTabs ? 'green' : 'gray'}
                  disabled={!props.canSaveTabs}
                  tooltip='Save tabs'
                  onClick={handleSaveClick}
                >
                  <SaveIcon />
                </TooltipIconButton>
              </ButtonGroup>
            </Tabs.List>

            {props.filterTabs.map(tab => (
              <FilterTabContent key={tab.id} tab={tab} overAlternatives={overAlternatives} />
            ))}
          </Tabs.Root>
        </Box>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

// <redux>
const mapState = (state: RootState) => ({
  filterTabs: state.filters.filterTabs,
  loading: state.filters.loading,
  logRegexTags: state.logRegexTags.tags,
  focusedTab: state.filters.focusedTabId,
  canSaveTabs: state.filters.canSaveTabs,
});

const mapDispatch = {
  addNewFilterTab: addNewFilterTab.dispatch,
  invokeGetTabs: invokeGetTabs.dispatch,
  invokeSetTabs: invokeSetTabs.dispatch,
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

export const FilterTabs = connector(FilterTabsImpl);
// </redux>
