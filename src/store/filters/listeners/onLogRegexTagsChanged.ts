/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file onLogRegexTagsChanged.ts
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description Update over alternatives when tags are changed.
 */

import { IStoreChangeListener } from '@/store/common/storeHandler';
import { EActionType } from '@/store/regex-tags/actions';
import { TRegexTag } from '@/store/regex-tags/data';
import { type TPayloadOk as TInvokeApplyRegexTagsPayloadNOk } from '@/store/regex-tags/handlers/invokeApplyRegexTags';
import { type TPayloadOk as TInvokeApplyRegexTagsPayloadOk } from '@/store/regex-tags/handlers/invokeGetRegexTags';
import { checkCanSaveData, makeOverAlternatives, type TStoreState } from '../data';

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
  TInvokeApplyRegexTagsPayloadOk,
  EActionType
> = {
  action: EActionType.InvokeGetRegexTagsOK,
  reduce: (state, payload) => handle(state, payload),
};

export const onLogRegexTagsSet: IStoreChangeListener<
  TStoreState,
  TInvokeApplyRegexTagsPayloadNOk,
  EActionType
> = {
  action: EActionType.InvokeApplyRegexTagssOK,
  reduce: (state, payload) => handle(state, payload),
};
