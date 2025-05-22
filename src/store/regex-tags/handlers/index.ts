/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file index.ts
 * @author Alexandru Delegeanu
 * @version 0.5
 * @description Handlers index file.
 */

import { addNewTag } from './addNewTag';
import { invokeApplyRegexTags } from './invokeApplyRegexTags';
import { invokeGetRegexTags } from './invokeGetRegexTags';
import { loading } from './loading';
import { removeTag } from './removeTag';
import { reorderTags } from './reorderTags';
import { setTagName } from './setTagName';
import { setTagRegex } from './setTagRegex';
import { toggleTagDisplay } from './toggleTagDisplay';

const basicHandlers = [
  addNewTag,
  loading,
  removeTag,
  reorderTags,
  setTagName,
  setTagRegex,
  toggleTagDisplay,
];

const apiCallHandlers = [invokeGetRegexTags, invokeApplyRegexTags];

export {
  addNewTag,
  apiCallHandlers,
  basicHandlers,
  invokeApplyRegexTags,
  invokeGetRegexTags,
  loading,
  removeTag,
  reorderTags,
  setTagName,
  setTagRegex,
  toggleTagDisplay,
};
