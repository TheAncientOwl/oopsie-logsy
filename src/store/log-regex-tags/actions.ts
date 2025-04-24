/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file actions.ts
 * @author Alexandru Delegeanu
 * @version 0.4
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
import { type TSetTagNameAction } from './handlers/setTagName';
import { type TSetTagRegexAction } from './handlers/setTagRegex';
import { type ToggleTagDisplayAction } from './handlers/toggleTagDisplay';

export enum ELogRegexTagsAction {
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

export type TLogRegexTagsDispatchTypes =
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
  | TSetTagRegexAction;

export type TLogRegexTagsDispatch = ReduxDispatch<TLogRegexTagsDispatchTypes>;
