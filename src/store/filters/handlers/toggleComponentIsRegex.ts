/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleComponentIsRegex.ts
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description ToggleComponentIsRegex handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveTabs, IDefaultState } from '../data';

type ToggleComponentIsRegexPayload = {
  targetTabId: string;
  targetFilterId: string;
  targetComponentId: string;
};

export interface ToggleComponentIsRegexAction {
  type: ActionType.ToggleFilterComponentIsRegex;
  payload: ToggleComponentIsRegexPayload;
}

export const toggleComponentIsRegex: IBasicStoreHandler<
  IDefaultState,
  ToggleComponentIsRegexPayload,
  ActionType
> = {
  dispatch: (targetTabId: string, targetFilterId: string, targetComponentId: string) =>
    basicDispatcher(ActionType.ToggleFilterComponentIsRegex, () => ({
      targetTabId,
      targetFilterId,
      targetComponentId,
    })),

  reduce: (state, payload) => {
    const { targetTabId, targetFilterId, targetComponentId } = payload;

    const newTabs = state.filterTabs.map(tab =>
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
    );

    return {
      ...state,
      filterTabs: newTabs,
      canSaveTabs: checkCanSaveTabs(newTabs),
    };
  },
};
