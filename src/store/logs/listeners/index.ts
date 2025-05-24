/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file index.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Listeners index file.
 */

import { onApplyRegexTags } from './onApplyRegexTags';

const listeners = [onApplyRegexTags];

export { listeners, onApplyRegexTags };
