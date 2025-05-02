/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file reducer.ts
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description Common reducer utilities.
 */

import { IApiCallStoreHandler, IBasicStoreHandler, IStoreChangeListener } from './storeHandler';

export type TReducerMap<EActionType extends string, TStoreState> = Partial<
  Record<EActionType, (state: TStoreState, payload: any) => TStoreState>
>;

export const NoBasicHandlers = undefined;
export const NoApiCallHandlers = undefined;
export const NoStoreChangeListeners = undefined;

export const makeReducerMap = <EActionType extends string, TStoreState>(
  basicHandlers:
    | typeof NoBasicHandlers
    | Array<IBasicStoreHandler<TStoreState, EActionType, any, any[]>>,
  apiCallHandlers?:
    | typeof NoApiCallHandlers
    | Array<IApiCallStoreHandler<any, any, EActionType, any, any, any>>,
  storeChangeListeners?:
    | typeof NoStoreChangeListeners
    | Array<IStoreChangeListener<TStoreState, any, EActionType>>
): TReducerMap<EActionType, TStoreState> => {
  const map: TReducerMap<EActionType, TStoreState> = {};

  if (basicHandlers !== NoBasicHandlers) {
    for (const handler of basicHandlers) {
      map[handler.action] = handler.reduce;
    }
  }

  if (apiCallHandlers !== NoApiCallHandlers) {
    for (const handler of apiCallHandlers) {
      map[handler.action.ok] = handler.reduce.ok;
      map[handler.action.nok] = handler.reduce.nok;
    }
  }

  if (storeChangeListeners !== NoStoreChangeListeners) {
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
