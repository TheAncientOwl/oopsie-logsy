/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setComponentData.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description SetComponentData handler.
 */

import { basicDispatcher, IStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { IDefaultState } from '../data';

export type SetComponentDataPayload = {
  targetTabId: string;
  targetFilterId: string;
  targetComponentId: string;
  data: string;
};

export interface SetComponentDataAction {
  type: ActionType.FilterComponentSetData;
  payload: SetComponentDataPayload;
}

export const setComponentData: IStoreHandler<IDefaultState, SetComponentDataPayload, ActionType> = {
  dispatch: (
    targetTabId: string,
    targetFilterId: string,
    targetComponentId: string,
    data: string
  ) =>
    basicDispatcher(ActionType.FilterComponentSetData, () => ({
      targetTabId,
      targetFilterId,
      targetComponentId,
      data,
    })),

  reduce: (state, payload) => {
    const { targetTabId, targetFilterId, targetComponentId, data } = payload;

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
                        component.id !== targetComponentId ? component : { ...component, data }
                      ),
                    }
              ),
            }
      ),
    };
  },
};
