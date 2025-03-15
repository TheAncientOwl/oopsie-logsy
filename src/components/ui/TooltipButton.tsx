/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file TooltipButton.tsx
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description ChakraUI button with tooltip property
 */

import { Button, ButtonProps } from '@chakra-ui/react';
import { Tooltip } from './tooltip';

export interface TooltipButtonProps extends ButtonProps {
  tooltip: string;
}

export const TooltipButton = (props: TooltipButtonProps) => {
  return (
    <Tooltip content={props.tooltip}>
      <Button {...props} />
    </Tooltip>
  );
};
