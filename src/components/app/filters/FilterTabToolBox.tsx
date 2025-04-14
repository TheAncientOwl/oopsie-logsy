/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file TabToolbox.tsx
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description Filter tab related tools.
 */

import React, { useCallback, useMemo } from 'react';

// eslint-disable-next-line import/named
import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import { DoubleCheck } from '@/components/ui/DoubleCheck';
import {
  ApplyIcon,
  ClearIcon,
  CollapseIcon,
  DeleteIcon,
  ExpandIcon,
  NewIcon,
  SoundOffIcon,
  SoundOnIcon,
} from '@/components/ui/Icons';
import { useColorModeValue } from '@/hooks/useColorMode';
import { useSwitch } from '@/hooks/useSwitch';
import { RootState } from '@/store';
import {
  addNewFilter,
  deleteAllFilters,
  deleteFilterTab,
  muteAllFilters,
  setFilterTabName,
  unmuteAllFilters,
} from '@/store/filters/handlers';
import { ButtonGroup, HStack, Input, Separator, Span } from '@chakra-ui/react';
import { connect, ConnectedProps } from 'react-redux';
import { setAllFiltersCollapsed } from '@/store/filters/handlers/setAllFiltersCollapsed';

const FilterTabToolBoxImpl: React.FC<PropsFromRedux> = props => {
  const [doubleCheckDeleteShown, toggleDeleteDoubleCheck] = useSwitch(false);
  const [doubleCheckClearShown, toggleClearDoubleCheck] = useSwitch(false);

  const focusedTab = useMemo(() => {
    const focusedTab = props.filterTabs.find(tab => tab.id === props.focusedTabId);

    console.assert(
      focusedTab !== undefined,
      `Failed to find focused tab with id ${props.focusedTabId}`
    );

    return focusedTab;
  }, [props.focusedTabId, props.filterTabs]);

  const border = useColorModeValue('gray.500', 'gray.500');

  const handleNewFilterClick = useCallback(() => {
    props.addNewFilter(props.focusedTabId);
  }, [props.addNewFilter, props.focusedTabId]);

  const handleMuteAllClick = useCallback(() => {
    props.muteAllFilters(props.focusedTabId);
  }, [props.muteAllFilters, props.focusedTabId]);

  const handleUnmuteAllClick = useCallback(() => {
    props.unmuteAllFilters(props.focusedTabId);
  }, [props.unmuteAllFilters, props.focusedTabId]);

  const handleClearClick = useCallback(() => {
    props.deleteAllFilters(props.focusedTabId);
    toggleClearDoubleCheck();
  }, [props.deleteAllFilters, props.focusedTabId]);

  const handleDeleteFilterTabClick = useCallback(() => {
    props.deleteFilterTab(props.focusedTabId);
    toggleDeleteDoubleCheck();
  }, [props.deleteFilterTab, props.focusedTabId, toggleDeleteDoubleCheck]);

  const handleNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      props.setFilterTabName(props.focusedTabId, event.target.value);
    },
    [props.setFilterTabName, props.focusedTabId]
  );

  const handleCollapseAllClick = useCallback(() => {
    props.setAllFiltersCollapsed(props.focusedTabId, true);
  }, [props.setAllFiltersCollapsed, props.focusedTabId]);

  const handleExpandAllClick = useCallback(() => {
    props.setAllFiltersCollapsed(props.focusedTabId, false);
  }, [props.setAllFiltersCollapsed, props.focusedTabId]);

  return (
    <>
      <HStack padding='0 0.5em'>
        <ButtonGroup size='sm' variant='subtle' colorPalette='green'>
          <TooltipIconButton tooltip='Apply filters' disabled>
            <ApplyIcon />
          </TooltipIconButton>
          <TooltipIconButton tooltip='New filter' onClick={handleNewFilterClick}>
            <NewIcon />
          </TooltipIconButton>

          <Separator orientation='vertical' height='7' size='md' />

          <TooltipIconButton
            tooltip='Unmute All'
            onClick={handleUnmuteAllClick}
            disabled={focusedTab?.filters.every(filter => filter.isActive)}
          >
            <SoundOnIcon />
          </TooltipIconButton>
          <TooltipIconButton
            tooltip='Mute all'
            onClick={handleMuteAllClick}
            disabled={focusedTab?.filters.every(filter => !filter.isActive)}
          >
            <SoundOffIcon />
          </TooltipIconButton>
          <TooltipIconButton
            tooltip='Collapse All'
            onClick={handleCollapseAllClick}
            disabled={focusedTab?.filters.every(filter => filter.collapsed)}
          >
            <CollapseIcon />
          </TooltipIconButton>
          <TooltipIconButton
            tooltip='Expand All'
            onClick={handleExpandAllClick}
            disabled={focusedTab?.filters.every(filter => !filter.collapsed)}
          >
            <ExpandIcon />
          </TooltipIconButton>

          <Separator orientation='vertical' height='7' size='md' />

          <TooltipIconButton
            colorPalette='red'
            tooltip='Clear filters'
            onClick={toggleClearDoubleCheck}
          >
            <ClearIcon />
          </TooltipIconButton>
          <TooltipIconButton
            colorPalette='red'
            tooltip='Delete Tab'
            onClick={toggleDeleteDoubleCheck}
          >
            <DeleteIcon />
          </TooltipIconButton>

          <Separator orientation='vertical' height='7' size='md' />
        </ButtonGroup>

        <Input
          borderColor={border}
          colorPalette='green'
          placeholder='Filter Tab Name'
          value={focusedTab?.name}
          onChange={handleNameChange}
        />
      </HStack>

      <DoubleCheck
        isShown={doubleCheckDeleteShown}
        label='Delete tab'
        acceptLabel='Yes, Delete'
        declineLabel='No, Cancel'
        onAccept={handleDeleteFilterTabClick}
        onDecline={toggleDeleteDoubleCheck}
      >
        Are you sure you want to <Span color='red.500'>delete</Span> <b>{focusedTab?.name}</b>?
      </DoubleCheck>

      <DoubleCheck
        isShown={doubleCheckClearShown}
        label='Clear All Filters'
        acceptLabel='Yes, Clear'
        declineLabel='No, Cancel'
        onAccept={handleClearClick}
        onDecline={toggleClearDoubleCheck}
      >
        Are you sure you want to <Span color='red.500'>clear all filters</Span> of{' '}
        <b>{focusedTab?.name}</b>?
      </DoubleCheck>
    </>
  );
};

// <redux>
const mapState = (state: RootState) => ({
  focusedTabId: state.filters.focusedTabId,
  filterTabs: state.filters.filterTabs,
});

const mapDispatch = {
  addNewFilter: addNewFilter.dispatch,
  muteAllFilters: muteAllFilters.dispatch,
  unmuteAllFilters: unmuteAllFilters.dispatch,
  deleteAllFilters: deleteAllFilters.dispatch,
  deleteFilterTab: deleteFilterTab.dispatch,
  setFilterTabName: setFilterTabName.dispatch,
  setAllFiltersCollapsed: setAllFiltersCollapsed.dispatch,
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

export const FilterTabToolBox = connector(FilterTabToolBoxImpl);
// </redux>
