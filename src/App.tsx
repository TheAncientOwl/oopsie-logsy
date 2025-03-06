/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file App.tsx
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description App class
 */

import { Box, ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';

import Filters from '@/components/app/filters';
import LogViewer from '@/components/app/logs/LogViewer';
import Settings from '@/components/app/settings/Settings';
import ToolBar from '@/components/app/toolbar/ToolBar';
import { ColorModeButton } from './components/ui/color-mode';

const App = () => {
  // todo: refactor to useSwitch
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [filtersMenuOpen, setFiltersMenuOpen] = useState(false);

  return (
    <>
      <ChakraProvider value={defaultSystem}>
        <ThemeProvider attribute='class' disableTransitionOnChange>
          <ToolBar
            onSettingsOpen={() => setSettingsMenuOpen(true)}
            onFiltersOpen={() => setFiltersMenuOpen(!filtersMenuOpen)}
          />
          <LogViewer />
          <Settings menuOpen={settingsMenuOpen} onMenuClose={() => setSettingsMenuOpen(false)} />
          <Filters filtersOpen={filtersMenuOpen} />
          {/* For dev accesibility purpose - light/dark mode switch */}
          <Box
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              background: 'tomato',
              border: '2px solid cyan',
              borderRadius: '0.25em',
              zIndex: 8888,
            }}
          >
            <ColorModeButton />
          </Box>
        </ThemeProvider>
      </ChakraProvider>
    </>
  );
};

export default App;
