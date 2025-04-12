/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file reducer.ts
 * @author Alexandru Delegeanu
 * @version 0.8
 * @description LogRegexTags data reducer.
 */

import { makeReducer, ReducerMap } from '../common/reducer';
import { ActionType, DispatchTypes } from './actions';
import { defaultState, IDefaultState } from './data';

import * as handlers from './handlers';

const reducerMap: ReducerMap<ActionType, IDefaultState> = {
  [ActionType.Loading]: handlers.loading.reduce,
  [ActionType.InvokeGetTagsOK]: handlers.invokeGetTags.reduce.ok,
  [ActionType.InvokeGetTagsNOK]: handlers.invokeGetTags.reduce.nok,
  [ActionType.InvokeSetTagsOK]: handlers.invokeSetTags.reduce.ok,
  [ActionType.InvokeSetTagsNOK]: handlers.invokeSetTags.reduce.nok,
  [ActionType.AddNewTag]: handlers.addNewTag.reduce,
  [ActionType.RemoveTag]: handlers.removeTag.reduce,
  [ActionType.ToggleTagDisplay]: handlers.toggleTagDisplay.reduce,
  [ActionType.SetTagName]: handlers.setTagName.reduce,
  [ActionType.SetTagRegex]: handlers.setTagRegex.reduce,
};

export const logRegexTagsReducer = makeReducer<IDefaultState, ActionType, DispatchTypes>(
  defaultState,
  reducerMap
);
