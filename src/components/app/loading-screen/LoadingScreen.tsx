/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file LoadingScreen.tsx
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Loading screen UI.
 */

import React from 'react';

import { RenderIf } from '@/components/ui/utils/RenderIf';
import { TRootState } from '@/store';
import { Spinner, Stack, Text } from '@chakra-ui/react';
import { connect, ConnectedProps } from 'react-redux';

const LoadingScreenImpl: React.FC<TPropsFromRedux> = props => {
  return (
    <RenderIf condition={props.loading}>
      <Stack
        alignItems='center'
        justifyContent='center'
        colorPalette='green'
        zIndex={99999999999}
        position='fixed'
        top='0'
        right='0'
        bottom='0'
        left='0'
        backgroundColor='blackAlpha.700'
      >
        <Stack
          backgroundColor='gray.900'
          alignItems='center'
          justifyContent='center'
          padding='1em 5em'
          borderRadius='10px'
        >
          <Spinner color='colorPalette.600' />
          <Text color='colorPalette.600'>Loading...</Text>
        </Stack>
      </Stack>
    </RenderIf>
  );
};

// <redux>
const mapState = (state: TRootState) => ({
  // TODO: display loading for settings and filters only if open;
  // it includes moving open states to redux store
  loading: state.filters.loading || state.logRegexTags.loading || state.logs.loading,
});

const mapDispatch = {};

const connector = connect(mapState, mapDispatch);
type TPropsFromRedux = ConnectedProps<typeof connector>;

export const LoadingScreen = connector(LoadingScreenImpl);
// </redux>
