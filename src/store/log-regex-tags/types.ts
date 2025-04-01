/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file types.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description LogRegexTags action types.
 */

import { Dispatch as ReduxDispatch, UnknownAction } from '@reduxjs/toolkit';
import { RegexTag } from './reducer';

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

interface InvokeGetTagsOK {
  type: typeof ActionType.InvokeGetTagsOK;
  payload: Array<RegexTag>;
}

interface InvokeGetTagsNOK {
  type: typeof ActionType.InvokeGetTagsNOK;
  payload: any;
}

interface InvokeSetTagsOK {
  type: typeof ActionType.InvokeSetTagsOK;
}

interface InvokeSetTagsNOK {
  type: typeof ActionType.InvokeSetTagsNOK;
  payload: any;
}

interface AddTag {
  type: typeof ActionType.AddTag;
}

export interface ArrayUpdateID {
  id: string;
}

interface RemoveTag {
  type: typeof ActionType.RemoveTag;
  payload: ArrayUpdateID;
}

interface ToggleTagDisplay {
  type: typeof ActionType.ToggleTagDisplay;
  payload: ArrayUpdateID;
}

export interface ArrayValueUpdate {
  id: string;
  value: string;
}

interface UpdateTagName {
  type: typeof ActionType.UpdateTagName;
  payload: ArrayValueUpdate;
}

interface UpdateTagRegex {
  type: typeof ActionType.UpdateTagRegex;
  payload: ArrayValueUpdate;
}

export type DispatchTypes =
  | UnknownAction
  | InvokeGetTagsOK
  | InvokeGetTagsNOK
  | InvokeSetTagsOK
  | InvokeSetTagsNOK
  | AddTag
  | RemoveTag
  | ToggleTagDisplay
  | UpdateTagName
  | UpdateTagRegex;

export type Dispatch = ReduxDispatch<DispatchTypes>;
