/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file data.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description Theme data.
 */

import { type ThemeTypings } from '@chakra-ui/styled-system';
import { type UUID } from '../common/identifier';
import { makeDarkTheme } from './themes/darkTheme';
import { makeLightTheme } from './themes/lightTheme';

// <types>
export type TColorSceheme = ThemeTypings['colorSchemes'];
export type TColorPalette = TColorSceheme;
export type TColor = ThemeTypings['colors'];
export type TButtonVariant = 'solid' | 'subtle' | 'solid' | 'outline' | 'ghost' | 'plain';
export type TInputVariant = 'subtle' | 'outline' | 'flushed';
export type TCheckboxVariant = 'outline' | 'solid' | 'subtle';

type TButton = {
  colorPalette: TColorPalette;
  variant: TButtonVariant;
};

type TSettingsTheme = {
  general: {
    colors: {
      background: TColor;
      border: TColor;
      text: TColor;
    };
    buttons: {
      settings: TButton;
    };
  };
  logsImporter: {
    button: TButton;
  };
  regexConfigurator: {
    buttons: {
      import: TButton;
      export: TButton;
      newTag: TButton;
      apply: TButton;
      delete: TButton;
      hide: TButton;
    };
    itemHandleColor: TColor;
  };
};

type TLogViewTheme = {
  table: {
    text: TColor;
    border: TColor;
    stripedEven: TColor;
    stripedOdd: TColor;
    header: {
      background: TColor;
      border: TColor;
    };
  };
};

type TFiltersTheme = {
  general: {
    background: TColor;
    text: TColor;
  };
  tabs: {
    headerColorPalette: TColorPalette;
    buttons: {
      addNewTab: TButton;
      saveTabs: TButton;
    };
  };
  toolbox: {
    buttons: {
      filters: {
        apply: TButton;
        add: TButton;
        unmute: TButton;
        mute: TButton;
        collapse: TButton;
        expand: TButton;
      };
      tab: {
        duplicate: TButton;
        clear: TButton;
        delete: TButton;
      };
    };
    input: {
      background: TColor;
      colorPalette: TColorPalette;
      variant: TInputVariant;
      text: TColor;
    };
  };
  filter: {
    text: TColor;
    background: TColor;
    border: TColor;
    separator: TColor;
    filterNameInput: {
      colorPalette: TColorPalette;
      variant: TInputVariant;
      border: TColor;
    };
    buttons: {
      hide: TButton;
      duplicate: TButton;
      delete: TButton;
      addComponent: TButton;
    };
    checkbox: {
      variant: TCheckboxVariant;
      colorPalette: TColorPalette;
      text: TColor;
    };
    itemHandleColor: TColor;
  };
  component: {
    buttons: {
      delete: TButton;
      regex: TButton;
      case: TButton;
      equals: TButton;
    };
    input: {
      background: TColor;
      colorPalette: TColorPalette;
      variant: TInputVariant;
      text: TColor;
      border: TColor;
    };
    select: {
      background: TColor;
      colorPalette: TColorPalette;
      variant: TInputVariant;
      text: {
        valid: TColor;
        invalid: TColor;
      };
      border: TColor;
      alternatives: {
        background: TColor;
        text: TColor;
        hover: {
          background: TColor;
          text: TColor;
        };
      };
    };
    itemHandle: TColor;
  };
};

type TGeneralTheme = {
  background: TColor;
  dragHandle: TColor;
  tooltip: {
    background: TColor;
    text: TColor;
  };
};

type TToolbarTheme = {
  background: TColor;
  input: {
    background: TColor;
    colorPalette: TColorPalette;
    variant: TInputVariant;
    text: TColor;
  };
  buttons: {
    settings: TButton;
    filters: TButton;
    next: TButton;
    prev: TButton;
  };
};

export type TAppTheme = {
  id: UUID;
  name: string;
  logView: TLogViewTheme;
  filters: TFiltersTheme;
  settings: TSettingsTheme;
  general: TGeneralTheme;
  toolbar: TToolbarTheme;
};

export type TStoreState = {
  themes: TAppTheme[];
  activeThemeIndex: number;
};
// </types

// <helpers>
export const DefaultFactory = {
  makeLightTheme,
  makeDarkTheme,
};
// </helpers>

// <data>
export const defaultState: TStoreState = {
  themes: [DefaultFactory.makeDarkTheme(), DefaultFactory.makeLightTheme()],
  activeThemeIndex: 0,
};
// </data>
