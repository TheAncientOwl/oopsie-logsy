/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleComponentIsRegex.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description ToggleComponentIsRegex handler.
 */

import { basicDispatcher, IStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { IDefaultState } from '../data';

export type ToggleComponentIsRegexPayload = {
  targetTabId: string;
  targetFilterId: string;
  targetComponentId: string;
};

export interface ToggleComponentIsRegexAction {
  type: ActionType.FilterComponentToggleIsRegex;
  payload: ToggleComponentIsRegexPayload;
}

export const toggleComponentIsRegex: IStoreHandler<
  IDefaultState,
  ToggleComponentIsRegexPayload,
  ActionType
> = {
  dispatch: (targetTabId: string, targetFilterId: string, targetComponentId: string) =>
    basicDispatcher(ActionType.FilterComponentToggleIsRegex, () => ({
      targetTabId,
      targetFilterId,
      targetComponentId,
    })),

  reduce: (state, payload) => {
    const { targetTabId, targetFilterId, targetComponentId } = payload;

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
                      components: filter.components.map(component =>
                        component.id !== targetComponentId
                          ? component
                          : { ...component, isRegex: !component.isRegex }
                      ),
                    }
              ),
            }
      ),
    };
  },
};
