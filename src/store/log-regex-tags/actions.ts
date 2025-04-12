/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file actions.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description LogRegexTags action types.
 */

import { UnknownAction } from '@reduxjs/toolkit';
import { InvokeGetTagsNOkAction, InvokeGetTagsOkAction } from './handlers/invokeGetTags';
import { InvokeSetTagsNOkAction, InvokeSetTagsOkAction } from './handlers/invokeSetTags';
import { LoadingAction } from './handlers/loading';
import { AddNewTagAction } from './handlers/addNewTag';
import { RemoveTagAction } from './handlers/removeTag';
import { ToggleTagDisplayAction } from './handlers/toggleTagDisplay';
import { SetTagNameAction } from './handlers/setTagName';
import { SetTagRegexAction } from './handlers/setTagRegex';

export enum ActionType {
  Loading = 'LogRegexTags__Loading',
  InvokeGetTagsOK = 'LogRegexTags__InvokeGetTagsOK',
  InvokeGetTagsNOK = 'LogRegexTags__InvokeGetTagsNOK',
  InvokeSetTagsOK = 'LogRegexTags__InvokeSetTagsOK',
  InvokeSetTagsNOK = 'LogRegexTags__InvokeSetTagsNOK',
  AddNewTag = 'LogRegexTags__AddNewTag',
  RemoveTag = 'LogRegexTags__RemoveTag',
  ToggleTagDisplay = 'LogRegexTags__ToggleTagDisplay',
  SetTagName = 'LogRegexTags__SetTagName',
  SetTagRegex = 'LogRegexTags__SetTagRegex',
}

export type DispatchTypes =
  | UnknownAction
  | LoadingAction
  | InvokeGetTagsOkAction
  | InvokeGetTagsNOkAction
  | InvokeSetTagsOkAction
  | InvokeSetTagsNOkAction
  | AddNewTagAction
  | RemoveTagAction
  | ToggleTagDisplayAction
  | SetTagNameAction
  | SetTagRegexAction;
