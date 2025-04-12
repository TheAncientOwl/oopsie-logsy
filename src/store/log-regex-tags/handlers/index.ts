/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file index.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Handlers index file.
 */

import { invokeGetTags } from './invokeGetTags';
import { invokeSetTags } from './invokeSetTags';
import { addNewTag } from './addNewTag';
import { removeTag } from './removeTag';
import { setTagName } from './setTagName';
import { setTagRegex } from './setTagRegex';
import { toggleTagDisplay } from './toggleTagDisplay';

export {
  addNewTag,
  invokeGetTags,
  invokeSetTags,
  removeTag,
  setTagName,
  setTagRegex,
  toggleTagDisplay,
};
