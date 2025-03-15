/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file App.tsx
 * @author Alexandru Delegeanu
 * @version 0.6
 * @description App class
 */

import { Box } from '@chakra-ui/react';

import ToolBar from '@/components/app/toolbar';
import Filters from '@/components/app/filters';
import LogView from '@/components/app/log-view';
import Settings from '@/components/app/settings';
import ThemeProvider from '@/components/app/theme';
import { ColorModeButton } from '@/components/ui/buttons/ColorModeButton';
import { useSwitch } from '@/hooks/useSwitch';

export const App = () => {
  const { state: settingsMenuOpen, toggle: toggleSettingsMenu } = useSwitch(false);
  const { state: filtersMenuOpen, toggle: toggleFiltersMenu } = useSwitch(false);

  return (
    <ThemeProvider>
      <ToolBar onSettingsOpen={toggleSettingsMenu} onFiltersOpen={toggleFiltersMenu} />
      <LogView />
      <Settings menuOpen={settingsMenuOpen} onMenuClose={toggleSettingsMenu} />
      <Filters filtersOpen={filtersMenuOpen} />
      {/* For dev accesibility purpose - light/dark mode switch */}
      <Box
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          background: 'green',
          border: '2px solid gray',
          borderRadius: '0.25em',
          zIndex: 8888,
        }}
      >
        <ColorModeButton />
      </Box>
    </ThemeProvider>
  );
};
