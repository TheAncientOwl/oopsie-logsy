/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file onApplyFilters.ts
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description Update logs when filters are applied.
 */

import { IStoreChangeListener } from '@/store/common/storeHandler';
import { EActionType } from '@/store/filters/actions';
import { TPayloadOk as TInvokeApplyFiltersPayloadOk } from '@/store/filters/handlers/invokeApplyFilters';
import { type TStoreState } from '../data';

export const onApplyFilters: IStoreChangeListener<
  TStoreState,
  TInvokeApplyFiltersPayloadOk,
  EActionType
> = {
  action: EActionType.InvokeApplyFiltersOK,
  reduce: (state, payload) => {
    return {
      ...state,
      activeLogsChangedTime: payload.activeLogsChangedTime,
    };
  },
};
