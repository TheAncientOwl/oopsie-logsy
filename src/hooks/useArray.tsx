/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file useArray.tsx
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description Handle array operations
 */

import { useCallback, useState } from 'react';

export type TArrayWherePredicate<T> = (obj: T) => boolean;
export type TDeleteArrayObject<T> = (where: TArrayWherePredicate<T>) => void;
export type TModifyArrayObject<T> = (where: TArrayWherePredicate<T>, newObj: T) => void;

export interface IArrayManager<T> {
  data: Array<T>;
  set: React.Dispatch<React.SetStateAction<T[]>>;
  add: (obj: T) => void;
  delete: TDeleteArrayObject<T>;
  modify: TModifyArrayObject<T>;
}

export const useArray = <T,>(initialValue: Array<T> | undefined): IArrayManager<T> => {
  const [arr, setArr] = useState<Array<T>>(initialValue === undefined ? [] : initialValue);

  const addElement = useCallback(
    (obj: T) => {
      setArr(prevArr => [...prevArr, obj]);
    },
    [setArr]
  );

  const deleteElement = useCallback(
    (wherePredicate: TArrayWherePredicate<T>) => {
      setArr(prevArr => prevArr.filter(obj => !wherePredicate(obj)));
    },
    [setArr]
  );

  const modifyElement = useCallback(
    (wherePredicate: TArrayWherePredicate<T>, newObj: T) => {
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
