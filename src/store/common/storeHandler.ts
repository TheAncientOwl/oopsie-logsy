/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file dispatchers.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description Dispatcher helpers.
 */

type PayloadMaker<Payload> = () => Payload;

export const basicDispatcher =
  <Payload, ActionType>(type: ActionType, makePayload: PayloadMaker<Payload>) =>
  (dispatch: (action: { type: ActionType; payload: Payload }) => void) => {
    dispatch({ type, payload: makePayload() });
  };

export const basicAsyncDispatcher =
  <Payload, ActionType>(type: ActionType, makePayload: PayloadMaker<Payload>) =>
  async (dispatch: (action: { type: ActionType; payload: Payload }) => void) => {
    dispatch({ type, payload: makePayload() });
  };

type AsyncDispatcher<Dispatch> = (...args: any[]) => (dispatch: Dispatch) => Promise<void>;

type BasicDispatcher<ActionType, Payload> = (
  ...args: any[]
) => (dispatch: (action: { type: ActionType; payload: Payload }) => void) => void;

type BasicAsyncDispatcher<ActionType, Payload> = (
  ...args: any[]
) => (dispatch: (action: { type: ActionType; payload: Payload }) => void) => Promise<void>;

type Reducer<IDefaultState, Payload> = (state: IDefaultState, payload: Payload) => IDefaultState;

export interface IBasicStoreHandler<IDefaultState, Payload, ActionType> {
  dispatch: BasicDispatcher<ActionType, Payload> | BasicAsyncDispatcher<ActionType, Payload>;
  reduce: Reducer<IDefaultState, Payload>;
}

export interface IResponseStoreHandler<IDefaultState, Dispatch, PayloadOK, PayloadNOK> {
  dispatch: AsyncDispatcher<Dispatch>;
  reduceOK: Reducer<IDefaultState, PayloadOK>;
  reduceNOK: Reducer<IDefaultState, PayloadNOK>;
}
