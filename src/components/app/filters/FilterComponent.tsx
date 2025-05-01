/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file FilterComponent.tsx
 * @author Alexandru Delegeanu
 * @version 0.14
 * @description Filter component.
 */

import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import {
  DeleteIcon,
  EqualsIcon,
  IgnoreCaseIcon,
  MatchCaseIcon,
  NotEqualsIcon,
  RegexOffIcon,
  RegexOnIcon,
} from '@/components/ui/Icons';
import { DraggableList } from '@/components/ui/lists/DraggableList';
import { useColorModeValue } from '@/hooks/useColorMode';
import { type TRootState } from '@/store';
import { type UUID } from '@/store/common/identifier';
import { getFilterComponentById } from '@/store/filters/data';
import {
  deleteFilterComponent,
  setComponentData,
  toggleComponentIsEquals,
  toggleComponentIsRegex,
  toggleFilterComponentIgnoreCase,
} from '@/store/filters/handlers';
import { ButtonGroup, HStack, Input } from '@chakra-ui/react';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FilterComponentTagSelector } from './FilterComponentTagSelector';

type TFilterComponentProps = {
  tabId: UUID;
  filterId: UUID;
  componentId: UUID;
};

const FilterComponentImpl: React.FC<TFilterComponentProps & TPropsFromRedux> = props => {
  const borderColor = useColorModeValue('gray.500', 'gray.500');

  return (
    <DraggableList.Item id={props.componentId}>
      <HStack>
        <TooltipIconButton
          size='sm'
          colorPalette='red'
          variant='subtle'
          tooltip='Delete component'
          onClick={() => {
            props.deleteFilterComponent(props.filterId, props.componentId);
          }}
        >
          <DeleteIcon />
        </TooltipIconButton>

        <FilterComponentTagSelector
          tabId={props.tabId}
          filterId={props.filterId}
          componentId={props.componentId}
          value={props.component.overAlternativeId}
        />

        <ButtonGroup size='xs' colorPalette='green' variant='subtle'>
          <TooltipIconButton
            tooltip={props.component.isRegex ? 'Toggle Regex: (Now On)' : 'Toggle Regex: (Now Off)'}
            onClick={() => {
              props.toggleComponentIsRegex(props.componentId);
            }}
          >
            {props.component.isRegex ? <RegexOnIcon /> : <RegexOffIcon />}
          </TooltipIconButton>

          <TooltipIconButton
            tooltip={`Toggle Case: (Now ${props.component.ignoreCase ? 'Ignore' : 'Match'})`}
            onClick={() => {
              props.toggleFilterComponentIgnoreCase(props.componentId);
            }}
          >
            {props.component.ignoreCase ? <IgnoreCaseIcon /> : <MatchCaseIcon />}
          </TooltipIconButton>

          <TooltipIconButton
            tooltip={`Toggle: (Now ${props.component.isEquals ? '' : 'Not '}Equals)`}
            onClick={() => {
              props.toggleComponentIsEquals(props.componentId);
            }}
          >
            {props.component.isEquals ? <EqualsIcon /> : <NotEqualsIcon />}
          </TooltipIconButton>
        </ButtonGroup>

        <Input
          borderColor={borderColor}
          colorPalette='green'
          defaultValue={props.component.data}
          placeholder='Filter'
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            props.setComponentData(props.componentId, event.target.value);
          }}
        />

        <DraggableList.ItemHandle />
      </HStack>
    </DraggableList.Item>
  );
};

// <redux>
const mapState = (state: TRootState, ownProps: TFilterComponentProps) => ({
  component: getFilterComponentById(
    `FilterComponent::mapState`,
    state.filters.components,
    ownProps.componentId
  ),
});

const mapDispatch = {
  deleteFilterComponent: deleteFilterComponent.dispatch,
  toggleComponentIsRegex: toggleComponentIsRegex.dispatch,
  toggleComponentIsEquals: toggleComponentIsEquals.dispatch,
  setComponentData: setComponentData.dispatch,
  toggleFilterComponentIgnoreCase: toggleFilterComponentIgnoreCase.dispatch,
};

const connector = connect(mapState, mapDispatch);
type TPropsFromRedux = ConnectedProps<typeof connector>;

export const FilterComponent = connector(FilterComponentImpl);
// </redux>
