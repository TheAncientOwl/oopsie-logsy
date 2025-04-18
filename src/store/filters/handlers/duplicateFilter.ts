/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file duplicateFilter.ts
 * @author Alexandru Delegeanu
 * @version 0.7
 * @description DuplicateFilter handler.
 */

import { uuid, UUID } from '@/store/common/identifier';
import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveData, getFilterComponentById, IDefaultState, TFilter } from '../data';

type DuplicateFilterPayload = {
  targetTabId: UUID;
  targetFilterId: UUID;
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
  dispatch: (targetTabId: UUID, targetFilterId: UUID) =>
    basicDispatcher(ActionType.DuplicateFilter, () => ({
      targetTabId,
      targetFilterId,
    })),

  reduce: (state, payload) => {
    const { targetTabId, targetFilterId } = payload;

    const newComponents = [...state.components];
    const newFilters: Array<TFilter> = [];

    const duplicateFilter = (): UUID => {
      let dupedFilterId: UUID | undefined = undefined;

      // build new filters
      state.filters.forEach(filter => {
        // push original filter
        newFilters.push(filter);

        // dupe if ID matches
        if (filter.id === targetFilterId) {
          const dupedFilter = structuredClone(filter);
          dupedFilter.id = uuid();
          dupedFilter.name = `${dupedFilter.name}*`;

          dupedFilterId = dupedFilter.id;

          // dupe components
          const dupedComponentIds: Array<UUID> = [];
          dupedFilter.componentIDs.forEach(componentId => {
            const dupedComponent = structuredClone(
              getFilterComponentById(`duplicateFilter::reduce`, state.components, componentId)
            );
            dupedComponent.id = uuid();

            // add duped component
            dupedComponentIds.push(dupedComponent.id);
            newComponents.push(dupedComponent);
          });
          dupedFilter.componentIDs = dupedComponentIds;

          // add duped filter
          newFilters.push(dupedFilter);
        }
      });

      console.assertX(
        'reduce',
        dupedFilterId !== undefined,
        `Filter with ID ${targetFilterId} missing in store while trying to duplicate`
      );

      return dupedFilterId as unknown as UUID;
    };

    const dupedFilterId = duplicateFilter();

    const handleFilterIdDupe = (filterIds: Array<UUID>): Array<UUID> => {
      const out: Array<UUID> = [];

      filterIds.forEach(id => {
        out.push(id);

        if (id === targetFilterId) {
          out.push(dupedFilterId);
        }
      });

      return out;
    };

    const newTabs = state.tabs.map(tab =>
      tab.id !== targetTabId
        ? tab
        : {
            ...tab,
            filterIDs: handleFilterIdDupe(tab.filterIDs),
          }
    );

    return {
      ...state,
      components: newComponents,
      filters: newFilters,
      tabs: newTabs,
      canSaveData: checkCanSaveData(newTabs, newFilters, newComponents),
    };
  },
};
