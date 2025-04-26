/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file onLogRegexTagsChanged.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description Update over alternatives when tags are changed.
 */

import { IStoreChangeListener } from '@/store/common/storeHandler';
import { TRegexTag } from '@/store/log-regex-tags/data';
import { type TPayloadOk as TInvokeGetTagsPayloadOk } from '@/store/log-regex-tags/handlers/invokeGetTags';
import { type TPayloadOk as TInvokeSetTagsPayloadOk } from '@/store/log-regex-tags/handlers/invokeSetTags';
import { checkCanSaveData, makeOverAlternatives, type TStoreState } from '../data';
import { EActionType as EActionType } from '@/store/log-regex-tags/actions';

const handle = <PayloadWithTags extends { tags: TRegexTag[] }>(
  state: TStoreState,
  payload: PayloadWithTags
): TStoreState => {
  const { tags } = payload;

  const newOverAlternatives = makeOverAlternatives(tags);

  return {
    ...state,
    overAlternatives: newOverAlternatives,
    canSaveData: checkCanSaveData(state.tabs, state.filters, state.components, newOverAlternatives),
  };
};

export const onLogRegexTagsGet: IStoreChangeListener<
  TStoreState,
  TInvokeGetTagsPayloadOk,
  EActionType
> = {
  action: EActionType.InvokeGetTagsOK,
  reduce: (state, payload) => handle(state, payload),
};

export const onLogRegexTagsSet: IStoreChangeListener<
  TStoreState,
  TInvokeSetTagsPayloadOk,
  EActionType
> = {
  action: EActionType.InvokeSetTagsOK,
  reduce: (state, payload) => handle(state, payload),
};
