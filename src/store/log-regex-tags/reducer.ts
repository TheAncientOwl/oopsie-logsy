/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file reducer.ts
 * @author Alexandru Delegeanu
 * @version 0.9
 * @description LogRegexTags data reducer.
 */

import { makeReducer, type TReducerMap } from '../common/reducer';
import { ELogRegexTagsAction, type TLogRegexTagsDispatchTypes } from './actions';
import { defaultState, type TLogRegexTagsStoreState } from './data';

import * as handlers from './handlers';

const reducerMap: TReducerMap<ELogRegexTagsAction, TLogRegexTagsStoreState> = {
  [ELogRegexTagsAction.Loading]: handlers.loading.reduce,
  [ELogRegexTagsAction.InvokeGetTagsOK]: handlers.invokeGetTags.reduce.ok,
  [ELogRegexTagsAction.InvokeGetTagsNOK]: handlers.invokeGetTags.reduce.nok,
  [ELogRegexTagsAction.InvokeSetTagsOK]: handlers.invokeSetTags.reduce.ok,
  [ELogRegexTagsAction.InvokeSetTagsNOK]: handlers.invokeSetTags.reduce.nok,
  [ELogRegexTagsAction.AddNewTag]: handlers.addNewTag.reduce,
  [ELogRegexTagsAction.RemoveTag]: handlers.removeTag.reduce,
  [ELogRegexTagsAction.ToggleTagDisplay]: handlers.toggleTagDisplay.reduce,
  [ELogRegexTagsAction.SetTagName]: handlers.setTagName.reduce,
  [ELogRegexTagsAction.SetTagRegex]: handlers.setTagRegex.reduce,
};

export const logRegexTagsReducer = makeReducer<
  TLogRegexTagsStoreState,
  ELogRegexTagsAction,
  TLogRegexTagsDispatchTypes
>(defaultState, reducerMap);
