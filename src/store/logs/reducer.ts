/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file reducer.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Logs data reducer.
 */

import { makeReducer, makeReducerMap, NoStoreChangeListeners } from '../common/reducer';
import { EActionType, TDispatchTypes } from './actions';
import { defaultState, TStoreState } from './data';
import { apiCallHandlers, basicHandlers } from './handlers';

const reducerMap = makeReducerMap<EActionType, TStoreState>(
  basicHandlers,
  apiCallHandlers,
  NoStoreChangeListeners
);

export const logsReducer = makeReducer<TStoreState, EActionType, TDispatchTypes>(
  defaultState,
  reducerMap
);
