/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file App.tsx
 * @author Alexandru Delegeanu
 * @version 0.14
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

const AppImpl: React.FC<TPropsFromRedux> = props => {
  const [settingsMenuOpen, toggleSettingsMenu] = useSwitch(false);
  const [filtersMenuOpen, toggleFiltersMenu] = useSwitch(true);

  const toolbarRef = useRef<HTMLDivElement>(null);
  const [toolbarHeight, setToolbarHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(`100vh`);

  useEffect(() => {
    if (toolbarRef.current) {
      setToolbarHeight(toolbarRef.current.offsetHeight);
    }
  }, []);

  return (
    <>
      <Box height={contentHeight} overflow='scroll' backgroundColor={props.theme.background}>
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
