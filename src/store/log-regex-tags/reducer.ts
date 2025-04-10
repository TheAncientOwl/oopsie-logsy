/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file reducer.ts
 * @author Alexandru Delegeanu
 * @version 0.5
 * @description LogRegexTags data reducer.
 */

import { Reducer } from '@reduxjs/toolkit';
import { v7 as uuidv7 } from 'uuid';
import {
  ActionType,
  TArrayUpdateIDPayload,
  TArrayValueUpdatePayload,
  DispatchTypes,
} from './types';

export type TRegexTag = {
  id: string;
  displayed: boolean;
  regex: string;
  name: string;
};

interface IDefaultState {
  tags: Array<TRegexTag>;
  loading: boolean;
  canApplyTags: boolean;
}

export const defaultRegexTag: TRegexTag = {
  id: uuidv7(),
  displayed: true,
  regex: '.*',
  name: 'Payload',
};

const defaultState: IDefaultState = {
  tags: [defaultRegexTag],
  loading: false,
  canApplyTags: false,
};

const checkCanApply = (tags: Array<TRegexTag>) => {
  return tags.length > 0 && tags.every(tag => tag.regex.length > 0);
};

export const logRegexTagsReducer: Reducer<IDefaultState, DispatchTypes> = (
  state: IDefaultState = defaultState,
  action: DispatchTypes
): IDefaultState => {
  switch (action.type) {
    case ActionType.Loading: {
      return {
        ...state,
        loading: true,
      };
    }

    case ActionType.InvokeGetTagsOK: {
      return {
        loading: false,
        canApplyTags: false,
        tags: action.payload as Array<TRegexTag>,
      };
    }

    case ActionType.InvokeGetTagsNOK: {
      return {
        ...state,
        loading: false,
      };
    }

    case ActionType.InvokeSetTagsOK: {
      return {
        ...state,
        loading: false,
        canApplyTags: false,
      };
    }

    case ActionType.InvokeSetTagsNOK: {
      return {
        ...state,
        loading: false,
      };
    }

    case ActionType.AddTag: {
      const newTags = [
        ...state.tags,
        { id: uuidv7(), displayed: true, regex: '.*', name: 'new-tag' },
      ];
      return {
        ...state,
        tags: newTags,
        canApplyTags: checkCanApply(newTags),
      };
    }

    case ActionType.RemoveTag: {
      const { id } = action.payload as TArrayUpdateIDPayload;
      const newTags = state.tags.filter(obj => obj.id !== id);

      return {
        ...state,
        tags: newTags,
        canApplyTags: checkCanApply(newTags),
      };
    }

    case ActionType.ToggleTagDisplay: {
      const { id } = action.payload as TArrayUpdateIDPayload;
      const newTags = state.tags.map(obj =>
        obj.id !== id ? obj : { ...obj, displayed: !obj.displayed }
      );

      return {
        ...state,
        tags: state.tags.map(obj => (obj.id !== id ? obj : { ...obj, displayed: !obj.displayed })),
        canApplyTags: checkCanApply(newTags),
      };
    }

    case ActionType.UpdateTagName: {
      const { id, value } = action.payload as TArrayValueUpdatePayload;
      const newTags = state.tags.map(obj =>
        obj.id !== id
          ? obj
          : {
              ...obj,
              name: value,
            }
      );

      return {
        ...state,
        tags: newTags,
        canApplyTags: checkCanApply(newTags),
      };
    }

    case ActionType.UpdateTagRegex: {
      const { id, value } = action.payload as TArrayValueUpdatePayload;
      const newTags = state.tags.map(obj =>
        obj.id !== id
          ? obj
          : {
              ...obj,
              regex: value,
            }
      );

      return {
        ...state,
        tags: newTags,
        canApplyTags: checkCanApply(newTags),
      };
    }
  }

  return state;
};
