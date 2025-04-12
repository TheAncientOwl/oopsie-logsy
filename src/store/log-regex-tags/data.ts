/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file data.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description LogRegexTags data.
 */

import { v7 as uuidv7 } from 'uuid';

// <types>
export type TRegexTag = {
  id: string;
  displayed: boolean;
  regex: string;
  name: string;
};

export interface IDefaultState {
  tags: Array<TRegexTag>;
  loading: boolean;
  canApplyTags: boolean;
}
// </types>

// <helpers>
export const checkCanApply = (tags: Array<TRegexTag>) => {
  return tags.length > 0 && tags.every(tag => tag.regex.length > 0);
};
// </helpers>

// <data>
export const DefaultFactory = {
  makeTag: (name: string = 'NewTag') => ({
    id: uuidv7(),
    displayed: true,
    regex: '.*',
    name: name,
  }),
};

export const defaultState: IDefaultState = {
  tags: [DefaultFactory.makeTag('Payload')],
  loading: false,
  canApplyTags: false,
};
// </data>
