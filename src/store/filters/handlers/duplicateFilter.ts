/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file duplicateFilter.ts
 * @author Alexandru Delegeanu
 * @version 0.5
 * @description DuplicateFilter handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { v7 as uuidv7 } from 'uuid';
import { ActionType } from '../actions';
import { checkCanSaveTabs, IDefaultState, TFilter } from '../data';

type DuplicateFilterPayload = {
  targetTabId: string;
  targetFilterId: string;
};

export interface DuplicateFilterAction {
  type: ActionType.DuplicateFilter;
  payload: DuplicateFilterPayload;
}

export const duplicateFilter: IBasicStoreHandler<
  IDefaultState,
  DuplicateFilterPayload,
  ActionType
> = {
  dispatch: (targetTabId: string, targetFilterId: string) =>
    basicDispatcher(ActionType.DuplicateFilter, () => ({
      targetTabId,
      targetFilterId,
    })),

  reduce: (state, payload) => {
    const { targetTabId, targetFilterId } = payload;

    const handleDuplication = (filters: Array<TFilter>): Array<TFilter> => {
      const newArr = [] as Array<TFilter>;

      filters.forEach(filter => {
        newArr.push(filter);
        if (filter.id === targetFilterId) {
          const newFilter = structuredClone(filter);
          newFilter.id = uuidv7();
          newFilter.name = `${newFilter.name}*`;
          for (let component of newFilter.components) {
            component.id = uuidv7();
          }
          newArr.push(newFilter);
        }
      });

      return newArr;
    };

    const newTabs = state.filterTabs.map(tab =>
      tab.id !== targetTabId
        ? tab
        : {
            ...tab,
            filters: handleDuplication(tab.filters),
          }
    );

    return {
      ...state,
      filterTabs: newTabs,
      canSaveTabs: checkCanSaveTabs(newTabs),
    };
  },
};
