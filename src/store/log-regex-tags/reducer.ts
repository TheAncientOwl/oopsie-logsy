/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file reducer.ts
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description LogRegexTags data reducer.
 */

import { Reducer } from '@reduxjs/toolkit';
import { v7 as uuidv7 } from 'uuid';
import { ActionType, ArrayUpdateID, ArrayValueUpdate, DispatchTypes } from './types';
import { shouldIgnoreAction } from '@/store/common/shouldIgnoreAction';

export interface RegexTag {
  id: string;
  displayed: boolean;
  regex: string;
  name: string;
}

export interface IDefaultState {
  tags: Array<RegexTag>;
  loading: boolean;
  canApplyTags: boolean;
}

export const defaultRegexTag: RegexTag = {
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

const checkCanApply = (tags: Array<RegexTag>) => {
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
        tags: action.payload as Array<RegexTag>,
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
      const { id } = action.payload as ArrayUpdateID;
      const newTags = state.tags.filter(obj => obj.id !== id);

      return {
        ...state,
        tags: newTags,
        canApplyTags: checkCanApply(newTags),
      };
    }

    case ActionType.ToggleTagDisplay: {
      const { id } = action.payload as ArrayUpdateID;
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
      const { id, value } = action.payload as ArrayValueUpdate;
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
      const { id, value } = action.payload as ArrayValueUpdate;
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

  if (!shouldIgnoreAction(action)) {
    console.warnX(logRegexTagsReducer.name, `received unhandled action ${action}`);
    console.traceX(logRegexTagsReducer.name, `returning input state due to unknown action`);
  }

  return state;
};
