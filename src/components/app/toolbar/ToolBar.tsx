/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file ToolBar.tsx
 * @author Alexandru Delegeanu
 * @version 0.11
 * @description App main toolbar
 */

import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import { FiltersIcon, NextIcon, PrevIcon, SearchIcon, SettingsIcon } from '@/components/ui/icons';
import { TRootState } from '@/store';
import {
  invokeApplySearch,
  invokeNextSearch,
  invokePrevSearch,
  invokeSearchGetActiveData,
} from '@/store/global-search/handlers';
import { ButtonGroup, Flex, Separator, Spinner } from '@chakra-ui/react';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { SearchInput } from './SearchInput';
import { SearchTagSelector } from './SearchTagSelector';

type TToolBarProps = {
  onSettingsToggle: () => void;
  onFiltersToggle: () => void;
};

const ToolBarImpl: React.FC<TToolBarProps & TPropsFromRedux> = props => {
  return (
    <Flex
      position='sticky'
      top='0'
      padding='0.5em'
      gap='0.5em'
      justify='center'
      alignItems='center'
      backgroundColor={props.theme.background}
    >
      <Flex gap='0.25em'>
        <ButtonGroup>
          <TooltipIconButton
            tooltip='Open Settings'
            onClick={props.onSettingsToggle}
            variant={props.theme.buttons.settings.variant}
            colorPalette={props.theme.buttons.settings.colorPalette}
          >
            <SettingsIcon />
          </TooltipIconButton>

          <TooltipIconButton
            tooltip='Toggle filters'
            onClick={props.onFiltersToggle}
            variant={props.theme.buttons.filters.variant}
            colorPalette={props.theme.buttons.filters.colorPalette}
          >
            <FiltersIcon />
          </TooltipIconButton>
        </ButtonGroup>

        <Separator
          variant='solid'
          margin='auto 5px'
          size='lg'
          height='35px'
          borderStartWidth='medium'
          borderColor='green.700'
        />

        <SearchTagSelector />

        <ButtonGroup>
          <TooltipIconButton
            disabled={props.searchInProgress || props.searchPattern === ''}
            tooltip='Search'
            onClick={() => props.invokeApplySearch(props.alternativeId, props.searchPattern)}
            variant={props.theme.buttons.search.variant}
            colorPalette={props.theme.buttons.search.colorPalette}
          >
            {props.searchInProgress ? <Spinner /> : <SearchIcon />}
          </TooltipIconButton>

          <TooltipIconButton
            disabled={!props.hasPrev || props.searchInProgress}
            onClick={() => props.invokePrevSearch()}
            tooltip='Prev'
            variant={props.theme.buttons.prev.variant}
            colorPalette={props.theme.buttons.prev.colorPalette}
          >
            <PrevIcon />
          </TooltipIconButton>

          <TooltipIconButton
            disabled={!props.hasNext || props.searchInProgress}
            onClick={() => props.invokeNextSearch()}
            tooltip='Next'
            variant={props.theme.buttons.next.variant}
            colorPalette={props.theme.buttons.next.colorPalette}
          >
            <NextIcon />
          </TooltipIconButton>
        </ButtonGroup>
      </Flex>
      <SearchInput />
    </Flex>
  );
};

// <redux>
const mapState = (state: TRootState) => ({
  hasPrev: state.globalSearch.searchResult.hasPrev,
  hasNext: state.globalSearch.searchResult.hasNext,
  searchInProgress: state.globalSearch.searchLoading,
  alternativeId: state.globalSearch.alternativeId,
  searchPattern: state.globalSearch.searchPattern,
  theme: state.theme.themes[state.theme.activeThemeIndex].toolbar,
});

const mapDispatch = {
  invokeSearchGetActiveData: invokeSearchGetActiveData.dispatch,
  invokeApplySearch: invokeApplySearch.dispatch,
  invokeNextSearch: invokeNextSearch.dispatch,
  invokePrevSearch: invokePrevSearch.dispatch,
};

const connector = connect(mapState, mapDispatch, null, { forwardRef: true });
type TPropsFromRedux = ConnectedProps<typeof connector>;

export const ToolBar = connector(ToolBarImpl);
// </redux>
