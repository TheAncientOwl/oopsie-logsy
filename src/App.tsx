/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file App.tsx
 * @author Alexandru Delegeanu
 * @version 0.8
 * @description App class
 */

import Filters from '@/components/app/filters';
import LogView from '@/components/app/log-view';
import Settings from '@/components/app/settings';
import ToolBar from '@/components/app/toolbar';
import { useSwitch } from '@/hooks/useSwitch';

export const App = () => {
  const [settingsMenuOpen, toggleSettingsMenu] = useSwitch(false);
  const [filtersMenuOpen, toggleFiltersMenu] = useSwitch(false);

  return (
    <>
      <ToolBar onSettingsOpen={toggleSettingsMenu} onFiltersOpen={toggleFiltersMenu} />
      <LogView />
      <Settings menuOpen={settingsMenuOpen} onMenuClose={toggleSettingsMenu} />
      <Filters filtersOpen={filtersMenuOpen} />
    </>
  );
};
