/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file FilterComponentTagSelector.tsx
 * @author Alexandru Delegeanu
 * @version 0.5
 * @description Tag selector for filter component.
 */

import React, { useEffect, useMemo } from 'react';

import { SingleSelect } from '@/components/ui/select/SingleSelect';
import { type TRootState } from '@/store';
import { setComponentOverAlternative } from '@/store/filters/handlers';
import { createListCollection } from '@chakra-ui/react';
import { connect, ConnectedProps } from 'react-redux';
import { DefaultFilterComponentOverAlternativeId } from '@/store/filters/data';

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

  useEffect(() => {
    if (
      overAlternatives.items.length > 0 &&
      (props.value === DefaultFilterComponentOverAlternativeId || !valid)
    ) {
      props.setComponentOverAlternative(props.componentId, overAlternatives.items[0].value);
    }
  }, [overAlternatives, props.value, valid]);

  return (
    <SingleSelect
      root={{
        size: 'md',
        maxWidth: '150px',
        variant: 'outline',
        color: valid ? props.theme.text.valid : props.theme.text.invalid,
        borderColor: props.theme.border,
        backgroundColor: props.theme.background,
        overflow: 'hidden',
      }}
      content={{
        backgroundColor: props.theme.alternatives.background,
        color: props.theme.alternatives.text,
      }}
      item={{
        _hover: {
          backgroundColor: props.theme.alternatives.hover.background,
          color: props.theme.alternatives.text,
        },
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
  theme: state.theme.themes[state.theme.activeThemeIndex].filters.component.select,
});

const mapDispatch = {
  setComponentOverAlternative: setComponentOverAlternative.dispatch,
};

const connector = connect(mapState, mapDispatch);
type TPropsFromRedux = ConnectedProps<typeof connector>;

export const FilterComponentTagSelector = connector(FilterComponentTagSelectorImpl);
// </redux>
