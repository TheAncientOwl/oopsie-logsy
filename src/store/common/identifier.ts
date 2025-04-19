/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file identifier.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description UUID type and utilities.
 */

import { v7 as uuid } from 'uuid';

export { uuid };

export type UUID = string;

export type Identifiable = {
  id: UUID;
};

export const contains = (arr: Array<UUID>, target: UUID): boolean => {
  return arr.find(obj => obj === target) !== undefined;
};

export const containsById = <T extends Identifiable>(arr: Array<T>, targetId: UUID): boolean => {
  return arr.find(obj => obj.id === targetId) !== undefined;
};

export const modifyWhereId = <T extends Identifiable>(
  arr: Array<T>,
  targetId: UUID,
  modify: (old: T) => T
): Array<T> => {
  return arr.map(obj => (obj.id !== targetId ? obj : modify(obj)));
};

export const modifyWhereIdAnyOf = <T extends Identifiable>(
  arr: Array<T>,
  targetIds: Array<UUID>,
  modify: (old: T) => T
): Array<T> => {
  return arr.map(obj => (contains(targetIds, obj.id) ? modify(obj) : obj));
};

export const remove = (arr: Array<UUID>, target: UUID): Array<UUID> => {
  return arr.filter(obj => obj !== target);
};

export const removeById = <T extends Identifiable>(arr: Array<T>, targetId: UUID): Array<T> => {
  return arr.filter(obj => obj.id !== targetId);
};
