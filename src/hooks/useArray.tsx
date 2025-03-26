/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file useArray.tsx
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description Handle array operations
 */

import { useCallback, useState } from 'react';

export type ArrayWherePredicate<T> = (obj: T) => boolean;
export type DeleteArrayObject<T> = (where: ArrayWherePredicate<T>) => void;
export type ModifyArrayObject<T> = (where: ArrayWherePredicate<T>, newObj: T) => void;

export interface ArrayManager<T> {
  data: Array<T>;
  set: React.Dispatch<React.SetStateAction<T[]>>;
  add: (obj: T) => void;
  delete: DeleteArrayObject<T>;
  modify: ModifyArrayObject<T>;
}

export const useArray = <T,>(initialValue: Array<T> | undefined): ArrayManager<T> => {
  const [arr, setArr] = useState<Array<T>>(initialValue === undefined ? [] : initialValue);

  const addElement = useCallback(
    (obj: T) => {
      setArr(prevArr => [...prevArr, obj]);
    },
    [setArr]
  );

  const deleteElement = useCallback(
    (wherePredicate: ArrayWherePredicate<T>) => {
      setArr(prevArr => prevArr.filter(obj => !wherePredicate(obj)));
    },
    [setArr]
  );

  const modifyElement = useCallback(
    (wherePredicate: ArrayWherePredicate<T>, newObj: T) => {
      setArr(prevArr => prevArr.map(obj => (wherePredicate(obj) ? newObj : obj)));
    },
    [setArr]
  );

  return {
    data: arr,
    set: setArr,
    add: addElement,
    delete: deleteElement,
    modify: modifyElement,
  };
};
