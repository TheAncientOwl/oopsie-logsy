/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file action.ts
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description LogRegexTags actions dispatchers.
 */

import { invoke } from '@tauri-apps/api/core';
import { defaultRegexTag, TRegexTag } from './reducer';
import { ActionType, TDispatch } from './types';

export const invokeGetTags = () => async (dispatch: TDispatch) => {
  dispatch({ type: ActionType.Loading });

  try {
    const tags = await invoke<Array<TRegexTag>>('get_tags');
    console.infoX(invokeGetTags.name, `received ${tags.length} tags`);

    const finalTags = tags.length === 0 ? [defaultRegexTag] : tags;

    if (tags.length === 0) {
      await invokeSetTags(finalTags)(dispatch);
    }

    dispatch({
      type: ActionType.InvokeGetTagsOK,
      payload: finalTags,
    });
  } catch (error) {
    console.errorX(invokeGetTags.name, `error getting tags from rust: ${error}`);
    dispatch({ type: ActionType.InvokeGetTagsNOK, payload: error });
  }
};

export const invokeSetTags = (tags: Array<TRegexTag>) => async (dispatch: TDispatch) => {
  dispatch({ type: ActionType.Loading });

  try {
    const response = await invoke('set_tags', { tags });
    console.logX(invokeSetTags.name, `rust response: ${response}`);
    dispatch({ type: ActionType.InvokeSetTagsOK });
  } catch (error) {
    console.errorX(invokeGetTags.name, `error sending tags to rust: ${error}`);
    dispatch({ type: ActionType.InvokeSetTagsNOK });
  }
};

export const addTag = () => (dispatch: TDispatch) => {
  dispatch({ type: ActionType.AddTag });
};

export const removeTag = (id: string) => (dispatch: TDispatch) => {
  dispatch({ type: ActionType.RemoveTag, payload: { id } });
};

export const toggleTagDisplay = (id: string) => (dispatch: TDispatch) => {
  dispatch({ type: ActionType.ToggleTagDisplay, payload: { id } });
};

export const updateTagName = (id: string, value: string) => (dispatch: TDispatch) => {
  dispatch({ type: ActionType.UpdateTagName, payload: { id, value } });
};

export const updateTagRegex = (id: string, value: string) => (dispatch: TDispatch) => {
  dispatch({ type: ActionType.UpdateTagRegex, payload: { id, value } });
};
