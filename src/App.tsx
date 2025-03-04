/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file App.tsx
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description App class
 */

import { ColorModeProvider } from '@/components/ui/color-mode';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

import Filters from '@/components/app/Filters';
import LogViewer from '@/components/app/LogViewer';
import Settings from '@/components/app/Settings';
import ToolBar from '@/components/app/ToolBar';
import { useState } from 'react';
import './App.css';

const App = () => {
  // todo: refactor to useSwitch
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [filtersMenuOpen, setFiltersMenuOpen] = useState(false);

  return (
    <main>
      <ChakraProvider value={defaultSystem}>
        <ColorModeProvider>
          <Settings menuOpen={settingsMenuOpen} onMenuClose={() => setSettingsMenuOpen(false)} />
          <ToolBar
            onSettingsOpen={() => setSettingsMenuOpen(true)}
            onFiltersOpen={() => setFiltersMenuOpen(!filtersMenuOpen)}
          />
          <LogViewer />
          <Filters filtersOpen={filtersMenuOpen} />
        </ColorModeProvider>
      </ChakraProvider>
    </main>
  );
};

export default App;
