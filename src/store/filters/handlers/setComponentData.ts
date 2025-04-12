/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setComponentData.ts
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description SetComponentData handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveTabs, IDefaultState } from '../data';

type SetComponentDataPayload = {
  targetTabId: string;
  targetFilterId: string;
  targetComponentId: string;
  data: string;
};

export interface SetComponentDataAction {
  type: ActionType.SetFilterComponentData;
  payload: SetComponentDataPayload;
}

export const setComponentData: IBasicStoreHandler<
  IDefaultState,
  SetComponentDataPayload,
  ActionType
> = {
  dispatch: (
    targetTabId: string,
    targetFilterId: string,
    targetComponentId: string,
    data: string
  ) =>
    basicDispatcher(ActionType.SetFilterComponentData, () => ({
      targetTabId,
      targetFilterId,
      targetComponentId,
      data,
    })),

  reduce: (state, payload) => {
    const { targetTabId, targetFilterId, targetComponentId, data } = payload;

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
                      component.id !== targetComponentId ? component : { ...component, data }
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
