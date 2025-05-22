/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file actions.ts
 * @author Alexandru Delegeanu
 * @version 0.7
 * @description LogRegexTags action types.
 */

import { Dispatch as ReduxDispatch, UnknownAction } from '@reduxjs/toolkit';

import { type TAddNewTagAction } from './handlers/addNewTag';
import {
  type TInvokeGetRegexTagsNOkAction,
  type TInvokeGetRegexTagsOkAction,
} from './handlers/invokeGetRegexTags';
import {
  type TInvokeApplyRegexTagsNOkAction,
  type TInvokeApplyRegexTagsOkAction,
} from './handlers/invokeApplyRegexTags';
import { type TLoadingAction } from './handlers/loading';
import { type TRemoveTagAction } from './handlers/removeTag';
import { type TReorderTagsAction } from './handlers/reorderTags';
import { type TSetTagNameAction } from './handlers/setTagName';
import { type TSetTagRegexAction } from './handlers/setTagRegex';
import { type ToggleTagDisplayAction } from './handlers/toggleTagDisplay';

export enum EActionType {
  Loading = 'LogRegexTags__Loading',
  InvokeGetRegexTagsOK = 'LogRegexTags__InvokeGetTagsOK',
  InvokeGetRegexTagsNOK = 'LogRegexTags__InvokeGetTagsNOK',
  InvokeApplyRegexTagssOK = 'LogRegexTags__InvokeApplyRegexTagssOK',
  InvokeApplyRegexTagssNOK = 'LogRegexTags__InvokeApplyRegexTagssNOK',
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
  | TInvokeGetRegexTagsOkAction
  | TInvokeGetRegexTagsNOkAction
  | TInvokeApplyRegexTagsOkAction
  | TInvokeApplyRegexTagsNOkAction
  | TAddNewTagAction
  | TRemoveTagAction
  | ToggleTagDisplayAction
  | TSetTagNameAction
  | TSetTagRegexAction
  | TReorderTagsAction;

export type TDispatch = ReduxDispatch<TDispatchTypes>;
