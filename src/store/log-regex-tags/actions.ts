/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file actions.ts
 * @author Alexandru Delegeanu
 * @version 0.6
 * @description LogRegexTags action types.
 */

import { Dispatch as ReduxDispatch, UnknownAction } from '@reduxjs/toolkit';

import { type TAddNewTagAction } from './handlers/addNewTag';
import {
  type TInvokeGetTagsNOkAction,
  type TInvokeGetTagsOkAction,
} from './handlers/invokeGetTags';
import {
  type TInvokeSetTagsNOkAction,
  type TInvokeSetTagsOkAction,
} from './handlers/invokeSetTags';
import { type TLoadingAction } from './handlers/loading';
import { type TRemoveTagAction } from './handlers/removeTag';
import { type TReorderTagsAction } from './handlers/reorderTags';
import { type TSetTagNameAction } from './handlers/setTagName';
import { type TSetTagRegexAction } from './handlers/setTagRegex';
import { type ToggleTagDisplayAction } from './handlers/toggleTagDisplay';

export enum EActionType {
  Loading = 'LogRegexTags__Loading',
  InvokeGetTagsOK = 'LogRegexTags__InvokeGetTagsOK',
  InvokeGetTagsNOK = 'LogRegexTags__InvokeGetTagsNOK',
  InvokeSetTagsOK = 'LogRegexTags__InvokeSetTagsOK',
  InvokeSetTagsNOK = 'LogRegexTags__InvokeSetTagsNOK',
  AddNewTag = 'LogRegexTags__AddNewTag',
  RemoveTag = 'LogRegexTags__RemoveTag',
  TToggleTagDisplay = 'LogRegexTags__ToggleTagDisplay',
  SetTagName = 'LogRegexTags__SetTagName',
  SetTagRegex = 'LogRegexTags__SetTagRegex',
  ReorderRegexTags = 'LogRegexTags__Reorder',
}

export type TDispatchTypes =
  | UnknownAction
  | TLoadingAction
  | TInvokeGetTagsOkAction
  | TInvokeGetTagsNOkAction
  | TInvokeSetTagsOkAction
  | TInvokeSetTagsNOkAction
  | TAddNewTagAction
  | TRemoveTagAction
  | ToggleTagDisplayAction
  | TSetTagNameAction
  | TSetTagRegexAction
  | TReorderTagsAction;

export type TDispatch = ReduxDispatch<TDispatchTypes>;
