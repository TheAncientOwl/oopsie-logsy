/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file FilterComponent.tsx
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description Filter component.
 */

import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import {
  DeleteIcon,
  EqualsIcon,
  NotEqualsIcon,
  RegexOffIcon,
  RegexOnIcon,
} from '@/components/ui/Icons';
import { For } from '@/components/ui/utils/For';
import { useColorModeValue } from '@/hooks/useColorMode';
import { RootState } from '@/store';
import {
  deleteFilterComponent,
  filterComponentSetData,
  filterComponentSetOverAlternative,
  filterComponentToggleIsEquals,
  filterComponentToggleIsRegex,
  newFilterComponent,
} from '@/store/filters/action';
import { TFilterComponent, TOverAlternative } from '@/store/filters/reducer';
import { ButtonGroup, HStack, Input, ListCollection, Select } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { connect, ConnectedProps } from 'react-redux';

interface FilterComponentProps extends PropsFromRedux {
  tabId: string;
  filterId: string;
  component: TFilterComponent;
  overAlternatives: ListCollection<TOverAlternative>;
}

const FilterComponentImpl = (props: FilterComponentProps) => {
  const border = useColorModeValue('gray.500', 'gray.500');

  const handleToggleIsRegexClick = useCallback(() => {
    props.filterComponentToggleIsRegex(props.tabId, props.filterId, props.component.id);
  }, [props.filterComponentToggleIsRegex, props.tabId, props.filterId, props.component.id]);

  const handleToggleIsEqualsClick = useCallback(() => {
    props.filterComponentToggleIsEquals(props.tabId, props.filterId, props.component.id);
  }, [props.filterComponentToggleIsEquals, props.tabId, props.filterId, props.component.id]);

  const handleDataChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      props.filterComponentSetData(
        props.tabId,
        props.filterId,
        props.component.id,
        event.target.value
      );
    },
    [props.filterComponentSetData, props.tabId, props.filterId, props.component.id]
  );

  const handleDeleteClick = useCallback(() => {
    props.deleteFilterComponent(props.tabId, props.filterId, props.component.id);
  }, [props.deleteFilterComponent, props.tabId, props.filterId, props.component.id]);

  return (
    <HStack>
      <Select.Root collection={props.overAlternatives} size='md' maxWidth='150px'>
        {/* TODO: select... */}
        <Select.HiddenSelect />

        <Select.Control>
          <Select.Trigger cursor='pointer'>
            <Select.ValueText placeholder={props.component.over} />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>

        <Select.Positioner>
          <Select.Content>
            <For each={props.overAlternatives.items}>
              {item => (
                <Select.Item item={item} key={item.value}>
                  {item.label}
                  <Select.ItemIndicator />
                </Select.Item>
              )}
            </For>
          </Select.Content>
        </Select.Positioner>
      </Select.Root>

      <ButtonGroup size='xs' colorPalette='green' variant='subtle'>
        <TooltipIconButton
          tooltip={props.component.isRegex ? 'Toggle regex: Off' : 'Toggle regex: On'}
          onClick={handleToggleIsRegexClick}
        >
          {props.component.isRegex ? <RegexOnIcon /> : <RegexOffIcon />}
        </TooltipIconButton>
        <TooltipIconButton
          tooltip={props.component.isEquals ? 'Toggle not equals' : 'Toggle equals'}
          onClick={handleToggleIsEqualsClick}
        >
          {props.component.isEquals ? <EqualsIcon /> : <NotEqualsIcon />}
        </TooltipIconButton>
      </ButtonGroup>

      <Input
        borderColor={border}
        colorPalette='green'
        defaultValue={props.component.data}
        placeholder='Filter'
        onChange={handleDataChange}
      />

      <TooltipIconButton
        size='sm'
        colorPalette='red'
        variant='subtle'
        tooltip='Delete component'
        onClick={handleDeleteClick}
      >
        <DeleteIcon />
      </TooltipIconButton>
    </HStack>
  );
};

// <redux>
const mapState = (state: RootState) => ({});

const mapDispatch = {
  newFilterComponent,
  deleteFilterComponent,
  filterComponentSetOverAlternative,
  filterComponentToggleIsRegex,
  filterComponentToggleIsEquals,
  filterComponentSetData,
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

export const FilterComponent = connector(FilterComponentImpl);
// </redux>
