/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file dispatchers.ts
 * @author Alexandru Delegeanu
 * @version 0.6
 * @description Dispatcher helpers.
 */

// <helpers>
type TPayloadMaker<Payload> = () => Payload;

export const basicDispatcher =
  <Payload, ActionType>(type: ActionType, makePayload: TPayloadMaker<Payload>) =>
  (dispatch: (action: { type: ActionType; payload: Payload }) => void) => {
    dispatch({ type, payload: makePayload() });
  };

export type TStoreAction<EType, TPayload> = {
  type: EType;
  payload: TPayload;
};

// </helpers>

// <dispatchers>
type TSingleDispatcher<EActionType, TPayload, TDispatcherArgs extends any[]> = (
  ...args: TDispatcherArgs
) => (dispatch: (action: { type: EActionType; payload: TPayload }) => void) => void;

type TAsyncMultiDispatcher<TDispatch, TDispatcherArgs extends any[]> = (
  ...args: TDispatcherArgs
) => (dispatch: TDispatch) => Promise<void>;

export type TNoDispatcherArgs = [];
// </dispatchers>

// <reducers>
type TReducer<TStoreState, TPayload> = (state: TStoreState, payload: TPayload) => TStoreState;

type TResponseReducer<TStoreState, TPayloadOK, TPayloadNOK> = {
  ok: TReducer<TStoreState, TPayloadOK>;
  nok: TReducer<TStoreState, TPayloadNOK>;
};
// </reducers>

// <handlers
interface IStoreReducer<Reducer extends TReducer<any, any> | TResponseReducer<any, any, any>> {
  reduce: Reducer;
}

interface IStoreDispatcher<
  Dispatcher extends
    | TSingleDispatcher<any, any, TDispatcherArgs>
    | TAsyncMultiDispatcher<any, TDispatcherArgs>,
  TDispatcherArgs extends any[],
> {
  dispatch: Dispatcher;
}

export interface IStoreHandler<
  Reducer extends TReducer<any, any> | TResponseReducer<any, any, any>,
  Dispatcher extends
    | TSingleDispatcher<any, any, TDispatcherArgs>
    | TAsyncMultiDispatcher<any, TDispatcherArgs>,
  TDispatcherArgs extends any[],
> extends IStoreDispatcher<Dispatcher, TDispatcherArgs>,
    IStoreReducer<Reducer> {}

export interface IStoreChangeListener<TStoreState, TPayload, EActionType>
  extends IStoreReducer<TReducer<TStoreState, TPayload>> {
  action: EActionType;
}

export interface IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  TDispatcherArgs extends any[],
> extends IStoreHandler<
    TReducer<TStoreState, TPayload>,
    TSingleDispatcher<EActionType, TPayload, TDispatcherArgs>,
    TDispatcherArgs
  > {
  action: EActionType;
}

export interface IApiCallStoreHandler<
  TStoreState,
  TDispatch,
  EActionType,
  TPayloadOK,
  TPayloadNOK,
  TDispatcherArgs extends any[],
> extends IStoreHandler<
    TResponseReducer<TStoreState, TPayloadOK, TPayloadNOK>,
    TAsyncMultiDispatcher<TDispatch, TDispatcherArgs>,
    TDispatcherArgs
  > {
  action: {
    ok: EActionType;
    nok: EActionType;
  };
}
// </handlers>
