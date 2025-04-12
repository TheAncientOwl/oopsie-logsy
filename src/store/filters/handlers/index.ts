/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file index.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description Handlers index file.
 */

import { addNewFilter } from './addNewFilter';
import { addNewFilterComponent } from './addNewFilterComponent';
import { addNewFilterTab } from './addNewFilterTab';
import { deleteFilter } from './deleteFilter';
import { deleteFilterComponent } from './deleteFilterComponent';
import { deleteFilterTab } from './deleteFilterTab';
import { duplicateFilter } from './duplicateFilter';
import { focusFilterTab } from './focusFilterTab';
import { loading } from './loading';
import { setComponentData } from './setComponentData';
import { setComponentOverAlternative } from './setComponentOverAlternative';
import { setFilterName } from './setFilterName';
import { toggleComponentIsEquals } from './toggleComponentIsEquals';
import { toggleComponentIsRegex } from './toggleComponentIsRegex';
import { toggleFilterActive } from './toggleFilterActive';
import { toggleFilterHighlightOnly } from './toggleFilterHighlightOnly';

export {
  addNewFilter,
  addNewFilterComponent,
  addNewFilterTab,
  deleteFilter,
  deleteFilterComponent,
  deleteFilterTab,
  duplicateFilter,
  focusFilterTab,
  loading,
  setComponentData,
  setComponentOverAlternative,
  setFilterName,
  toggleComponentIsEquals,
  toggleComponentIsRegex,
  toggleFilterActive,
  toggleFilterHighlightOnly,
};
