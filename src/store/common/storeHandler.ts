/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file dispatchers.ts
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description Dispatcher helpers.
 */

type TPayloadMaker<Payload> = () => Payload;

export const basicDispatcher =
  <Payload, ActionType>(type: ActionType, makePayload: TPayloadMaker<Payload>) =>
  (dispatch: (action: { type: ActionType; payload: Payload }) => void) => {
    dispatch({ type, payload: makePayload() });
  };

// <dispatchers>
type TSingleDispatcher<ActionType, Payload> = (
  ...args: any[]
) => (dispatch: (action: { type: ActionType; payload: Payload }) => void) => void;

type TAsyncMultiDispatcher<Dispatch> = (...args: any[]) => (dispatch: Dispatch) => Promise<void>;
// </dispatchers>

// <reducers>
type TReducer<IStoreState, Payload> = (state: IStoreState, payload: Payload) => IStoreState;

type TResponseReducer<IStoreState, PayloadOK, PayloadNOK> = {
  ok: TReducer<IStoreState, PayloadOK>;
  nok: TReducer<IStoreState, PayloadNOK>;
};
// </reducers>

// <handlers
interface IStoreReducer<Reducer extends TReducer<any, any> | TResponseReducer<any, any, any>> {
  reduce: Reducer;
}

interface IStoreDispatcher<
  Dispatcher extends TSingleDispatcher<any, any> | TAsyncMultiDispatcher<any>,
> {
  dispatch: Dispatcher;
}

export interface IStoreHandler<
  Dispatcher extends TSingleDispatcher<any, any> | TAsyncMultiDispatcher<any>,
  Reducer extends TReducer<any, any> | TResponseReducer<any, any, any>,
> extends IStoreDispatcher<Dispatcher>,
    IStoreReducer<Reducer> {}

export interface IStoreChangeListener<TStoreState, TPayload>
  extends IStoreReducer<TReducer<TStoreState, TPayload>> {}

export interface IBasicStoreHandler<TStoreState, TPayload, EActionType>
  extends IStoreHandler<
    TSingleDispatcher<EActionType, TPayload>,
    TReducer<TStoreState, TPayload>
  > {}

export interface IApiCallStoreHandler<TStoreState, TDispatch, TPayloadOK, TPayloadNOK>
  extends IStoreHandler<
    TAsyncMultiDispatcher<TDispatch>,
    TResponseReducer<TStoreState, TPayloadOK, TPayloadNOK>
  > {}
// </handlers>
