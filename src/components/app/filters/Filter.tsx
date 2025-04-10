/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file Filter.tsx
 * @author Alexandru Delegeanu
 * @version 0.12
 * @description Filter component
 */

import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import { DeleteIcon, EyeClosedIcon, EyeOpenIcon, NewIcon } from '@/components/ui/Icons';
import { For } from '@/components/ui/utils/For';
import { useColorModeValue } from '@/hooks/useColorMode';
import { useSwitch } from '@/hooks/useSwitch';
import { RootState } from '@/store';
import {
  deleteFilter,
  filterSetName,
  filterToggleActive,
  filterToggleHighlightOnly,
  newFilterComponent,
} from '@/store/filters/action';
import { TFilter, TOverAlternative } from '@/store/filters/reducer';
import { Box, Checkbox, Collapsible, HStack, Input, ListCollection, Stack } from '@chakra-ui/react';
import { connect, ConnectedProps } from 'react-redux';
import { FilterComponent } from './FilterComponent';
import React, { useCallback } from 'react';

interface FilterProps extends PropsFromRedux {
  tabId: string;
  filter: TFilter;
  overAlternatives: ListCollection<TOverAlternative>;
}

const FilterImpl = (props: FilterProps) => {
  const bg = useColorModeValue('gray.300', 'gray.800');
  const border = useColorModeValue('gray.500', 'gray.500');

  const [isOpen, toggleIsOpen] = useSwitch(true);

  const handleNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      props.filterSetName(props.tabId, props.filter.id, event.target.value);
    },
    [props.filterSetName, props.tabId, props.filter.id]
  );

  const handleDeleteClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      props.deleteFilter(props.tabId, props.filter.id);
    },
    [props.deleteFilter, props.tabId, props.filter.id]
  );

  const handleNewComponentClick = useCallback(() => {
    props.newFilterComponent(props.tabId, props.filter.id);
  }, [props.newFilterComponent, props.tabId, props.filter.id]);

  const handleFilterToggle = useCallback(() => {
    props.filterToggleActive(props.tabId, props.filter.id);
  }, [props.filterToggleActive, props.tabId, props.filter.id]);

  const handleFilterToggleHiglightOnly = useCallback(() => {
    props.filterToggleHighlightOnly(props.tabId, props.filter.id);
  }, [props.filterToggleHighlightOnly, props.tabId, props.filter.id]);

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
        <TooltipIconButton
          size='sm'
          variant='subtle'
          colorPalette='green'
          tooltip={isOpen ? 'Hide Filter' : 'Show filter'}
          onClick={toggleIsOpen}
        >
          {isOpen ? <EyeOpenIcon /> : <EyeClosedIcon />}
        </TooltipIconButton>

        <Input
          borderColor={border}
          colorPalette='green'
          placeholder='Filter Name'
          defaultValue={props.filter.name}
          onChange={handleNameChange}
        />

        <TooltipIconButton
          tooltip='Delete filter'
          size='sm'
          colorPalette='red'
          variant='subtle'
          onClick={handleDeleteClick}
        >
          <DeleteIcon />
        </TooltipIconButton>
      </HStack>

      <Collapsible.Root open={isOpen}>
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

              <Checkbox.Root
                cursor='pointer'
                onCheckedChange={handleFilterToggle}
                checked={props.filter.isActive}
                variant='subtle'
                colorPalette='green'
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Label>Active</Checkbox.Label>
              </Checkbox.Root>

              <Checkbox.Root
                cursor='pointer'
                onCheckedChange={handleFilterToggleHiglightOnly}
                checked={props.filter.isHighlightOnly}
                variant='subtle'
                colorPalette='green'
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Label>Highlight Only</Checkbox.Label>
              </Checkbox.Root>
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
const mapState = (state: RootState) => ({});

const mapDispatch = {
  deleteFilter,
  filterToggleActive,
  filterToggleHighlightOnly,
  filterSetName,
  newFilterComponent,
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

export const Filter = connector(FilterImpl);
// </redux>
