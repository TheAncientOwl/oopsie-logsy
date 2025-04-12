/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file dispatchers.ts
 * @author Alexandru Delegeanu
 * @version 0.1
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

type BasicDispatcher<ActionType, Payload> = (
  ...args: any[]
) => (dispatch: (action: { type: ActionType; payload: Payload }) => void) => void;

type BasicAsyncDispatcher<ActionType, Payload> = (
  ...args: any[]
) => (dispatch: (action: { type: ActionType; payload: Payload }) => void) => Promise<void>;

type Dispatcher<ActionType, Payload> =
  | BasicDispatcher<ActionType, Payload>
  | BasicAsyncDispatcher<ActionType, Payload>;

type Reducer<IDefaultState, Payload> = (state: IDefaultState, payload: Payload) => IDefaultState;

export interface IStoreHandler<IDefaultState, Payload, ActionType> {
  dispatch: Dispatcher<ActionType, Payload>;
  reduce: Reducer<IDefaultState, Payload>;
}
