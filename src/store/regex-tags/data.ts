/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file data.ts
 * @author Alexandru Delegeanu
 * @version 0.9
 * @description LogRegexTags data.
 */

import { uuid } from '@/store/common/identifier';

// <types>
export type TRegexTag = {
  id: string;
  displayed: boolean;
  regex: string;
  name: string;
};

export type TStoreState = {
  tags: Array<TRegexTag>;
  loading: boolean;
  canApplyTags: boolean;
};
// </types>

// <helpers>
export const checkCanApply = (tags: Array<TRegexTag>) => {
  return tags.length > 0 && tags.every(tag => tag.regex.length > 0);
};
// </helpers>

// <data>
export const DefaultFactory = {
  makeTag: (name: string = 'NewTag') => ({
    id: uuid(),
    displayed: true,
    regex: '.*',
    name: name,
  }),
};

getStaticDefaultTags._defaultTags = undefined as TRegexTag[] | undefined;

export function getStaticDefaultTags(): TRegexTag[] {
  if (!getStaticDefaultTags._defaultTags) {
    console.trace(getStaticDefaultTags, 'Generating default tags');
    // getStaticDefaultTags._defaultTags = [DefaultFactory.makeTag('Payload')];
    getStaticDefaultTags._defaultTags = [
      {
        id: uuid(),
        displayed: true,
        regex: String.raw`\d+`,
        name: 'Timestamp',
      },
      {
        id: uuid(),
        displayed: false,
        regex: String.raw`\s+`,
        name: '-',
      },
      {
        id: uuid(),
        displayed: true,
        regex: String.raw`Channel[1-4]`,
        name: 'Channel',
      },
      {
        id: uuid(),
        displayed: false,
        regex: String.raw`\s+`,
        name: '-',
      },
      {
        id: uuid(),
        displayed: true,
        // TODO: refactor displayed to not be actual button but to be calculated whether it's wrapped around "()" or not
        regex: String.raw`trace|info|error|debug|warn`,
        name: 'Level',
      },
      {
        id: uuid(),
        displayed: false,
        regex: String.raw`\s+`,
        name: '-',
      },
      {
        id: uuid(),
        displayed: true,
        regex: String.raw`.*`,
        name: 'Payload',
      },
    ];
    console.trace(
      getStaticDefaultTags,
      'Generating default tags ~ DONE',
      getStaticDefaultTags._defaultTags
    );
  }
  return getStaticDefaultTags._defaultTags;
}

export const defaultState: TStoreState = {
  tags: getStaticDefaultTags(),
  loading: false,
  canApplyTags: false,
};
// </data>
