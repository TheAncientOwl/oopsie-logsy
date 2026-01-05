/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2026                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file SearchInput.tsx
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Search input component.
 */

import { TRootState } from '@/store';
import { setSearchPattern } from '@/store/global-search/handlers';
import { Input } from '@chakra-ui/react';
import { connect, ConnectedProps } from 'react-redux';

export const SearchInputImpl: React.FC<TPropsFromRedux> = props => {
  return (
    <Input
      placeholder='search'
      value={props.searchPattern}
      onChange={e => props.setSearchPattern(e.target.value)}
      backgroundColor={props.theme.input.background}
      colorPalette={props.theme.input.colorPalette}
      variant={props.theme.input.variant}
      color={props.theme.input.text}
    />
  );
};

// <redux>
const mapState = (state: TRootState) => ({
  searchPattern: state.globalSearch.searchPattern,
  theme: state.theme.themes[state.theme.activeThemeIndex].toolbar,
});

const mapDispatch = { setSearchPattern: setSearchPattern.dispatch };

const connector = connect(mapState, mapDispatch, null, { forwardRef: true });
type TPropsFromRedux = ConnectedProps<typeof connector>;

export const SearchInput = connector(SearchInputImpl);
// </redux>
