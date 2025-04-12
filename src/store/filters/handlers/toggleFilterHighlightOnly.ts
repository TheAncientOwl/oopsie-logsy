/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleFilterHighlight.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description ToggleFilterHighlight handler.
 */

import { basicDispatcher, IStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { IDefaultState } from '../data';

export type ToggleFilterHighlightPayload = {
  targetTabId: string;
  targetFilterId: string;
};

export interface ToggleFilterHighlightAction {
  type: ActionType.FilterToggleHighlightOnly;
  payload: ToggleFilterHighlightPayload;
}

export const toggleFilterHighlightOnly: IStoreHandler<
  IDefaultState,
  ToggleFilterHighlightPayload,
  ActionType
> = {
  dispatch: (targetTabId: string, targetFilterId: string) =>
    basicDispatcher(ActionType.FilterToggleHighlightOnly, () => ({
      targetTabId,
      targetFilterId,
    })),

  reduce: (state, payload) => {
    const { targetTabId, targetFilterId } = payload;

    return {
      ...state,
      filterTabs: state.filterTabs.map(tab =>
        tab.id !== targetTabId
          ? tab
          : {
              ...tab,
              filters: tab.filters.map(filter =>
                filter.id !== targetFilterId
                  ? filter
                  : {
                      ...filter,
                      isHighlightOnly: !filter.isHighlightOnly,
                    }
              ),
            }
      ),
    };
  },
};
