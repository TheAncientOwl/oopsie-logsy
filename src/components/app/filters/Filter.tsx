/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file Filter.tsx
 * @author Alexandru Delegeanu
 * @version 0.22
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
import { TFilter, TOverAlternative } from '@/store/filters/data';
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
  ListCollection,
  NumberInput,
  NumberInputValueChangeDetails,
  Separator,
  Stack,
} from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FilterColorPicker } from './FilterColorPicker';
import { FilterComponent } from './FilterComponent';

interface FilterProps extends PropsFromRedux {
  tabId: string;
  filter: TFilter;
  overAlternatives: ListCollection<TOverAlternative>;
}

const FilterImpl = (props: FilterProps) => {
  const bg = useColorModeValue('gray.300', 'gray.800');
  const border = useColorModeValue('gray.500', 'gray.500');

  const [filterFg, setFilterFg] = useState(props.filter.colors.fg);
  const [filterBg, setFilterBg] = useState(props.filter.colors.bg);

  const handleNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      props.setFilterName(props.tabId, props.filter.id, event.target.value);
    },
    [props.setFilterName, props.tabId, props.filter.id]
  );

  const handleDeleteClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      props.deleteFilter(props.tabId, props.filter.id);
    },
    [props.deleteFilter, props.tabId, props.filter.id]
  );

  const handleDuplicateClick = useCallback(() => {
    props.duplicateFilter(props.tabId, props.filter.id);
  }, [props.duplicateFilter, props.tabId, props.filter.id]);

  const handleNewComponentClick = useCallback(() => {
    props.addNewFilterComponent(props.tabId, props.filter.id);
  }, [props.addNewFilterComponent, props.tabId, props.filter.id]);

  const handleFilterToggle = useCallback(() => {
    props.toggleFilterActive(props.tabId, props.filter.id);
  }, [props.toggleFilterActive, props.tabId, props.filter.id]);

  const handleFilterToggleHiglightOnly = useCallback(() => {
    props.toggleFilterHighlightOnly(props.tabId, props.filter.id);
  }, [props.toggleFilterHighlightOnly, props.tabId, props.filter.id]);

  const handleFilterPriorityChange = useCallback(
    (details: NumberInputValueChangeDetails) => {
      props.setFilterPriority(props.tabId, props.filter.id, details.valueAsNumber);
    },
    [props.setFilterPriority, props.tabId, props.filter.id]
  );

  const handleFilterCollapseClick = useCallback(() => {
    props.toggleFilterCollapsed(props.tabId, props.filter.id);
  }, [props.toggleFilterCollapsed, props.tabId, props.filter.id]);

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
            tooltip={props.filter.collapsed ? 'Show Filter' : 'Hide filter'}
            onClick={handleFilterCollapseClick}
          >
            {props.filter.collapsed ? <EyeClosedIcon /> : <EyeOpenIcon />}
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
          filterId={props.filter.id}
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

            <For each={props.filter.components}>
              {component => (
                <FilterComponent
                  key={component.id}
                  tabId={props.tabId}
                  filterId={props.filter.id}
                  component={component}
                  overAlternatives={props.overAlternatives}
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
const mapState = () => ({});

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
