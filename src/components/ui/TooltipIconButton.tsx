/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file TooltipIconButton.tsx
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description ChakraUI icon button with tooltip property
 */

import { IconButton, IconButtonProps } from '@chakra-ui/react';
import { Tooltip } from './tooltip';

export interface TooltipIconButtonProps extends IconButtonProps {
  tooltip?: string;
}

export const TooltipIconButton = (props: TooltipIconButtonProps) => {
  return (
    <Tooltip content={props.tooltip}>
      <IconButton {...props} />
    </Tooltip>
  );
};
