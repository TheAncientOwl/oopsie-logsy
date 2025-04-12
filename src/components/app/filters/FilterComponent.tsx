/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file FilterComponent.tsx
 * @author Alexandru Delegeanu
 * @version 0.3
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
import { SingleSelect } from '@/components/ui/select/SingleSelect';
import { useColorModeValue } from '@/hooks/useColorMode';
import { TFilterComponent, TOverAlternative } from '@/store/filters/data';
import {
  addNewFilterComponent,
  deleteFilterComponent,
  setComponentData,
  setComponentOverAlternative,
  toggleComponentIsEquals,
  toggleComponentIsRegex,
} from '@/store/filters/handlers';
import { ButtonGroup, HStack, Input, ListCollection } from '@chakra-ui/react';
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
    props.toggleComponentIsRegex(props.tabId, props.filterId, props.component.id);
  }, [props.toggleComponentIsRegex, props.tabId, props.filterId, props.component.id]);

  const handleToggleIsEqualsClick = useCallback(() => {
    props.toggleComponentIsEquals(props.tabId, props.filterId, props.component.id);
  }, [props.toggleComponentIsEquals, props.tabId, props.filterId, props.component.id]);

  const handleDataChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      props.setComponentData(props.tabId, props.filterId, props.component.id, event.target.value);
    },
    [props.setComponentData, props.tabId, props.filterId, props.component.id]
  );

  const handleDeleteClick = useCallback(() => {
    props.deleteFilterComponent(props.tabId, props.filterId, props.component.id);
  }, [props.deleteFilterComponent, props.tabId, props.filterId, props.component.id]);

  const handleChangeOverAlternative = useCallback(
    (overAlternativeId: string) => {
      props.setComponentOverAlternative(
        props.tabId,
        props.filterId,
        props.component.id,
        overAlternativeId
      );
    },
    [props.setComponentOverAlternative]
  );

  return (
    <HStack>
      <SingleSelect
        root={{ size: 'md', maxWidth: '150px', variant: 'outline' }}
        collection={props.overAlternatives}
        value={props.component.overAlternativeId}
        onChange={handleChangeOverAlternative}
      />

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
const mapState = () => ({});

const mapDispatch = {
  addNewFilterComponent: addNewFilterComponent.dispatch,
  deleteFilterComponent: deleteFilterComponent.dispatch,
  setComponentOverAlternative: setComponentOverAlternative.dispatch,
  toggleComponentIsRegex: toggleComponentIsRegex.dispatch,
  toggleComponentIsEquals: toggleComponentIsEquals.dispatch,
  setComponentData: setComponentData.dispatch,
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

export const FilterComponent = connector(FilterComponentImpl);
// </redux>
