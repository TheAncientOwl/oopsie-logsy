/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file deleteFilterComponent.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description DeleteFilterComponent.ts.
 */

import { basicDispatcher, IStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { IDefaultState } from '../data';

export type DeleteFilterComponentPayload = {
  targetTabId: string;
  targetFilterId: string;
  targetComponentId: string;
};

export interface DeleteFilterComponentAction {
  type: ActionType.FilterComponentDelete;
  payload: DeleteFilterComponentPayload;
}

export const deleteFilterComponent: IStoreHandler<
  IDefaultState,
  DeleteFilterComponentPayload,
  ActionType
> = {
  dispatch: (targetTabId: string, targetFilterId: string, targetComponentId: string) =>
    basicDispatcher(ActionType.FilterComponentDelete, () => ({
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
                      components: filter.components.filter(
                        component => component.id !== targetComponentId
                      ),
                    }
              ),
            }
      ),
    };
  },
};
