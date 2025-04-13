/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleFilterComponentIgnoreCase.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description ToggleFilterComponentIgnoreCase handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveTabs, IDefaultState } from '../data';

type ToggleFilterComponentIgnoreCasePayload = {
  targetTabId: string;
  targetFilterId: string;
  targetComponentId: string;
};

export interface ToggleFilterComponentIgnoreCaseAction {
  type: ActionType.ToggleFilterComponentIgnoreCase;
  payload: ToggleFilterComponentIgnoreCasePayload;
}

export const toggleFilterComponentIgnoreCase: IBasicStoreHandler<
  IDefaultState,
  ToggleFilterComponentIgnoreCasePayload,
  ActionType
> = {
  dispatch: (targetTabId: string, targetFilterId: string, targetComponentId: string) =>
    basicDispatcher(ActionType.ToggleFilterComponentIgnoreCase, () => ({
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
                        : { ...component, ignoreCase: !component.ignoreCase }
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
