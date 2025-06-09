/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file index.ts
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description Listeners index file.
 */

import { onApplyRegexTags } from './onApplyRegexTags';
import { onApplyFilters } from './onApplyFilters';
import { onChunkRequested } from './onChunkRequested';

const listeners = [onApplyRegexTags, onApplyFilters, onChunkRequested];

export { listeners, onApplyRegexTags, onApplyFilters, onChunkRequested };
