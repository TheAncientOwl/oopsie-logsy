/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file Filter.tsx
 * @author Alexandru Delegeanu
 * @version 0.31
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
import { DraggableList } from '@/components/ui/lists/DraggableList';
import { Tooltip } from '@/components/ui/tooltip';
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

type TFilterProps = {
  tabId: UUID;
  filterId: UUID;
};

const FilterImpl: React.FC<TFilterProps & TPropsFromRedux> = props => {
  const bgColor = useColorModeValue('gray.300', 'gray.800');
  const borderColor = useColorModeValue('gray.500', 'gray.500');

  const [filterFg, setFilterFg] = useState(props.filter.colors.fg);
  const [filterBg, setFilterBg] = useState(props.filter.colors.bg);

  return (
    <DraggableList.Item id={props.filterId}>
      <Box
        bgColor={bgColor}
        border='2px solid'
        borderTop='1px solid'
        borderBottom='1px solid'
        borderColor={borderColor}
        padding='0.5em 0.75em'
      >
        <HStack>
          <ButtonGroup colorPalette='green' size='sm' variant='subtle'>
            <TooltipIconButton
              tooltip={props.filter.collapsed ? 'Show Filter' : 'Hide filter'}
              onClick={() => {
                props.toggleFilterCollapsed(props.filterId);
              }}
            >
              {props.filter.collapsed ? <EyeClosedIcon /> : <EyeOpenIcon />}
            </TooltipIconButton>
            <TooltipIconButton
              tooltip='Duplicate filter'
              onClick={() => {
                props.duplicateFilter(props.tabId, props.filterId);
              }}
            >
              <DuplicateIcon />
            </TooltipIconButton>
            <TooltipIconButton
              colorPalette='red'
              tooltip='Delete filter'
              onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                event.stopPropagation();
                props.deleteFilter(props.tabId, props.filterId);
              }}
            >
              <DeleteIcon />
            </TooltipIconButton>
          </ButtonGroup>

          <Separator borderColor={borderColor} orientation='vertical' height='7' size='md' />

          <FilterColorPicker
            tabId={props.tabId}
            filterId={props.filterId}
            defaultColors={props.filter.colors}
            onColorChangeFg={details => setFilterFg(details.valueAsString)}
            onColorChangeBg={details => setFilterBg(details.valueAsString)}
          />

          <Separator borderColor={borderColor} orientation='vertical' height='7' size='md' />

          <Tooltip content='Filter Priority'>
            <NumberInput.Root
              size='md'
              min={0}
              colorPalette='green'
              value={props.filter.priority.toString()}
              onValueChange={(details: NumberInputValueChangeDetails) => {
                props.setFilterPriority(props.filterId, details.valueAsNumber);
              }}
            >
              <NumberInput.Control bgColor={bgColor} />
              <NumberInput.Input
                maxWidth='125px'
                borderColor={borderColor}
                color={filterFg}
                backgroundColor={filterBg}
              />
            </NumberInput.Root>
          </Tooltip>

          <Separator borderColor={borderColor} orientation='vertical' height='7' size='md' />

          <Input
            borderColor={borderColor}
            colorPalette='green'
            placeholder='Filter Name'
            defaultValue={props.filter.name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              props.setFilterName(props.filterId, event.target.value);
            }}
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
                  onClick={() => {
                    props.addNewFilterComponent(props.filterId);
                  }}
                >
                  <NewIcon />
                </TooltipIconButton>

                <CheckBox
                  checked={props.filter.isActive}
                  onCheckedChange={() => {
                    props.toggleFilterActive(props.filterId);
                  }}
                >
                  Active
                </CheckBox>
                <CheckBox
                  checked={props.filter.isHighlightOnly}
                  onCheckedChange={() => {
                    props.toggleFilterHighlightOnly(props.filterId);
                  }}
                >
                  Highlight Only
                </CheckBox>
              </HStack>

              <DraggableList.Container
                items={props.filter.componentIDs}
                direction='vertical'
                onDragEnd={(activeId, overId) => {
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
