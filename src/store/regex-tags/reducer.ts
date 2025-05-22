/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file reducer.ts
 * @author Alexandru Delegeanu
 * @version 0.13
 * @description LogRegexTags data reducer.
 */

import { makeReducer, makeReducerMap, NoStoreChangeListeners } from '../common/reducer';
import { EActionType, type TDispatchTypes } from './actions';
import { defaultState, type TStoreState } from './data';

import { apiCallHandlers, basicHandlers } from './handlers';

const reducerMap = makeReducerMap<EActionType, TStoreState>(
  basicHandlers,
  apiCallHandlers,
  NoStoreChangeListeners
);

export const logRegexTagsReducer = makeReducer<TStoreState, EActionType, TDispatchTypes>(
  defaultState,
  reducerMap
);
