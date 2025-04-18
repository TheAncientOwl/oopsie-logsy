/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file LogsImporter.tsx
 * @author Alexandru Delegeanu
 * @version 0.5
 * @description Import logs button
 */

import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import { ImportIcon } from '@/components/ui/Icons';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';

export const LogsImportButton = () => {
  // TODO: use array of log files instead of single file
  const handleImportClick = async () => {
    const selectedFile = await open({
      multiple: false,
      filters: [{ name: 'Log Files', extensions: ['log', 'txt'] }],
    });

    if (selectedFile) {
      try {
        const response = await invoke('set_current_log_paths', { paths: [selectedFile] });
        console.traceX(
          `${LogsImportButton.name}::${handleImportClick.name}`,
          `rust response: ${response}`
        );
      } catch (error) {
        console.errorX(
          `${LogsImportButton.name}::${handleImportClick.name}`,
          `error sending log file paths: ${error}`
        );
      }
    }
  };

  return (
    <TooltipIconButton
      tooltip='Import logs'
      colorPalette='green'
      variant='outline'
      onClick={handleImportClick}
    >
      <ImportIcon />
    </TooltipIconButton>
  );
};
