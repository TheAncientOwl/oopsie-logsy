/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file reducer.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Common reducer utilities.
 */

export type ReducerMap<ActionType extends string, IDefaultState> = Partial<
  Record<ActionType, (state: IDefaultState, payload: any) => IDefaultState>
>;

type DispatchType<ActionType = any, Payload = any> = {
  type: ActionType;
  payload: Payload;
};

export const makeReducer =
  <IDefaultState, ActionType extends string, DispatchTypes extends DispatchType<any, any>>(
    _state: IDefaultState,
    _reducerMap: ReducerMap<ActionType, IDefaultState>
  ) =>
  (state: IDefaultState = _state, action: DispatchTypes): IDefaultState => {
    const reducerFn = _reducerMap[action.type as ActionType];
    return reducerFn ? reducerFn(state, (action as any).payload) : state;
  };
