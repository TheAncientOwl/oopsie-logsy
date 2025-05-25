/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file index.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description Listeners index file.
 */

import { onApplyRegexTags } from './onApplyRegexTags';
import { onApplyFilters } from './onApplyFilters';

const listeners = [onApplyRegexTags, onApplyFilters];

export { listeners, onApplyRegexTags, onApplyFilters };
