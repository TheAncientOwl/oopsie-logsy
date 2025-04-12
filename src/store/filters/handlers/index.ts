/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file index.ts
 * @author Alexandru Delegeanu
 * @version 0.5
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
import { focusFilterTab } from './focusFilterTab';
import { invokeGetTabs } from './invokeGetTabs';
import { invokeSetTabs } from './invokeSetTabs';
import { loading } from './loading';
import { muteAllFilters } from './muteAllFilters';
import { setComponentData } from './setComponentData';
import { setComponentOverAlternative } from './setComponentOverAlternative';
import { setFilterName } from './setFilterName';
import { setFilterTabName } from './setFilterTabName';
import { toggleComponentIsEquals } from './toggleComponentIsEquals';
import { toggleComponentIsRegex } from './toggleComponentIsRegex';
import { toggleFilterActive } from './toggleFilterActive';
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
  focusFilterTab,
  invokeGetTabs,
  invokeSetTabs,
  loading,
  muteAllFilters,
  setComponentData,
  setComponentOverAlternative,
  setFilterName,
  setFilterTabName,
  toggleComponentIsEquals,
  toggleComponentIsRegex,
  toggleFilterActive,
  toggleFilterHighlightOnly,
  unmuteAllFilters,
};
