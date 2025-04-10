/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file types.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description LogRegexTags action types.
 */

import { Dispatch as ReduxDispatch, UnknownAction } from '@reduxjs/toolkit';
import { TRegexTag } from './reducer';

export enum ActionType {
  Loading = 'LogRegexTags__Loading',
  InvokeGetTagsOK = 'LogRegexTags__InvokeGetTagsOK',
  InvokeGetTagsNOK = 'LogRegexTags__InvokeGetTagsNOK',
  InvokeSetTagsOK = 'LogRegexTags__InvokeSetTagsOK',
  InvokeSetTagsNOK = 'LogRegexTags__InvokeSetTagsNOK',
  AddTag = 'LogRegexTags__AddTag',
  RemoveTag = 'LogRegexTags__RemoveTag',
  ToggleTagDisplay = 'LogRegexTags__ToggleTagDisplay',
  UpdateTagName = 'LogRegexTags__UpdateTagName',
  UpdateTagRegex = 'LogRegexTags__UpdateTagRegex',
}

interface IInvokeGetTagsOK {
  type: typeof ActionType.InvokeGetTagsOK;
  payload: Array<TRegexTag>;
}

interface IInvokeGetTagsNOK {
  type: typeof ActionType.InvokeGetTagsNOK;
  payload: any;
}

interface IInvokeSetTagsOK {
  type: typeof ActionType.InvokeSetTagsOK;
}

interface IInvokeSetTagsNOK {
  type: typeof ActionType.InvokeSetTagsNOK;
  payload: any;
}

interface IAddTag {
  type: typeof ActionType.AddTag;
}

export type TArrayUpdateIDPayload = {
  id: string;
};

interface IRemoveTag {
  type: typeof ActionType.RemoveTag;
  payload: TArrayUpdateIDPayload;
}

interface IToggleTagDisplay {
  type: typeof ActionType.ToggleTagDisplay;
  payload: TArrayUpdateIDPayload;
}

export type TArrayValueUpdatePayload = {
  id: string;
  value: string;
};

interface IUpdateTagName {
  type: typeof ActionType.UpdateTagName;
  payload: TArrayValueUpdatePayload;
}

interface IUpdateTagRegex {
  type: typeof ActionType.UpdateTagRegex;
  payload: TArrayValueUpdatePayload;
}

export type DispatchTypes =
  | UnknownAction
  | IInvokeGetTagsOK
  | IInvokeGetTagsNOK
  | IInvokeSetTagsOK
  | IInvokeSetTagsNOK
  | IAddTag
  | IRemoveTag
  | IToggleTagDisplay
  | IUpdateTagName
  | IUpdateTagRegex;

export type TDispatch = ReduxDispatch<DispatchTypes>;
