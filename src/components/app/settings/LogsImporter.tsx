/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file LogsImporter.tsx
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description Import logs button
 */

import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import { ImportIcon } from '@/components/ui/Icons';
import { open } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';

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
        console.log('::LogsImportButton::handleImportClick: Rust response:', response);
      } catch (error) {
        console.error('::LogsImportButton::handleImportClick: Error sending log files', error);
      }
    }
  };

  return (
    <TooltipIconButton
      tooltip='Import logs'
      colorPalette='green'
      variant='surface'
      onClick={handleImportClick}
    >
      <ImportIcon />
    </TooltipIconButton>
  );
};
