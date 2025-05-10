/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file App.tsx
 * @author Alexandru Delegeanu
 * @version 0.16
 * @description App class
 */

import FilterTabs from '@/components/app/filters';
import LogView from '@/components/app/log-view';
import Settings from '@/components/app/settings';
import ToolBar from '@/components/app/toolbar';
import { useSwitch } from '@/hooks/useSwitch';
import { TRootState } from '@/store';
import { Box } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';

const DRAG_HANDLE_HEIGHT = '3px';
const DEFAULT_FILTER_TABS_HEIGHT = '400px';
const MIN_FILTER_TABS_HEIGHT_VALUE = 100;
const MAX_FILTER_TABS_HEIGHT_RATIO = 0.9;

const updateLayoutHeights = (
  filtersMenuOpen: boolean,
  mainBoxRef: React.RefObject<HTMLDivElement>,
  filtersBoxRef: React.RefObject<HTMLDivElement>
) => {
  if (filtersMenuOpen) {
    if (mainBoxRef.current && filtersBoxRef.current) {
      if (filtersBoxRef.current.style.height === '') {
        filtersBoxRef.current.style.height = DEFAULT_FILTER_TABS_HEIGHT;
      }
      mainBoxRef.current.style.height = `calc(100vh - ${filtersBoxRef.current.style.height})`;
    }
  } else {
    if (mainBoxRef.current) {
      mainBoxRef.current.style.height = '100vh';
    }
  }
};

const AppImpl: React.FC<TPropsFromRedux> = props => {
  const [settingsMenuOpen, toggleSettingsMenu] = useSwitch(false);
  const [filtersMenuOpen, setFiltersMenuOpen] = useState(false);

  const toolbarRef = useRef<HTMLDivElement>(null);

  const mainBoxRef = useRef<HTMLDivElement>(null);
  const filtersBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWindowResize = () => {
      updateLayoutHeights(filtersMenuOpen, mainBoxRef, filtersBoxRef);
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [filtersMenuOpen, mainBoxRef, filtersBoxRef]);

  const toggleFiltersMenu = () => {
    const newFiltersMenuOpen = !filtersMenuOpen;
    updateLayoutHeights(newFiltersMenuOpen, mainBoxRef, filtersBoxRef);
    setFiltersMenuOpen(newFiltersMenuOpen);
  };

  const startVerticalResizing = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = filtersBoxRef.current?.offsetHeight || 0;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!filtersBoxRef.current || !mainBoxRef.current) return;

      const newFilterTabsHeight = startHeight + (startY - moveEvent.clientY);

      if (
        newFilterTabsHeight >= MIN_FILTER_TABS_HEIGHT_VALUE &&
        newFilterTabsHeight <= window.innerHeight * MAX_FILTER_TABS_HEIGHT_RATIO
      ) {
        filtersBoxRef.current.style.height = `${newFilterTabsHeight}px`;
        mainBoxRef.current.style.height = `${window.innerHeight - newFilterTabsHeight}px`;
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <>
      <Settings menuOpen={settingsMenuOpen} onMenuClose={toggleSettingsMenu} />

      <Box
        ref={mainBoxRef}
        height='100vh'
        position='relative'
        overflowY='scroll'
        backgroundColor={props.theme.background}
      >
        <ToolBar
          ref={toolbarRef}
          onSettingsToggle={toggleSettingsMenu}
          onFiltersToggle={toggleFiltersMenu}
        />
        <LogView offsetTop={`${toolbarRef.current?.offsetHeight}px`} />
      </Box>

      <Box
        ref={filtersBoxRef}
        height='400px'
        display={filtersMenuOpen ? 'block' : 'none'}
        visibility={filtersMenuOpen ? 'block' : 'collapse'}
      >
        <Box
          height={DRAG_HANDLE_HEIGHT}
          backgroundColor={props.theme.dragHandle}
          cursor='row-resize'
          onMouseDown={startVerticalResizing}
        />
        <FilterTabs />
      </Box>
    </>
  );
};

// <redux>
const mapState = (state: TRootState) => ({
  theme: state.theme.themes[state.theme.activeThemeIndex].general,
});

const mapDispatch = {};

const connector = connect(mapState, mapDispatch);
type TPropsFromRedux = ConnectedProps<typeof connector>;

export const App = connector(AppImpl);
// </redux>
