/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file lightTheme.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Theme maker helper.
 */

import { uuid } from '../../common/identifier';
import { TAppTheme } from '../data';

export const makeLightTheme = (): TAppTheme => ({
  id: uuid(),
  name: 'OopsieLogsy Light',
  logView: {
    table: {
      text: 'black',
      border: 'gray.600',
      stripedEven: 'gray.100',
      stripedOdd: 'gray.200',
      header: {
        background: 'gray.300',
        border: 'gray.900',
      },
    },
  },
  filters: {
    general: {
      background: 'gray.100',
      dragHandle: 'gray.400',
      text: 'black',
    },
    tabs: {
      headerColorPalette: 'green',
      buttons: {
        addNewTab: {
          variant: 'solid',
          colorPalette: 'green',
        },
        saveTabs: {
          variant: 'solid',
          colorPalette: 'green',
        },
      },
    },
    toolbox: {
      buttons: {
        filters: {
          apply: {
            variant: 'solid',
            colorPalette: 'green',
          },
          add: {
            variant: 'solid',
            colorPalette: 'green',
          },
          unmute: {
            variant: 'solid',
            colorPalette: 'green',
          },
          mute: {
            variant: 'solid',
            colorPalette: 'green',
          },
          collapse: {
            variant: 'solid',
            colorPalette: 'green',
          },
          expand: {
            variant: 'solid',
            colorPalette: 'green',
          },
        },
        tab: {
          duplicate: {
            variant: 'solid',
            colorPalette: 'green',
          },
          clear: {
            variant: 'solid',
            colorPalette: 'red',
          },
          delete: {
            variant: 'solid',
            colorPalette: 'red',
          },
        },
      },
      input: {
        background: 'gray.200',
        colorPalette: 'green',
        variant: 'subtle',
        text: 'black',
      },
    },
    filter: {
      text: 'black',
      background: 'gray.200',
      border: 'gray.300',
      separator: 'gray.600',
      filterNameInput: {
        colorPalette: 'green',
        variant: 'subtle',
        border: 'gray.600',
      },
      buttons: {
        hide: {
          variant: 'solid',
          colorPalette: 'green',
        },
        duplicate: {
          variant: 'solid',
          colorPalette: 'green',
        },
        delete: {
          variant: 'solid',
          colorPalette: 'red',
        },
        addComponent: {
          variant: 'solid',
          colorPalette: 'green',
        },
      },
      checkbox: {
        variant: 'solid',
        colorPalette: 'green',
        text: 'black',
      },
      itemHandleColor: 'gray.900',
    },
    component: {
      buttons: {
        delete: {
          variant: 'solid',
          colorPalette: 'red',
        },
        regex: {
          variant: 'solid',
          colorPalette: 'green',
        },
        case: {
          variant: 'solid',
          colorPalette: 'green',
        },
        equals: {
          variant: 'solid',
          colorPalette: 'green',
        },
      },
      input: {
        background: 'gray.200',
        colorPalette: 'green',
        variant: 'outline',
        text: 'black',
        border: 'gray.500',
      },
      select: {
        background: 'gray.200',
        colorPalette: 'green',
        variant: 'outline',
        text: {
          valid: 'black',
          invalid: 'red',
        },
        border: 'gray.500',
        alternatives: {
          background: 'gray.400',
          text: 'gray.200',
          hover: {
            background: 'gray.500',
            text: 'gray.300',
          },
        },
      },
      itemHandle: 'gray.900',
    },
  },
  settings: {
    general: {
      colors: {
        background: 'gray.100',
        border: 'gray.600',
        text: 'black',
      },
      buttons: {
        settings: {
          variant: 'solid',
          colorPalette: 'blue',
        },
      },
    },
    logsImporter: {
      button: {
        variant: 'solid',
        colorPalette: 'green',
      },
    },
    regexConfigurator: {
      buttons: {
        import: {
          variant: 'solid',
          colorPalette: 'blue',
        },
        export: {
          variant: 'solid',
          colorPalette: 'blue',
        },
        newTag: {
          variant: 'solid',
          colorPalette: 'green',
        },
        apply: {
          variant: 'solid',
          colorPalette: 'green',
        },
        delete: {
          variant: 'solid',
          colorPalette: 'red',
        },
        hide: {
          variant: 'solid',
          colorPalette: 'green',
        },
      },
      itemHandleColor: 'gray.900',
    },
  },
  general: {
    background: 'gray.100',
    tooltip: {
      background: 'gray.200',
      text: 'gray.700',
    },
  },
  toolbar: {
    background: 'gray.100',
    input: {
      background: 'gray.200',
      colorPalette: 'green',
      variant: 'subtle',
      text: 'black',
    },
    buttons: {
      settings: {
        variant: 'solid',
        colorPalette: 'green',
      },
      filters: {
        variant: 'solid',
        colorPalette: 'green',
      },
      next: {
        variant: 'solid',
        colorPalette: 'green',
      },
      prev: {
        variant: 'solid',
        colorPalette: 'green',
      },
    },
  },
});
