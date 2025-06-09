/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file onChunkRequested.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Update store.requested_chunk to true.
 */

import { IStoreChangeListener, TStoreAction } from '@/store/common/storeHandler';
import { TStoreState } from '../data';
import { EActionType } from '../actions';

const action = EActionType.OnChunkRequested;

export type TOnChunkRequestedPayload = {};

export type TOnChunkRequested = TStoreAction<typeof action, TOnChunkRequestedPayload>;

export const onChunkRequested: IStoreChangeListener<
  TStoreState,
  TOnChunkRequestedPayload,
  EActionType
> = {
  action,
  reduce: state => {
    return {
      ...state,
      requested_chunk: true,
    };
  },
};
