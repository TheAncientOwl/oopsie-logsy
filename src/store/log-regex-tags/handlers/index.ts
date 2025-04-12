/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file index.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description Handlers index file.
 */

import { addNewTag } from './addNewTag';
import { invokeGetTags } from './invokeGetTags';
import { invokeSetTags } from './invokeSetTags';
import { loading } from './loading';
import { removeTag } from './removeTag';
import { setTagName } from './setTagName';
import { setTagRegex } from './setTagRegex';
import { toggleTagDisplay } from './toggleTagDisplay';

export {
  addNewTag,
  invokeGetTags,
  invokeSetTags,
  loading,
  removeTag,
  setTagName,
  setTagRegex,
  toggleTagDisplay,
};
