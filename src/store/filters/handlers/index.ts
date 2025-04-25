/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file index.ts
 * @author Alexandru Delegeanu
 * @version 0.16
 * @description Handlers index file.
 */

import { addNewFilter } from './addNewFilter';
import { addNewFilterComponent } from './addNewFilterComponent';
import { addNewFilterTab } from './addNewFilterTab';
import { deleteAllFilters } from './deleteAllFilters';
import { deleteFilter } from './deleteFilter';
import { deleteFilterComponent } from './deleteFilterComponent';
import { deleteFilterTab } from './deleteFilterTab';
import { duplicateFilter } from './duplicateFilter';
import { duplicateFiltersTab } from './duplicateFiltersTab';
import { focusFilterTab } from './focusFilterTab';
import { invokeGetTabs } from './invokeGetTabs';
import { invokeSetTabs } from './invokeSetTabs';
import { loading } from './loading';
import { muteAllFilters } from './muteAllFilters';
import { prepareFiltersForDrag } from './prepareFiltersForDrag';
import { reorderFilterComponents } from './reorderFilterComponents';
import { reorderFilters } from './reorderFilters';
import { reorderTabs } from './reorderTabs';
import { setAllFiltersCollapsed } from './setAllFiltersCollapsed';
import { setComponentData } from './setComponentData';
import { setComponentOverAlternative } from './setComponentOverAlternative';
import { setFilterBg } from './setFilterBg';
import { setFilterFg } from './setFilterFg';
import { setFilterName } from './setFilterName';
import { setFilterPriority } from './setFilterPriority';
import { setFilterTabName } from './setFilterTabName';
import { toggleComponentIsEquals } from './toggleComponentIsEquals';
import { toggleComponentIsRegex } from './toggleComponentIsRegex';
import { toggleFilterActive } from './toggleFilterActive';
import { toggleFilterCollapsed } from './toggleFilterCollapsed';
import { toggleFilterComponentIgnoreCase } from './toggleFilterComponentIgnoreCase';
import { toggleFilterHighlightOnly } from './toggleFilterHighlightOnly';
import { unmuteAllFilters } from './unmuteAllFilters';

export {
  addNewFilter,
  addNewFilterComponent,
  addNewFilterTab,
  deleteAllFilters,
  deleteFilter,
  deleteFilterComponent,
  deleteFilterTab,
  duplicateFilter,
  duplicateFiltersTab,
  focusFilterTab,
  invokeGetTabs,
  invokeSetTabs,
  loading,
  muteAllFilters,
  prepareFiltersForDrag,
  reorderFilterComponents,
  reorderFilters,
  reorderTabs,
  setAllFiltersCollapsed,
  setComponentData,
  setComponentOverAlternative,
  setFilterBg,
  setFilterFg,
  setFilterName,
  setFilterPriority,
  setFilterTabName,
  toggleComponentIsEquals,
  toggleComponentIsRegex,
  toggleFilterActive,
  toggleFilterCollapsed,
  toggleFilterComponentIgnoreCase,
  toggleFilterHighlightOnly,
  unmuteAllFilters,
};
