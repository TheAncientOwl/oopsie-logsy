/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file onApplyRegexTags.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description Update logs when tags are applied.
 */

import { IStoreChangeListener } from '@/store/common/storeHandler';
import { EActionType } from '@/store/regex-tags/actions';
import { type TPayloadOk as TInvokeApplyRegexTagsPayloadOk } from '@/store/regex-tags/handlers/invokeApplyRegexTags';
import { type TStoreState } from '../data';

export const onApplyRegexTags: IStoreChangeListener<
  TStoreState,
  TInvokeApplyRegexTagsPayloadOk,
  EActionType
> = {
  action: EActionType.InvokeApplyRegexTagsOK,
  reduce: (state, payload) => {
    return {
      ...state,
      logs: payload.logs,
      filterIDs: [],
      totalLogs: payload.totalLogs,
    };
  },
};
