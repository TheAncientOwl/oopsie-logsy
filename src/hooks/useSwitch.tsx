/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file useSwitch.tsx
 * @author Alexandru Delegeanu
 * @version 0.5
 * @description Utility hook to handle switch states
 */

import { useCallback, useState } from 'react';

export const useSwitch = (initialValue: boolean): [boolean, () => void] => {
  const [state, setState] = useState(initialValue);

  const toggle = useCallback(() => setState(prev => !prev), []);

  return [state, toggle];
};
