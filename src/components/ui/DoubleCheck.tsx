/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file DoubleCheck.tsx
 * @author Alexandru Delegeanu
 * @version 0.5
 * @description Self explanatory.
 */

import React, { PropsWithChildren } from 'react';

import { useColorModeValue } from '@/hooks/useColorMode';
import { Box, BoxProps, Button, ButtonGroup, Portal, Stack } from '@chakra-ui/react';

type TDoubleCheckProps = {
  isShown: boolean;
  label: React.ReactNode;
  acceptLabel: string;
  declineLabel: string;
  onAccept: () => void;
  onDecline: () => void;
  contentProps?: BoxProps;
};

export const DoubleCheck: React.FC<TDoubleCheckProps & PropsWithChildren> = props => {
  const backgroundColor = useColorModeValue('gray.500', 'gray.800');

  return (
    <Portal>
      <Stack
        display={props.isShown ? 'flex' : 'none'}
        visibility={props.isShown ? 'visible' : 'hidden'}
        position='fixed'
        zIndex='1000000'
        top='0'
        bottom='0'
        left='0'
        right='0'
        justifyContent='center'
        alignItems='center'
        backgroundColor='rgba(0, 0, 0, 0.5)'
        overflow='hidden'
      >
        <Stack
          justifyContent='center'
          alignItems='center'
          backgroundColor={backgroundColor}
          boxShadow='md'
          borderRadius='10px'
          padding='2rem 5rem'
        >
          <Box fontWeight='bold' fontSize='1.2em' mb='1em'>
            {props.label}
          </Box>

          <Box mb='1.5em' textAlign='center' {...props.contentProps}>
            {props.children}
          </Box>

          <ButtonGroup
            size='md'
            variant='surface'
            display='flex'
            gap='10rem'
            justifyContent='center'
            width='100%'
          >
            <Button colorPalette='green' onClick={props.onAccept}>
              {props.acceptLabel}
            </Button>
            <Button colorPalette='red' onClick={props.onDecline}>
              {props.declineLabel}
            </Button>
          </ButtonGroup>
        </Stack>
      </Stack>
    </Portal>
  );
};
