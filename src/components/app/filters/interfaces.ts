/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file interfaces.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Filters interfaces.
 */

export interface OverAlternative {
  label: string;
  value: string;
}

export interface OverAlternatives {
  data: Array<OverAlternative>;
}

export interface FilterComponentData {
  id: string;
  over: string;
  data: string;
  isRegex: boolean;
  isEquals: boolean;
}

export interface FilterData {
  id: string;
  name: string;
  isActive: boolean;
  isHighlightOnly: boolean;
  components: Array<FilterComponentData>;
  colors?: {
    bg: string;
    fg: string;
  };
}

export interface FilterTabData {
  id: string;
  name: string;
  filters: Array<FilterData>;
}
