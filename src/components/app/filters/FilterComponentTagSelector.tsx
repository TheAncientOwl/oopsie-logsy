/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file FilterComponentTagSelector.tsx
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Tag selector for filter component.
 */

import React, { useMemo } from 'react';

import { SingleSelect } from '@/components/ui/select/SingleSelect';
import { RootState } from '@/store';
import { setComponentOverAlternative } from '@/store/filters/handlers';
import { createListCollection } from '@chakra-ui/react';
import { connect, ConnectedProps } from 'react-redux';

interface FilterComponentTagSelectorProps extends PropsFromRedux {
  tabId: string;
  filterId: string;
  componentId: string;
  value: string;
}

const FilterComponentTagSelectorImpl: React.FC<FilterComponentTagSelectorProps> = props => {
  const overAlternatives = useMemo(
    () => createListCollection({ items: props.overAlternatives }),
    [props.overAlternatives]
  );

  return (
    <SingleSelect
      root={{ size: 'md', maxWidth: '150px', variant: 'outline' }}
      collection={overAlternatives}
      value={props.value}
      onChange={(overAlternativeId: string) => {
        props.setComponentOverAlternative(props.componentId, overAlternativeId);
      }}
    />
  );
};

// <redux>
const mapState = (state: RootState) => ({
  overAlternatives: state.logRegexTags.overAlternatives,
  focusedTabId: state.filters.focusedTabId,
});

const mapDispatch = {
  setComponentOverAlternative: setComponentOverAlternative.dispatch,
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

export const FilterComponentTagSelector = connector(FilterComponentTagSelectorImpl);
// </redux>
