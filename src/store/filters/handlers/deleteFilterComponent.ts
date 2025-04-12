/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file deleteFilterComponent.ts
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description DeleteFilterComponent.ts.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveTabs, IDefaultState } from '../data';

type DeleteFilterComponentPayload = {
  targetTabId: string;
  targetFilterId: string;
  targetComponentId: string;
};

export interface DeleteFilterComponentAction {
  type: ActionType.DeleteFilterComponent;
  payload: DeleteFilterComponentPayload;
}

export const deleteFilterComponent: IBasicStoreHandler<
  IDefaultState,
  DeleteFilterComponentPayload,
  ActionType
> = {
  dispatch: (targetTabId: string, targetFilterId: string, targetComponentId: string) =>
    basicDispatcher(ActionType.DeleteFilterComponent, () => ({
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
                    components: filter.components.filter(
                      component => component.id !== targetComponentId
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
