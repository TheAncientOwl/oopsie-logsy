/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file reducer.ts
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description Common reducer utilities.
 */

import { IApiCallStoreHandler, IBasicStoreHandler, IStoreChangeListener } from './storeHandler';

export type TReducerMap<EActionType extends string, TStoreState> = Partial<
  Record<EActionType, (state: TStoreState, payload: any) => TStoreState>
>;

export const makeReducerMap = <EActionType extends string, TStoreState>(
  basicHandlers: undefined | Array<IBasicStoreHandler<TStoreState, EActionType, any, any[]>>,
  apiCallHandlers?: undefined | Array<IApiCallStoreHandler<any, any, EActionType, any, any, any>>,
  storeChangeListeners?: undefined | Array<IStoreChangeListener<TStoreState, any, EActionType>>
): TReducerMap<EActionType, TStoreState> => {
  const map: TReducerMap<EActionType, TStoreState> = {};

  if (basicHandlers !== undefined) {
    for (const handler of basicHandlers) {
      map[handler.action] = handler.reduce;
    }
  }

  if (apiCallHandlers !== undefined) {
    for (const handler of apiCallHandlers) {
      map[handler.action.ok] = handler.reduce.ok;
      map[handler.action.nok] = handler.reduce.nok;
    }
  }

  if (storeChangeListeners !== undefined) {
    for (const listener of storeChangeListeners) {
      map[listener.action] = listener.reduce;
    }
  }

  return map;
};

type TDispatchType<EActionType = any, TPayload = any> = {
  type: EActionType;
  payload?: TPayload;
};

export const makeReducer =
  <TStoreState, EActionType extends string, TDispatchTypes extends TDispatchType<any, any>>(
    _state: TStoreState,
    _reducerMap: TReducerMap<TDispatchTypes['type'], TStoreState>
  ) =>
  (state: TStoreState = _state, action: TDispatchTypes): TStoreState => {
    const reducerFn = _reducerMap[action.type as EActionType];
    return reducerFn ? reducerFn(state, (action as any).payload) : state;
  };
