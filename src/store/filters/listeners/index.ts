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

import { onLogRegexTagsGet, onLogRegexTagsSet } from './onLogRegexTagsChanged';

const listeners = [onLogRegexTagsSet, onLogRegexTagsGet];

export { listeners, onLogRegexTagsGet, onLogRegexTagsSet };
