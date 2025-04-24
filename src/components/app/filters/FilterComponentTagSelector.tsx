/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file FilterComponentTagSelector.tsx
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description Tag selector for filter component.
 */

import React, { useMemo } from 'react';

import { SingleSelect } from '@/components/ui/select/SingleSelect';
import { type TRootState } from '@/store';
import { setComponentOverAlternative } from '@/store/filters/handlers';
import { createListCollection } from '@chakra-ui/react';
import { connect, ConnectedProps } from 'react-redux';

type TFilterComponentTagSelectorProps = TPropsFromRedux & {
  tabId: string;
  filterId: string;
  componentId: string;
  value: string;
};

const FilterComponentTagSelectorImpl: React.FC<TFilterComponentTagSelectorProps> = props => {
  const overAlternatives = useMemo(
    () => createListCollection({ items: props.overAlternatives }),
    [props.overAlternatives]
  );

  const valid = overAlternatives.items.some(item => item.value === props.value);

  return (
    <SingleSelect
      root={{
        size: 'md',
        maxWidth: '150px',
        variant: 'outline',
        color: valid ? '' : 'red',
      }}
      collection={overAlternatives}
      value={props.value}
      onChange={(overAlternativeId: string) => {
        props.setComponentOverAlternative(props.componentId, overAlternativeId);
      }}
    />
  );
};

// <redux>
const mapState = (state: TRootState) => ({
  overAlternatives: state.filters.overAlternatives,
});

const mapDispatch = {
  setComponentOverAlternative: setComponentOverAlternative.dispatch,
};

const connector = connect(mapState, mapDispatch);
type TPropsFromRedux = ConnectedProps<typeof connector>;

export const FilterComponentTagSelector = connector(FilterComponentTagSelectorImpl);
// </redux>
