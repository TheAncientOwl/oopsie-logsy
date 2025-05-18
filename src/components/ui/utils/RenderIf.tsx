/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file RenderIf.tsx
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Utility component to avoid {condition && <Component/>} scenarios.
 */

import React, { type PropsWithChildren } from 'react';

type TProps = {
  condition: boolean;
};

export const RenderIf: React.FC<TProps & PropsWithChildren> = props => {
  return <>{props.condition && props.children}</>;
};
