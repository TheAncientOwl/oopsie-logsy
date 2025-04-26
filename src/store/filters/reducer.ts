/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file reducer.ts
 * @author Alexandru Delegeanu
 * @version 0.20
 * @description Filters data reducer.
 */

import { makeReducer, makeReducerMap } from '../common/reducer';
import { EActionType as ELogRegexTagsActionType } from '../log-regex-tags/actions';
import { EActionType, type TDispatchTypes } from './actions';
import { defaultState, type TStoreState } from './data';

import { basicHandlers, apiCallHandlers } from './handlers';
import { listeners } from './listeners';

type TCompoundActionType = EActionType | ELogRegexTagsActionType;

const reducerMap = makeReducerMap<TCompoundActionType, TStoreState>(
  basicHandlers,
  apiCallHandlers,
  listeners
);

export const filtersTagsReducer = makeReducer<TStoreState, TCompoundActionType, TDispatchTypes>(
  defaultState,
  reducerMap
);
