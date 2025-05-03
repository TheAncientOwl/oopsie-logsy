/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file LogsImporter.tsx
 * @author Alexandru Delegeanu
 * @version 0.8
 * @description Import logs button
 */

import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import { ImportIcon } from '@/components/ui/icons';
import { TRootState } from '@/store';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

// TODO: Make this a tab
const LogsImporterImpl: React.FC<TPropsFromRedux> = props => {
  // TODO: use array of log files instead of single file
  const handleImportClick = async () => {
    const selectedFile = await open({
      multiple: false,
      filters: [{ name: 'Log Files', extensions: ['log', 'txt'] }],
    });

    if (selectedFile) {
      try {
        const response = await invoke('set_current_log_paths', { paths: [selectedFile] });
        console.info(
          `${LogsImporterImpl.name}::${handleImportClick.name}`,
          `rust response: ${response}`
        );
      } catch (error) {
        console.error(
          `${LogsImporterImpl.name}::${handleImportClick.name}`,
          `error sending log file paths: ${error}`
        );
      }
    }
  };

  return (
    <TooltipIconButton
      tooltip='Import logs'
      onClick={handleImportClick}
      variant={props.theme.button.variant}
      colorPalette={props.theme.button.colorPalette}
    >
      <ImportIcon />
    </TooltipIconButton>
  );
};

// <redux>
const mapState = (state: TRootState) => ({
  theme: state.theme.themes[state.theme.activeThemeIndex].settings.logsImporter,
});

const mapDispatch = {};

const connector = connect(mapState, mapDispatch);
type TPropsFromRedux = ConnectedProps<typeof connector>;

export const LogsImporter = connector(LogsImporterImpl);
// </redux>
