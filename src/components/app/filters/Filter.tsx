/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file Filter.tsx
 * @author Alexandru Delegeanu
 * @version 0.29
 * @description Filter component
 */

import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import { CheckBox } from '@/components/ui/check-box/CheckBox';
import {
  DeleteIcon,
  DuplicateIcon,
  EyeClosedIcon,
  EyeOpenIcon,
  NewIcon,
} from '@/components/ui/Icons';
import { Tooltip } from '@/components/ui/Tooltip';
import { For } from '@/components/ui/utils/For';
import { useColorModeValue } from '@/hooks/useColorMode';
import { type TRootState } from '@/store';
import { type UUID } from '@/store/common/identifier';
import { getFilterById } from '@/store/filters/data';
import {
  addNewFilterComponent,
  deleteFilter,
  duplicateFilter,
  reorderFilterComponents,
  setFilterName,
  setFilterPriority,
  toggleFilterActive,
  toggleFilterCollapsed,
  toggleFilterHighlightOnly,
} from '@/store/filters/handlers';
import {
  Box,
  ButtonGroup,
  Collapsible,
  HStack,
  Input,
  NumberInput,
  NumberInputValueChangeDetails,
  Separator,
  Stack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FilterColorPicker } from './FilterColorPicker';
import { FilterComponent } from './FilterComponent';
import { DraggableList } from '@/components/ui/lists/DraggableList';

type TFilterProps = {
  tabId: UUID;
  filterId: UUID;
};

const FilterImpl = (props: TFilterProps & TPropsFromRedux) => {
  const bg = useColorModeValue('gray.300', 'gray.800');
  const border = useColorModeValue('gray.500', 'gray.500');

  const [filterFg, setFilterFg] = useState(props.filter.colors.fg);
  const [filterBg, setFilterBg] = useState(props.filter.colors.bg);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setFilterName(props.filterId, event.target.value);
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    props.deleteFilter(props.tabId, props.filterId);
  };

  const handleDuplicateClick = () => {
    props.duplicateFilter(props.tabId, props.filterId);
  };

  const handleNewComponentClick = () => {
    props.addNewFilterComponent(props.filterId);
  };

  const handleFilterToggle = () => {
    props.toggleFilterActive(props.filterId);
  };

  const handleFilterToggleHiglightOnly = () => {
    props.toggleFilterHighlightOnly(props.filterId);
  };

  const handleFilterPriorityChange = (details: NumberInputValueChangeDetails) => {
    props.setFilterPriority(props.filterId, details.valueAsNumber);
  };

  const handleFilterCollapseClick = () => {
    props.toggleFilterCollapsed(props.filterId);
  };

  return (
    <DraggableList.Item id={props.filterId}>
      <Box
        bg={bg}
        border='2px solid'
        borderTop='1px solid'
        borderBottom='1px solid'
        borderColor={border}
        padding='0.5em 0.75em'
      >
        <HStack>
          <ButtonGroup colorPalette='green' size='sm' variant='subtle'>
            <TooltipIconButton
              tooltip={props.filter.collapsed ? 'Show Filter' : 'Hide filter'}
              onClick={handleFilterCollapseClick}
            >
              {props.filter.collapsed ? <EyeClosedIcon /> : <EyeOpenIcon />}
            </TooltipIconButton>
            <TooltipIconButton tooltip='Duplicate filter' onClick={handleDuplicateClick}>
              <DuplicateIcon />
            </TooltipIconButton>
            <TooltipIconButton
              colorPalette='red'
              tooltip='Delete filter'
              onClick={handleDeleteClick}
            >
              <DeleteIcon />
            </TooltipIconButton>
          </ButtonGroup>

          <Separator borderColor={border} orientation='vertical' height='7' size='md' />

          <FilterColorPicker
            tabId={props.tabId}
            filterId={props.filterId}
            defaultColors={props.filter.colors}
            onColorChangeFg={details => setFilterFg(details.valueAsString)}
            onColorChangeBg={details => setFilterBg(details.valueAsString)}
          />

          <Separator borderColor={border} orientation='vertical' height='7' size='md' />

          <Tooltip content='Filter Priority'>
            <NumberInput.Root
              size='md'
              min={0}
              colorPalette='green'
              value={props.filter.priority.toString()}
              onValueChange={handleFilterPriorityChange}
            >
              <NumberInput.Control bg={bg} />
              <NumberInput.Input
                maxWidth='125px'
                borderColor={border}
                color={filterFg}
                backgroundColor={filterBg}
              />
            </NumberInput.Root>
          </Tooltip>

          <Separator borderColor={border} orientation='vertical' height='7' size='md' />

          <Input
            borderColor={border}
            colorPalette='green'
            placeholder='Filter Name'
            defaultValue={props.filter.name}
            onChange={handleNameChange}
            color={filterFg}
            backgroundColor={filterBg}
          />

          <DraggableList.ItemHandle />
        </HStack>

        <Collapsible.Root open={!props.filter.collapsed}>
          <Collapsible.Content>
            <Stack gap='1em' padding='0.75em 0.5em'>
              <HStack gap='1em'>
                <TooltipIconButton
                  tooltip='Add component'
                  size='xs'
                  colorPalette='green'
                  variant='subtle'
                  onClick={handleNewComponentClick}
                >
                  <NewIcon />
                </TooltipIconButton>

                <CheckBox checked={props.filter.isActive} onCheckedChange={handleFilterToggle}>
                  Active
                </CheckBox>
                <CheckBox
                  checked={props.filter.isHighlightOnly}
                  onCheckedChange={handleFilterToggleHiglightOnly}
                >
                  Highlight Only
                </CheckBox>
              </HStack>

              <DraggableList.Container
                items={props.filter.componentIDs}
                direction='vertical'
                onDragEnd={(activeId, overId) => {
                  // console.infoX(FilterImpl.name,  'IDs', { activeId }, { overId });
                  props.reorderFilterComponents(props.filterId, activeId, overId);
                }}
              >
                <For each={props.filter.componentIDs}>
                  {componentId => (
                    <FilterComponent
                      key={componentId}
                      tabId={props.tabId}
                      filterId={props.filterId}
                      componentId={componentId}
                    />
                  )}
                </For>
              </DraggableList.Container>
            </Stack>
          </Collapsible.Content>
        </Collapsible.Root>
      </Box>
    </DraggableList.Item>
  );
};

// <redux>
const mapState = (state: TRootState, ownProps: TFilterProps) => ({
  filter: getFilterById(`Filter::mapState`, state.filters.filters, ownProps.filterId),
});

const mapDispatch = {
  deleteFilter: deleteFilter.dispatch,
  toggleFilterActive: toggleFilterActive.dispatch,
  toggleFilterHighlightOnly: toggleFilterHighlightOnly.dispatch,
  setFilterName: setFilterName.dispatch,
  addNewFilterComponent: addNewFilterComponent.dispatch,
  duplicateFilter: duplicateFilter.dispatch,
  setFilterPriority: setFilterPriority.dispatch,
  toggleFilterCollapsed: toggleFilterCollapsed.dispatch,
  reorderFilterComponents: reorderFilterComponents.dispatch,
};

const connector = connect(mapState, mapDispatch);
type TPropsFromRedux = ConnectedProps<typeof connector>;

export const Filter = connector(FilterImpl);
// </redux>
