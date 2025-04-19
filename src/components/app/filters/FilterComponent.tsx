/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file FilterComponent.tsx
 * @author Alexandru Delegeanu
 * @version 0.9
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
import { useColorModeValue } from '@/hooks/useColorMode';
import { RootState } from '@/store';
import { UUID } from '@/store/common/identifier';
import { getFilterComponentById } from '@/store/filters/data';
import {
  deleteFilterComponent,
  setComponentData,
  toggleComponentIsEquals,
  toggleComponentIsRegex,
  toggleFilterComponentIgnoreCase,
} from '@/store/filters/handlers';
import { ButtonGroup, HStack, Input } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FilterComponentTagSelector } from './FilterComponentTagSelector';

interface FilterComponentProps extends PropsFromRedux {
  tabId: UUID;
  filterId: UUID;
  componentId: UUID;
}

const FilterComponentImpl = (props: FilterComponentProps) => {
  const border = useColorModeValue('gray.500', 'gray.500');

  const component = useMemo(
    () => getFilterComponentById(FilterComponentImpl.name, props.components, props.componentId),
    [props.components, props.componentId]
  );

  const handleToggleIsRegexClick = () => {
    props.toggleComponentIsRegex(props.componentId);
  };

  const handleToggleIsEqualsClick = () => {
    props.toggleComponentIsEquals(props.componentId);
  };

  const handletoggleFilterComponentIgnoreCaseClick = () => {
    props.toggleFilterComponentIgnoreCase(props.componentId);
  };

  const handleDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setComponentData(props.componentId, event.target.value);
  };

  const handleDeleteClick = () => {
    props.deleteFilterComponent(props.filterId, props.componentId);
  };

  return (
    <HStack>
      <TooltipIconButton
        size='sm'
        colorPalette='red'
        variant='subtle'
        tooltip='Delete component'
        onClick={handleDeleteClick}
      >
        <DeleteIcon />
      </TooltipIconButton>

      <FilterComponentTagSelector
        tabId={props.tabId}
        filterId={props.filterId}
        componentId={props.componentId}
        value={component.overAlternativeId}
      />

      {/* <SingleSelect
        root={{ size: 'md', maxWidth: '150px', variant: 'outline' }}
        collection={props.overAlternatives}
        value={component.overAlternativeId}
        onChange={handleChangeOverAlternative}
      /> */}

      <ButtonGroup size='xs' colorPalette='green' variant='subtle'>
        <TooltipIconButton
          tooltip={component.isRegex ? 'Toggle Regex: (Now On)' : 'Toggle Regex: (Now Off)'}
          onClick={handleToggleIsRegexClick}
        >
          {component.isRegex ? <RegexOnIcon /> : <RegexOffIcon />}
        </TooltipIconButton>
        <TooltipIconButton
          tooltip={`Toggle Case: (Now ${component.ignoreCase ? 'Ignore' : 'Match'})`}
          onClick={handletoggleFilterComponentIgnoreCaseClick}
        >
          {component.ignoreCase ? <IgnoreCaseIcon /> : <MatchCaseIcon />}
        </TooltipIconButton>
        <TooltipIconButton
          tooltip={`Toggle: (Now ${component.isEquals ? '' : 'Not '}Equals)`}
          onClick={handleToggleIsEqualsClick}
        >
          {component.isEquals ? <EqualsIcon /> : <NotEqualsIcon />}
        </TooltipIconButton>
      </ButtonGroup>

      <Input
        borderColor={border}
        colorPalette='green'
        defaultValue={component.data}
        placeholder='Filter'
        onChange={handleDataChange}
      />
    </HStack>
  );
};

// <redux>
const mapState = (state: RootState) => ({
  components: state.filters.components,
});

const mapDispatch = {
  deleteFilterComponent: deleteFilterComponent.dispatch,
  toggleComponentIsRegex: toggleComponentIsRegex.dispatch,
  toggleComponentIsEquals: toggleComponentIsEquals.dispatch,
  setComponentData: setComponentData.dispatch,
  toggleFilterComponentIgnoreCase: toggleFilterComponentIgnoreCase.dispatch,
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

export const FilterComponent = connector(FilterComponentImpl);
// </redux>
