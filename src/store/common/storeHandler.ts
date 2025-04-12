/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file dispatchers.ts
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description Dispatcher helpers.
 */

type PayloadMaker<Payload> = () => Payload;

export const basicDispatcher =
  <Payload, ActionType>(type: ActionType, makePayload: PayloadMaker<Payload>) =>
  (dispatch: (action: { type: ActionType; payload: Payload }) => void) => {
    dispatch({ type, payload: makePayload() });
  };

// <dispatchers>
type SingleDispatcher<ActionType, Payload> = (
  ...args: any[]
) => (dispatch: (action: { type: ActionType; payload: Payload }) => void) => void;

type AsyncMultiDispatcher<Dispatch> = (...args: any[]) => (dispatch: Dispatch) => Promise<void>;
// </dispatchers>

// <reducers>
type Reducer<IDefaultState, Payload> = (state: IDefaultState, payload: Payload) => IDefaultState;

type ResponseReducer<IDefaultState, PayloadOK, PayloadNOK> = {
  ok: Reducer<IDefaultState, PayloadOK>;
  nok: Reducer<IDefaultState, PayloadNOK>;
};
// </reducers>

// <handlers
export interface IStoreHandler<
  TDispatcher extends SingleDispatcher<any, any> | AsyncMultiDispatcher<any>,
  TReducer extends Reducer<any, any> | ResponseReducer<any, any, any>
> {
  dispatch: TDispatcher;
  reduce: TReducer;
}

export interface IBasicStoreHandler<IDefaultState, Payload, ActionType>
  extends IStoreHandler<SingleDispatcher<ActionType, Payload>, Reducer<IDefaultState, Payload>> {}

export interface IApiCallStoreHandler<IDefaultState, Dispatch, PayloadOK, PayloadNOK>
  extends IStoreHandler<
    AsyncMultiDispatcher<Dispatch>,
    ResponseReducer<IDefaultState, PayloadOK, PayloadNOK>
  > {}
// </handlers>
