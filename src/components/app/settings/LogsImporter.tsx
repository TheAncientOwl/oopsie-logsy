/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file LogsImporter.tsx
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Import logs button
 */

import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import { ImportIcon } from '@/components/ui/Icons';

export const LogsImportButton = () => {
  return (
    <TooltipIconButton tooltip='Import logs' colorPalette='green' variant='surface'>
      <ImportIcon />
    </TooltipIconButton>
  );
};
