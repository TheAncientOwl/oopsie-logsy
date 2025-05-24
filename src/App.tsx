/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file App.tsx
 * @author Alexandru Delegeanu
 * @version 0.18
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
import LoadingScreen from './components/app/loading-screen';

const DRAG_HANDLE_HEIGHT = '3px';
const DEFAULT_FILTER_TABS_HEIGHT = '400px';
const MIN_FILTER_TABS_HEIGHT_VALUE = 150;
const LOGVIEW_HEIGHT_THRESHOLD = 5;

const updateLayoutHeights = (
  filtersMenuOpen: boolean,
  toolbarBoxRef: React.RefObject<HTMLDivElement>,
  logViewBoxRef: React.RefObject<HTMLDivElement>,
  filtersBoxRef: React.RefObject<HTMLDivElement>
) => {
  if (!toolbarBoxRef.current || !logViewBoxRef.current || !filtersBoxRef.current) return;

  if (filtersMenuOpen) {
    if (filtersBoxRef.current.style.height === '') {
      filtersBoxRef.current.style.height = DEFAULT_FILTER_TABS_HEIGHT;
    }
    logViewBoxRef.current.style.height = `calc(100vh - ${toolbarBoxRef.current.offsetHeight}px - ${filtersBoxRef.current.style.height})`;
  } else {
    logViewBoxRef.current.style.height = `calc(100vh - ${toolbarBoxRef.current.offsetHeight}px)`;
  }
};

const AppImpl: React.FC<TPropsFromRedux> = props => {
  const [settingsMenuOpen, toggleSettingsMenu] = useSwitch(true);
  const [filtersMenuOpen, setFiltersMenuOpen] = useState(false);

  const toolbarBoxRef = useRef<HTMLDivElement>(null);
  const logViewBoxRef = useRef<HTMLDivElement>(null);
  const filtersBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updateLayoutHeights(filtersMenuOpen, toolbarBoxRef, logViewBoxRef, filtersBoxRef);

    const handleWindowResize = () => {
      updateLayoutHeights(filtersMenuOpen, toolbarBoxRef, logViewBoxRef, filtersBoxRef);
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [filtersMenuOpen, toolbarBoxRef, logViewBoxRef, filtersBoxRef]);

  const toggleFiltersMenu = () => {
    const newFiltersMenuOpen = !filtersMenuOpen;
    updateLayoutHeights(newFiltersMenuOpen, toolbarBoxRef, logViewBoxRef, filtersBoxRef);
    setFiltersMenuOpen(newFiltersMenuOpen);
  };

  const startVerticalResizing = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = filtersBoxRef.current?.offsetHeight || 0;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!toolbarBoxRef.current || !filtersBoxRef.current || !logViewBoxRef.current) return;

      const newFilterTabsHeight = startHeight + (startY - moveEvent.clientY);

      if (
        newFilterTabsHeight >= MIN_FILTER_TABS_HEIGHT_VALUE &&
        newFilterTabsHeight <=
          window.innerHeight - toolbarBoxRef.current.offsetHeight - LOGVIEW_HEIGHT_THRESHOLD
      ) {
        filtersBoxRef.current.style.height = `${newFilterTabsHeight}px`;
        updateLayoutHeights(filtersMenuOpen, toolbarBoxRef, logViewBoxRef, filtersBoxRef);
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
    <Box height='100vh' width='100vw' backgroundColor={props.theme.background}>
      <Box ref={toolbarBoxRef} position='sticky' top='0' zIndex={100}>
        <ToolBar onSettingsToggle={toggleSettingsMenu} onFiltersToggle={toggleFiltersMenu} />
      </Box>

      <Box ref={logViewBoxRef} width='100vw' overflow='scroll'>
        <LogView />
      </Box>

      <Box
        ref={filtersBoxRef}
        // height='400px'
        display={filtersMenuOpen ? 'block' : 'none'}
        visibility={filtersMenuOpen ? 'block' : 'collapse'}
        zIndex={100}
      >
        <Box
          height={DRAG_HANDLE_HEIGHT}
          backgroundColor={props.theme.dragHandle}
          cursor='row-resize'
          onMouseDown={startVerticalResizing}
        />
        <FilterTabs />
      </Box>

      <LoadingScreen />
      <Settings menuOpen={settingsMenuOpen} onMenuClose={toggleSettingsMenu} />
    </Box>
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
