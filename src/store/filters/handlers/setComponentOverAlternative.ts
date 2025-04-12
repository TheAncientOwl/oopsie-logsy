/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setComponentOverAlternative.ts
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description SetComponentOverAlternative handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { IDefaultState } from '../data';

type SetComponentOverAlternativePayload = {
  targetTabId: string;
  targetFilterId: string;
  targetComponentId: string;
  overAlternativeId: string;
};

export interface SetComponentOverAlternativeAction {
  type: ActionType.SetFilterComponentOverAlternative;
  payload: SetComponentOverAlternativePayload;
}

export const setComponentOverAlternative: IBasicStoreHandler<
  IDefaultState,
  SetComponentOverAlternativePayload,
  ActionType
> = {
  dispatch: (
    targetTabId: string,
    targetFilterId: string,
    targetComponentId: string,
    overAlternativeId: string
  ) =>
    basicDispatcher(ActionType.SetFilterComponentOverAlternative, () => ({
      targetTabId,
      targetFilterId,
      targetComponentId,
      overAlternativeId,
    })),

  reduce: (state, payload) => {
    const { targetTabId, targetFilterId, targetComponentId, overAlternativeId } = payload;

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
                          : { ...component, overAlternativeId: overAlternativeId }
                      ),
                    }
              ),
            }
      ),
    };
  },
};
