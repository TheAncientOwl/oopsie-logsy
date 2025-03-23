/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file useArray.tsx
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Handle array operations
 */

import { useCallback, useState } from 'react';

export interface ArrayManager<T> {
  data: Array<T>;
  set: React.Dispatch<React.SetStateAction<T[]>>;
  add: (obj: T) => void;
  delete: (index: number) => void;
  modify: (index: number, modify: T) => void;
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
    (index: number) => {
      setArr(prevArr => prevArr.filter((_, i) => i !== index));
    },
    [setArr]
  );

  const modifyElement = useCallback(
    (index: number, newValue: T) => {
      setArr(prevArr => prevArr.map((item, i) => (i === index ? newValue : item)));
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
