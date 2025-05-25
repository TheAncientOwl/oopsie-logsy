/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file reducer.ts
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description Logs data reducer.
 */

import { makeReducer, makeReducerMap } from '../common/reducer';
import { EActionType as ELogRegexTagsActionType } from '../regex-tags/actions';
import { EActionType as EFiltersActionType } from '../filters/actions';
import { EActionType, TDispatchTypes } from './actions';
import { defaultState, TStoreState } from './data';
import { apiCallHandlers, basicHandlers } from './handlers';
import { listeners } from './listeners';

type TCompoundActionType = EActionType | ELogRegexTagsActionType | EFiltersActionType;

const reducerMap = makeReducerMap<TCompoundActionType, TStoreState>(
  basicHandlers,
  apiCallHandlers,
  listeners
);

export const logsReducer = makeReducer<TStoreState, EActionType, TDispatchTypes>(
  defaultState,
  reducerMap
);
