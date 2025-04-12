/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file addNewFilterComponent.tsx
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description AddFilterComponent.
 */

import { basicDispatcher, IStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { DefaultFactory, IDefaultState, TFilterComponent } from '../data';

export type AddNewFilterComponentPayload = {
  targetTabId: string;
  targetFilterId: string;
  component: TFilterComponent;
};

export interface AddNewFilterComponentAction {
  type: ActionType.FilterComponentAdd;
  payload: AddNewFilterComponentPayload;
}

export const addNewFilterComponent: IStoreHandler<
  IDefaultState,
  AddNewFilterComponentPayload,
  ActionType
> = {
  dispatch: (targetTabId: string, targetFilterId: string) =>
    basicDispatcher(ActionType.FilterComponentAdd, () => ({
      targetTabId,
      targetFilterId,
      component: DefaultFactory.makeFilterComponent(),
    })),

  reduce: (state, payload) => {
    const { targetTabId, targetFilterId, component } = payload;

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
                      components: [...filter.components, { ...component }],
                    }
              ),
            }
      ),
    };
  },
};
