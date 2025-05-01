/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file TabToolbox.tsx
 * @author Alexandru Delegeanu
 * @version 0.8
 * @description Filter tab related tools.
 */

import React from 'react';

import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import { DoubleCheck } from '@/components/ui/DoubleCheck';
import {
  ApplyIcon,
  ClearIcon,
  CollapseIcon,
  DeleteIcon,
  DuplicateIcon,
  ExpandIcon,
  NewIcon,
  SoundOffIcon,
  SoundOnIcon,
} from '@/components/ui/Icons';
import { useColorModeValue } from '@/hooks/useColorMode';
import { useSwitch } from '@/hooks/useSwitch';
import { type TRootState } from '@/store';
import {
  addNewFilter,
  deleteAllFilters,
  deleteFilterTab,
  duplicateFiltersTab,
  muteAllFilters,
  setFilterTabName,
  unmuteAllFilters,
} from '@/store/filters/handlers';
import { setAllFiltersCollapsed } from '@/store/filters/handlers/setAllFiltersCollapsed';
import { ButtonGroup, HStack, Input, Separator, Span } from '@chakra-ui/react';
import { connect, ConnectedProps } from 'react-redux';

const FilterTabToolBoxImpl: React.FC<TPropsFromRedux> = props => {
  console.assertX(
    FilterTabToolBox.name,
    props.focusedTab !== undefined,
    `Failed to find focused tab with id ${props.focusedTabId}`
  );

  const borderColor = useColorModeValue('gray.500', 'gray.500');

  const [doubleCheckDeleteShown, toggleDeleteDoubleCheck] = useSwitch(false);
  const [doubleCheckClearShown, toggleClearDoubleCheck] = useSwitch(false);

  // TODO: refactor disabled states
  return (
    <>
      <HStack padding='0 0.5em'>
        <ButtonGroup size='sm' variant='subtle' colorPalette='green'>
          <TooltipIconButton tooltip='Apply filters' disabled>
            <ApplyIcon />
          </TooltipIconButton>
          <TooltipIconButton
            tooltip='New filter'
            onClick={() => {
              props.addNewFilter(props.focusedTabId);
            }}
          >
            <NewIcon />
          </TooltipIconButton>

          <Separator orientation='vertical' height='7' size='md' />

          <TooltipIconButton
            tooltip='Unmute All'
            onClick={() => {
              props.unmuteAllFilters(props.focusedTabId);
            }}
            // disabled={focusedTab?.filterIDs.every(filter => filter.isActive)}
          >
            <SoundOnIcon />
          </TooltipIconButton>
          <TooltipIconButton
            tooltip='Mute all'
            onClick={() => {
              props.muteAllFilters(props.focusedTabId);
            }}
            // disabled={focusedTab?.filterIDs.every(filter => !filter.isActive)}
          >
            <SoundOffIcon />
          </TooltipIconButton>
          <TooltipIconButton
            tooltip='Collapse All'
            onClick={() => {
              props.setAllFiltersCollapsed(props.focusedTabId, true);
            }}
            // disabled={focusedTab?.filterIDs.every(filter => filter.collapsed)}
          >
            <CollapseIcon />
          </TooltipIconButton>
          <TooltipIconButton
            tooltip='Expand All'
            onClick={() => {
              props.setAllFiltersCollapsed(props.focusedTabId, false);
            }}
            // disabled={focusedTab?.filterIDs.every(filter => !filter.collapsed)}
          >
            <ExpandIcon />
          </TooltipIconButton>

          <Separator orientation='vertical' height='7' size='md' />

          <TooltipIconButton
            tooltip='Duplicate Tab'
            onClick={() => {
              props.duplicateFiltersTab(props.focusedTabId);
            }}
          >
            <DuplicateIcon />
          </TooltipIconButton>
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
          borderColor={borderColor}
          colorPalette='green'
          placeholder='Filter Tab Name'
          value={props.focusedTab?.name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            props.setFilterTabName(props.focusedTabId, event.target.value);
          }}
        />
      </HStack>

      <DoubleCheck
        isShown={doubleCheckDeleteShown}
        label='Delete tab'
        acceptLabel='Yes, Delete'
        declineLabel='No, Cancel'
        onAccept={() => {
          props.deleteFilterTab(props.focusedTabId);
          toggleDeleteDoubleCheck();
        }}
        onDecline={toggleDeleteDoubleCheck}
      >
        Are you sure you want to <Span color='red.500'>delete</Span> <b>{props.focusedTab?.name}</b>
        ?
      </DoubleCheck>

      <DoubleCheck
        isShown={doubleCheckClearShown}
        label='Clear All Filters'
        acceptLabel='Yes, Clear'
        declineLabel='No, Cancel'
        onAccept={() => {
          props.deleteAllFilters(props.focusedTabId);
          toggleClearDoubleCheck();
        }}
        onDecline={toggleClearDoubleCheck}
      >
        Are you sure you want to <Span color='red.500'>clear all filters</Span> of{' '}
        <b>{props.focusedTab?.name}</b>?
      </DoubleCheck>
    </>
  );
};

// <redux>
const mapState = (state: TRootState) => ({
  focusedTabId: state.filters.focusedTabId,
  focusedTab: state.filters.tabs.find(tab => tab.id === state.filters.focusedTabId),
});

const mapDispatch = {
  addNewFilter: addNewFilter.dispatch,
  muteAllFilters: muteAllFilters.dispatch,
  unmuteAllFilters: unmuteAllFilters.dispatch,
  deleteAllFilters: deleteAllFilters.dispatch,
  deleteFilterTab: deleteFilterTab.dispatch,
  setFilterTabName: setFilterTabName.dispatch,
  setAllFiltersCollapsed: setAllFiltersCollapsed.dispatch,
  duplicateFiltersTab: duplicateFiltersTab.dispatch,
};

const connector = connect(mapState, mapDispatch);
type TPropsFromRedux = ConnectedProps<typeof connector>;

export const FilterTabToolBox = connector(FilterTabToolBoxImpl);
// </redux>
