/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file Filter.tsx
 * @author Alexandru Delegeanu
 * @version 0.25
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
import { RootState } from '@/store';
import { UUID } from '@/store/common/identifier';
import { getFilterById } from '@/store/filters/data';
import {
  addNewFilterComponent,
  deleteFilter,
  duplicateFilter,
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
import React, { useMemo, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FilterColorPicker } from './FilterColorPicker';
import { FilterComponent } from './FilterComponent';

interface FilterProps extends PropsFromRedux {
  tabId: UUID;
  filterId: UUID;
}

const FilterImpl = (props: FilterProps) => {
  const bg = useColorModeValue('gray.300', 'gray.800');
  const border = useColorModeValue('gray.500', 'gray.500');

  const filter = useMemo(
    () => getFilterById(FilterImpl.name, props.filters, props.filterId),
    [props.filters, props.filterId]
  );

  const [filterFg, setFilterFg] = useState(filter.colors.fg);
  const [filterBg, setFilterBg] = useState(filter.colors.bg);

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
            tooltip={filter.collapsed ? 'Show Filter' : 'Hide filter'}
            onClick={handleFilterCollapseClick}
          >
            {filter.collapsed ? <EyeClosedIcon /> : <EyeOpenIcon />}
          </TooltipIconButton>
          <TooltipIconButton tooltip='Duplicate filter' onClick={handleDuplicateClick}>
            <DuplicateIcon />
          </TooltipIconButton>
          <TooltipIconButton colorPalette='red' tooltip='Delete filter' onClick={handleDeleteClick}>
            <DeleteIcon />
          </TooltipIconButton>
        </ButtonGroup>

        <Separator borderColor={border} orientation='vertical' height='7' size='md' />

        <FilterColorPicker
          tabId={props.tabId}
          filterId={props.filterId}
          defaultColors={filter.colors}
          onColorChangeFg={details => setFilterFg(details.valueAsString)}
          onColorChangeBg={details => setFilterBg(details.valueAsString)}
        />

        <Separator borderColor={border} orientation='vertical' height='7' size='md' />

        <Tooltip content='Filter Priority'>
          <NumberInput.Root
            size='md'
            min={0}
            colorPalette='green'
            value={filter.priority.toString()}
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
          defaultValue={filter.name}
          onChange={handleNameChange}
          color={filterFg}
          backgroundColor={filterBg}
        />
      </HStack>

      <Collapsible.Root open={!filter.collapsed}>
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

              <CheckBox checked={filter.isActive} onCheckedChange={handleFilterToggle}>
                Active
              </CheckBox>
              <CheckBox
                checked={filter.isHighlightOnly}
                onCheckedChange={handleFilterToggleHiglightOnly}
              >
                Highlight Only
              </CheckBox>
            </HStack>

            <For each={filter.componentIDs}>
              {componentId => (
                <FilterComponent
                  key={componentId}
                  tabId={props.tabId}
                  filterId={props.filterId}
                  componentId={componentId}
                />
              )}
            </For>
          </Stack>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  );
};

// <redux>
const mapState = (state: RootState) => ({
  filters: state.filters.filters,
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
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

export const Filter = connector(FilterImpl);
// </redux>
