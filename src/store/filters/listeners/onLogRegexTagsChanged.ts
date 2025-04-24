/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file onLogRegexTagsChanged.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Update over alternatives when tags are changed.
 */

import { IStoreChangeListener } from '@/store/common/storeHandler';
import { TRegexTag } from '@/store/log-regex-tags/data';
import { type TInvokeGetTagsOkPayload } from '@/store/log-regex-tags/handlers/invokeGetTags';
import { type TInvokeSetTagsOkPayload } from '@/store/log-regex-tags/handlers/invokeSetTags';
import { checkCanSaveData, makeOverAlternatives, type TFiltersStoreState } from '../data';

const handle = <PayloadWithTags extends { tags: TRegexTag[] }>(
  state: TFiltersStoreState,
  payload: PayloadWithTags
): TFiltersStoreState => {
  const { tags } = payload;

  const newOverAlternatives = makeOverAlternatives(tags);

  return {
    ...state,
    overAlternatives: newOverAlternatives,
    canSaveData: checkCanSaveData(state.tabs, state.filters, state.components, newOverAlternatives),
  };
};

export const onLogRegexTagsGet: IStoreChangeListener<TFiltersStoreState, TInvokeGetTagsOkPayload> =
  {
    reduce: (state, payload) => handle(state, payload),
  };

export const onLogRegexTagsSet: IStoreChangeListener<TFiltersStoreState, TInvokeSetTagsOkPayload> =
  {
    reduce: (state, payload) => handle(state, payload),
  };
