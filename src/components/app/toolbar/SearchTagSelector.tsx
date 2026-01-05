/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file SearchTagSelector.tsx
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Search Tag selector for main search bar.
 */

import React, { useMemo } from 'react';

import { SingleSelect } from '@/components/ui/select/SingleSelect';
import { type TRootState } from '@/store';
import { setSearchAlternativeId } from '@/store/global-search/handlers';
import { createListCollection } from '@chakra-ui/react';
import { connect, ConnectedProps } from 'react-redux';

type TSearchTagSelectorProps = TPropsFromRedux & {};

const SearchTagSelectorImpl: React.FC<TSearchTagSelectorProps> = props => {
  const overAlternatives = useMemo(
    () => createListCollection({ items: props.overAlternatives }),
    [props.overAlternatives]
  );

  const valid = overAlternatives.items.some(item => item.value === props.alternativeId);

  return (
    <SingleSelect
      root={{
        size: 'md',
        minWidth: '120px',
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
      value={props.alternativeId}
      onChange={(overAlternativeId: string) => {
        props.setSearchAlternativeId(overAlternativeId);
      }}
    />
  );
};

// <redux>
const mapState = (state: TRootState) => ({
  overAlternatives: state.filters.overAlternatives,
  alternativeId: state.globalSearch.alternativeId,
  theme: state.theme.themes[state.theme.activeThemeIndex].toolbar.select,
});

const mapDispatch = {
  setSearchAlternativeId: setSearchAlternativeId.dispatch,
};

const connector = connect(mapState, mapDispatch);
type TPropsFromRedux = ConnectedProps<typeof connector>;

export const SearchTagSelector = connector(SearchTagSelectorImpl);
// </redux>
