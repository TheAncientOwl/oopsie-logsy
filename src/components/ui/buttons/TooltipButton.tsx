/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file TooltipButton.tsx
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description ChakraUI button with tooltip property
 */

import { Tooltip } from '@/components/ui/Tooltip';
import type { ButtonProps } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';

type TTooltipButtonProps = ButtonProps & {
  tooltip: string;
};

export const TooltipButton = (props: TTooltipButtonProps) => {
  return (
    <Tooltip content={props.tooltip}>
      <Button {...props} />
    </Tooltip>
  );
};
