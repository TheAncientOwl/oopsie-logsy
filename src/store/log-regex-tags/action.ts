/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file action.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description LogRegexTags actions dispatchers.
 */

import { Console } from '@/console/Console';
import { invoke } from '@tauri-apps/api/core';
import { defaultRegexTag, RegexTag } from './reducer';
import { ActionType, Dispatch } from './types';

export const invokeGetTags = () => async (dispatch: Dispatch) => {
  dispatch({ type: ActionType.Loading });

  try {
    const tags = await invoke<Array<RegexTag>>('get_tags');
    Console.info(invokeGetTags.name, `received ${tags.length} tags`);
    dispatch({
      type: ActionType.InvokeGetTagsOK,
      payload: tags.length !== 0 ? tags : [defaultRegexTag],
    });
  } catch (error) {
    Console.error(invokeGetTags.name, `error getting tags from rust: ${error}`);
    dispatch({ type: ActionType.InvokeGetTagsNOK, payload: error });
  }
};

export const invokeSetTags = (tags: Array<RegexTag>) => async (dispatch: Dispatch) => {
  dispatch({ type: ActionType.Loading });

  try {
    const response = await invoke('set_tags', { tags });
    Console.log(invokeSetTags.name, `rust response: ${response}`);
    dispatch({ type: ActionType.InvokeSetTagsOK });
  } catch (error) {
    Console.error(invokeGetTags.name, `error sending tags to rust: ${error}`);
    dispatch({ type: ActionType.InvokeSetTagsNOK });
  }
};

export const addTag = () => (dispatch: Dispatch) => {
  dispatch({ type: ActionType.AddTag });
};

export const removeTag = (id: string) => (dispatch: Dispatch) => {
  dispatch({ type: ActionType.RemoveTag, payload: { id } });
};

export const toggleTagDisplay = (id: string) => (dispatch: Dispatch) => {
  dispatch({ type: ActionType.ToggleTagDisplay, payload: { id } });
};

export const updateTagName = (id: string, value: string) => (dispatch: Dispatch) => {
  dispatch({ type: ActionType.UpdateTagName, payload: { id, value } });
};

export const updateTagRegex = (id: string, value: string) => (dispatch: Dispatch) => {
  dispatch({ type: ActionType.UpdateTagRegex, payload: { id, value } });
};
