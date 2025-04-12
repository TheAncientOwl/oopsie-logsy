/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file reducer.ts
 * @author Alexandru Delegeanu
 * @version 0.7
 * @description LogRegexTags data reducer.
 */

import { Reducer, Dispatch as ReduxDispatch } from '@reduxjs/toolkit';
import { ActionType, DispatchTypes } from './actions';
import { defaultState, IDefaultState } from './data';
import { addNewTag, AddNewTagPayload } from './handlers/addNewTag';
import {
  invokeGetTags,
  InvokeGetTagsNOkPayload,
  InvokeGetTagsOkPayload,
} from './handlers/invokeGetTags';
import {
  invokeSetTags,
  InvokeSetTagsNOkPayload,
  InvokeSetTagsOkPayload,
} from './handlers/invokeSetTags';
import { loading, LoadingPayload } from './handlers/loading';
import { removeTag, RemoveTagPayload } from './handlers/removeTag';
import { setTagName, SetTagNamePayload } from './handlers/setTagName';
import { setTagRegex, SetTagRegexPayload } from './handlers/setTagRegex';
import { toggleTagDisplay, ToggleTagDisplayPayload } from './handlers/toggleTagDisplay';

export type Dispatch = ReduxDispatch<DispatchTypes>;

export const logRegexTagsReducer: Reducer<IDefaultState, DispatchTypes> = (
  state: IDefaultState = defaultState,
  action: DispatchTypes
): IDefaultState => {
  switch (action.type) {
    case ActionType.Loading:
      return loading.reduce(state, action.payload as LoadingPayload);

    case ActionType.InvokeGetTagsOK:
      return invokeGetTags.reduce.ok(state, action.payload as InvokeGetTagsOkPayload);
    case ActionType.InvokeGetTagsNOK:
      return invokeGetTags.reduce.nok(state, action.payload as InvokeGetTagsNOkPayload);

    case ActionType.InvokeSetTagsOK:
      return invokeSetTags.reduce.ok(state, action.payload as InvokeSetTagsOkPayload);
    case ActionType.InvokeSetTagsNOK:
      return invokeSetTags.reduce.nok(state, action.payload as InvokeSetTagsNOkPayload);

    case ActionType.AddNewTag:
      return addNewTag.reduce(state, action.payload as AddNewTagPayload);
    case ActionType.RemoveTag:
      return removeTag.reduce(state, action.payload as RemoveTagPayload);
    case ActionType.ToggleTagDisplay:
      return toggleTagDisplay.reduce(state, action.payload as ToggleTagDisplayPayload);
    case ActionType.SetTagName:
      return setTagName.reduce(state, action.payload as SetTagNamePayload);
    case ActionType.SetTagRegex:
      return setTagRegex.reduce(state, action.payload as SetTagRegexPayload);

    default:
      return state;
  }
};
