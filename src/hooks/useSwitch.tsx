/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file useSwitch.tsx
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description Utility hook to handle switch states
 */

import { useState, useCallback } from 'react';

const useSwitch = () => {
  const [state, setState] = useState(false);

  const toggle = useCallback(() => setState(prev => !prev), []);

  return { state, toggle };
};

export const useSwitch2 = (initialValue: boolean) => {
  const [state, setState] = useState(initialValue);

  const toggle = useCallback(() => setState(prev => !prev), []);

  return { state, toggle };
};

export default useSwitch;
