/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file Settings.tsx
 * @author Alexandru Delegeanu
 * @version 0.12
 * @description App settings
 */

import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import { SettingsIcon } from '@/components/ui/icons';
import { TRootState } from '@/store';
import { Box, Collapsible, Heading, HStack, Tabs } from '@chakra-ui/react';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  LogRegexConfiguratorContent,
  LogRegexConfiguratorTrigger,
} from './log-regex-configurator/LogRegexConfigurator';
import { LogsImporter } from './logs-importer/LogsImporter';
import { ColorModeButton } from '@/components/ui/buttons/ColorModeButton';

type TSettingsProps = {
  menuOpen: boolean;
  onMenuClose: () => void;
};

export const SettingsImpl: React.FC<TSettingsProps & TPropsFromRedux> = props => {
  return (
    <Collapsible.Root open={props.menuOpen} position='fixed' top='0' left='0' zIndex={10000}>
      <Collapsible.Content>
        <Box
          border='1px solid'
          height='100vh'
          width='min(700px,100vw)'
          padding={'0.5em'}
          overflow='scroll'
          color={props.theme.colors.text}
          bgColor={props.theme.colors.background}
          borderColor={props.theme.colors.border}
        >
          <HStack marginBottom={'0.5em'}>
            <TooltipIconButton
              tooltip='Close'
              size='md'
              onClick={props.onMenuClose}
              variant={props.theme.buttons.settings.variant}
              colorPalette={props.theme.buttons.settings.colorPalette}
            >
              <SettingsIcon />
            </TooltipIconButton>

            <LogsImporter />

            <ColorModeButton />

            <Heading size='2xl' ml='0.25em'>
              Settings
            </Heading>
          </HStack>

          <Tabs.Root defaultValue='log-regex-configurator' colorPalette='green'>
            <Tabs.List position='sticky'>
              <Tabs.Trigger value='log-regex-configurator'>
                <LogRegexConfiguratorTrigger />
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value='log-regex-configurator'>
              <LogRegexConfiguratorContent />
            </Tabs.Content>
          </Tabs.Root>
        </Box>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

// <redux>
const mapState = (state: TRootState) => ({
  theme: state.theme.themes[state.theme.activeThemeIndex].settings.general,
});

const mapDispatch = {};

const connector = connect(mapState, mapDispatch);
type TPropsFromRedux = ConnectedProps<typeof connector>;

export const Settings = connector(SettingsImpl);
// </redux>
