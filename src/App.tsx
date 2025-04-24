/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file App.tsx
 * @author Alexandru Delegeanu
 * @version 0.9
 * @description App class
 */

import FilterTabs from '@/components/app/filters';
import LogView from '@/components/app/log-view';
import Settings from '@/components/app/settings';
import ToolBar from '@/components/app/toolbar';
import { useSwitch } from '@/hooks/useSwitch';
import { Box } from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';

const CONTENT_HEIGHTS = {
  whenFiltersOpen: 55,
  whenFiltersClosed: 100,
};

export const App = () => {
  const [settingsMenuOpen, toggleSettingsMenu] = useSwitch(false);
  const [filtersMenuOpen, toggleFiltersMenu] = useSwitch(false);

  const toolbarRef = useRef<HTMLDivElement>(null);
  const [toolbarHeight, setToolbarHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(`${CONTENT_HEIGHTS.whenFiltersClosed}vh`);

  useEffect(() => {
    if (toolbarRef.current) {
      setToolbarHeight(toolbarRef.current.offsetHeight);
    }
  }, []);

  const resizeIntervalRef = useRef<number | null>(null);

  const handleFiltersToggle = useCallback(() => {
    if (resizeIntervalRef.current) {
      clearInterval(resizeIntervalRef.current);
      resizeIntervalRef.current = null;
    }

    const targetHeight = filtersMenuOpen
      ? CONTENT_HEIGHTS.whenFiltersClosed
      : CONTENT_HEIGHTS.whenFiltersOpen;

    const difference = CONTENT_HEIGHTS.whenFiltersClosed - CONTENT_HEIGHTS.whenFiltersOpen;
    const step = difference / (filtersMenuOpen ? 1 : 4);

    let currentHeight = parseFloat(contentHeight);
    resizeIntervalRef.current = setInterval(() => {
      currentHeight += filtersMenuOpen ? step : -step;
      currentHeight = Math.max(
        CONTENT_HEIGHTS.whenFiltersOpen,
        Math.min(CONTENT_HEIGHTS.whenFiltersClosed, currentHeight)
      );

      setContentHeight(`${currentHeight}vh`);

      if (currentHeight === targetHeight) {
        clearInterval(resizeIntervalRef.current!);
        resizeIntervalRef.current = null;
      }
    }, 100);

    toggleFiltersMenu();
  }, [filtersMenuOpen, toggleFiltersMenu, contentHeight, setContentHeight]);

  return (
    <ReduxProvider store={store}>
      <Box height={contentHeight} overflow='scroll'>
        <ToolBar
          _ref={toolbarRef}
          onSettingsOpen={toggleSettingsMenu}
          onFiltersToggle={handleFiltersToggle}
        />
        <LogView offsetTop={`${toolbarHeight}px`} />
      </Box>
      <Settings menuOpen={settingsMenuOpen} onMenuClose={toggleSettingsMenu} />
      <FilterTabs filtersOpen={filtersMenuOpen} />
    </ReduxProvider>
  );
};
