/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file reducer.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description Common reducer utilities.
 */

export type TReducerMap<EActionType extends string, TStoreState> = Partial<
  Record<EActionType, (state: TStoreState, payload: any) => TStoreState>
>;

type TDispatchType<EActionType = any, TPayload = any> = {
  type: EActionType;
  payload?: TPayload;
};

export const makeReducer =
  <TStoreState, EActionType extends string, TDispatchTypes extends TDispatchType<any, any>>(
    _state: TStoreState,
    _reducerMap: TReducerMap<EActionType, TStoreState>
  ) =>
  (state: TStoreState = _state, action: TDispatchTypes): TStoreState => {
    const reducerFn = _reducerMap[action.type as EActionType];
    return reducerFn ? reducerFn(state, (action as any).payload) : state;
  };
