/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file ColorModeButton.tsx
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description ColorMode toggle button
 */

import { ColorModeIcon } from '@/components/ui/Icons';
import { useColorMode } from '@/hooks/useColorMode';
import { ClientOnly, Skeleton, type IconButtonProps } from '@chakra-ui/react';
import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';

interface ColorModeButtonProps extends Omit<IconButtonProps, 'aria-label'> {}

export const ColorModeButton = (props: ColorModeButtonProps) => {
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <ClientOnly fallback={<Skeleton boxSize='8' />}>
      <TooltipIconButton
        tooltip={colorMode === 'light' ? 'Toggle dark theme' : 'Toggle light theme'}
        onClick={toggleColorMode}
        variant='ghost'
        aria-label='Toggle color mode'
        size='sm'
        {...props}
        css={{
          _icon: {
            width: '5',
            height: '5',
          },
        }}
      >
        <ColorModeIcon />
      </TooltipIconButton>
    </ClientOnly>
  );
};
