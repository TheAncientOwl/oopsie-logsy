/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file shouldIgnoreAction.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Utility function for common redux actions.
 */

export const shouldIgnoreAction = (action: any) => {
  const actionStr = JSON.stringify(action).toLowerCase();
  return ['init', 'probe_unknown_action'].some(act => actionStr.includes(act));
};
