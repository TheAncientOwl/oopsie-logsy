/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleComponentIsEquals.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description ToggleComponentIsEquals handler.
 */

import { basicDispatcher, IStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { IDefaultState } from '../data';

export type ToggleComponentIsEqualsPayload = {
  targetTabId: string;
  targetFilterId: string;
  targetComponentId: string;
};

export interface ToggleComponentIsEqualsAction {
  type: ActionType.FilterComponentToggleIsEquals;
  payload: ToggleComponentIsEqualsPayload;
}

export const toggleComponentIsEquals: IStoreHandler<
  IDefaultState,
  ToggleComponentIsEqualsPayload,
  ActionType
> = {
  dispatch: (targetTabId: string, targetFilterId: string, targetComponentId: string) =>
    basicDispatcher(ActionType.FilterComponentToggleIsEquals, () => ({
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
                          : { ...component, isEquals: !component.isEquals }
                      ),
                    }
              ),
            }
      ),
    };
  },
};
