/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file duplicateFiltersTab.tsx
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description DuplicateFiltersTab handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { v7 as uuidv7 } from 'uuid';
import { ActionType } from '../actions';
import { checkCanSaveTabs, IDefaultState, TFilterTab } from '../data';

type DuplicateFiltersTabPayload = {
  targetTabId: string;
};

export interface DuplicateFiltersTabAction {
  type: ActionType.DuplicateFiltersTab;
  payload: DuplicateFiltersTabPayload;
}

export const duplicateFiltersTab: IBasicStoreHandler<
  IDefaultState,
  DuplicateFiltersTabPayload,
  ActionType
> = {
  dispatch: (targetTabId: string) =>
    basicDispatcher(ActionType.DuplicateFiltersTab, () => ({ targetTabId })),

  reduce: (state, payload) => {
    const { targetTabId } = payload;

    let newFocusTabId = state.focusedTabId;

    const handleDuplication = (tabs: Array<TFilterTab>): Array<TFilterTab> => {
      const newArr = [] as Array<TFilterTab>;

      tabs.forEach(tab => {
        newArr.push(tab);
        if (tab.id === targetTabId) {
          console.infoX(handleDuplication.name, `Original: ${JSON.stringify(tab)}`);
          const newTab = structuredClone(tab);
          newTab.name = `${newTab.name}*`;
          newTab.id = uuidv7();
          for (let filter of newTab.filters) {
            filter.id = uuidv7();
            for (let component of filter.components) {
              component.id = uuidv7();
            }
          }
          newFocusTabId = newTab.id;
          newArr.push(newTab);
          console.infoX(handleDuplication.name, `Duplicated: ${JSON.stringify(newTab)}`);
        }
      });

      return newArr;
    };

    const newTabs = handleDuplication(state.filterTabs);

    return {
      ...state,
      filterTabs: newTabs,
      canSaveTabs: checkCanSaveTabs(newTabs),
      focusedTabId: newFocusTabId,
    };
  },
};
