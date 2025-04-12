/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file actions.ts
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description LogRegexTags action types.
 */

import { Dispatch as ReduxDispatch, UnknownAction } from '@reduxjs/toolkit';

import { AddNewTagAction } from './handlers/addNewTag';
import { InvokeGetTagsNOkAction, InvokeGetTagsOkAction } from './handlers/invokeGetTags';
import { InvokeSetTagsNOkAction, InvokeSetTagsOkAction } from './handlers/invokeSetTags';
import { LoadingAction } from './handlers/loading';
import { RemoveTagAction } from './handlers/removeTag';
import { SetTagNameAction } from './handlers/setTagName';
import { SetTagRegexAction } from './handlers/setTagRegex';
import { ToggleTagDisplayAction } from './handlers/toggleTagDisplay';

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

export type Dispatch = ReduxDispatch<DispatchTypes>;
