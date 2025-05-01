/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file TooltipIconButton.tsx
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description ChakraUI icon button with tooltip property
 */

import { Tooltip } from '@/components/ui/tooltip';
import type { IconButtonProps } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';
import React from 'react';

type TTooltipIconButtonProps = {
  tooltip?: string;
};

export const TooltipIconButton: React.FC<TTooltipIconButtonProps & IconButtonProps> = props => {
  return (
    <Tooltip content={props.tooltip}>
      <IconButton {...props} />
    </Tooltip>
  );
};
