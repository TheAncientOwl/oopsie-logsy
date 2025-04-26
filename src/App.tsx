/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file App.tsx
 * @author Alexandru Delegeanu
 * @version 0.12
 * @description App class
 */

import FilterTabs from '@/components/app/filters';
import LogView from '@/components/app/log-view';
import Settings from '@/components/app/settings';
import ToolBar from '@/components/app/toolbar';
import { useSwitch } from '@/hooks/useSwitch';
import { store } from '@/store';
import { Box } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

const CONTENT_HEIGHTS = {
  whenFiltersOpen: 55,
  whenFiltersClosed: 100,
};

export const App = () => {
  const [settingsMenuOpen, toggleSettingsMenu] = useSwitch(false);
  const [filtersMenuOpen, toggleFiltersMenu] = useSwitch(true);

  const toolbarRef = useRef<HTMLDivElement>(null);
  const [toolbarHeight, setToolbarHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(`${CONTENT_HEIGHTS.whenFiltersClosed}vh`);

  useEffect(() => {
    if (toolbarRef.current) {
      setToolbarHeight(toolbarRef.current.offsetHeight);
    }
  }, []);

  return (
    <ReduxProvider store={store}>
      <Box height={contentHeight} overflow='scroll'>
        <ToolBar
          _ref={toolbarRef}
          onSettingsOpen={toggleSettingsMenu}
          onFiltersToggle={() => {
            if (filtersMenuOpen) {
              setContentHeight(`100vh`);
            }
            toggleFiltersMenu();
          }}
        />
        <LogView offsetTop={`${toolbarHeight}px`} />
      </Box>
      <Settings menuOpen={settingsMenuOpen} onMenuClose={toggleSettingsMenu} />
      <FilterTabs
        onHeightChange={newHeight => {
          setContentHeight(`${window.innerHeight - newHeight}px`);
        }}
        filtersOpen={filtersMenuOpen}
      />
    </ReduxProvider>
  );
};
