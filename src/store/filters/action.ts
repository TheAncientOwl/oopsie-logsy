/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file action.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description Filters actions dispatchers.
 */

import { TFilterComponent } from './reducer';
import {
  ActionType,
  TFilterTabFocusPayload,
  type TDispatch,
  type TFilterAddPayload,
  type TFilterComponentAddPayload,
  type TFilterComponentDeletePayload,
  type TFilterComponentSetDataPayload,
  type TFilterComponentToggleIsRegexPayload,
  type TFilterDeletePayload,
  type TFilterSetNamePayload,
  type TFilterTabAddPayload,
  type TFilterTabDeletePayload,
  type TSetOverAlternativePayload,
} from './types';
import { v7 as uuidv7, v1 as uuidv1 } from 'uuid';

export const invokeGetFilters = () => async (dispatch: TDispatch) => {
  dispatch({ type: ActionType.Loading });
  // TODO: implement...
};

export const invokeSetFilters = () => async (dispatch: TDispatch) => {
  dispatch({ type: ActionType.Loading });
  // TODO: implement...
};

export const newFilterTab = () => (dispatch: TDispatch) => {
  dispatch({
    type: ActionType.FilterTabAdd,
    payload: {
      tab: {
        id: uuidv7(),
        name: uuidv1(),
        filters: [],
      },
    } as TFilterTabAddPayload,
  });
};

export const deleteFilterTab = (targetId: string) => (dispatch: TDispatch) => {
  dispatch({
    type: ActionType.FilterTabDelete,
    payload: { targetId } as TFilterTabDeletePayload,
  });
};

export const focusFilterTab = (targetId: string) => (dispatch: TDispatch) => {
  dispatch({
    type: ActionType.FilterTabFocus,
    payload: { targetId } as TFilterTabFocusPayload,
  });
};

export const newFilter = (targetTabId: string) => (dispatch: TDispatch) => {
  dispatch({
    type: ActionType.FilterAdd,
    payload: {
      targetTabId,
      filter: {
        id: uuidv7(),
        name: uuidv1(),
        isActive: false,
        isHighlightOnly: false,
        components: [] as Array<TFilterComponent>,
      },
    } as TFilterAddPayload,
  });
};

export const deleteFilter =
  (targetTabId: string, targetFilterId: string) => (dispatch: TDispatch) => {
    dispatch({
      type: ActionType.FilterDelete,
      payload: {
        targetTabId,
        targetFilterId,
      } as TFilterDeletePayload,
    });
  };

export const filterToggleActive =
  (targetTabId: string, targetFilterId: string) => (dispatch: TDispatch) => {
    dispatch({
      type: ActionType.FilterToggleActive,
      payload: {
        targetTabId,
        targetFilterId,
      } as TFilterDeletePayload,
    });
  };

export const filterToggleHighlightOnly =
  (targetTabId: string, targetFilterId: string) => (dispatch: TDispatch) => {
    dispatch({
      type: ActionType.FilterToggleHighlightOnly,
      payload: {
        targetTabId,
        targetFilterId,
      } as TFilterDeletePayload,
    });
  };

export const filterSetName =
  (targetTabId: string, targetFilterId: string, name: string) => (dispatch: TDispatch) => {
    dispatch({
      type: ActionType.FilterSetName,
      payload: {
        targetTabId,
        targetFilterId,
        name,
      } as TFilterSetNamePayload,
    });
  };

export const newFilterComponent =
  (targetTabId: string, targetFilterId: string) => (dispatch: TDispatch) => {
    dispatch({
      type: ActionType.FilterComponentAdd,
      payload: {
        targetTabId,
        targetFilterId,
        component: {
          id: uuidv7(),
          over: 'Payload',
          isRegex: false,
          isEquals: true,
          data: '.*',
        },
      } as TFilterComponentAddPayload,
    });
  };

export const deleteFilterComponent =
  (targetTabId: string, targetFilterId: string, targetComponentId: string) =>
  (dispatch: TDispatch) => {
    dispatch({
      type: ActionType.FilterComponentDelete,
      payload: {
        targetTabId,
        targetFilterId,
        targetComponentId,
      } as TFilterComponentDeletePayload,
    });
  };

export const filterComponentSetOverAlternative =
  (
    targetTabId: string,
    targetFilterId: string,
    targetComponentId: string,
    overAlternative: string
  ) =>
  (dispatch: TDispatch) => {
    dispatch({
      type: ActionType.FilterComponentSetOverAlternative,
      payload: {
        targetTabId,
        targetFilterId,
        targetComponentId,
        overAlternative,
      } as TSetOverAlternativePayload,
    });
  };

export const filterComponentToggleIsRegex =
  (targetTabId: string, targetFilterId: string, targetComponentId: string) =>
  (dispatch: TDispatch) => {
    dispatch({
      type: ActionType.FilterComponentToggleIsRegex,
      payload: {
        targetTabId,
        targetFilterId,
        targetComponentId,
      } as TFilterComponentToggleIsRegexPayload,
    });
  };

export const filterComponentToggleIsEquals =
  (targetTabId: string, targetFilterId: string, targetComponentId: string) =>
  (dispatch: TDispatch) => {
    dispatch({
      type: ActionType.FilterComponentToggleIsEquals,
      payload: {
        targetTabId,
        targetFilterId,
        targetComponentId,
      } as TFilterComponentToggleIsRegexPayload,
    });
  };

export const filterComponentSetData =
  (targetTabId: string, targetFilterId: string, targetComponentId: string, data: string) =>
  (dispatch: TDispatch) => {
    dispatch({
      type: ActionType.FilterComponentSetData,
      payload: {
        targetTabId,
        targetFilterId,
        targetComponentId,
        data,
      } as TFilterComponentSetDataPayload,
    });
  };
