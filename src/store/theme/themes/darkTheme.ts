/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file darkTheme.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description Theme maker helper.
 */

import { uuid } from '../../common/identifier';
import { TAppTheme } from '../data';

export const makeDarkTheme = (): TAppTheme => ({
  id: uuid(),
  name: 'OopsieLogsy Dark',
  logView: {
    table: {
      text: 'gray.100',
      border: 'gray.950',
      stripedEven: 'gray.900',
      stripedOdd: 'black',
      header: {
        background: 'black',
        border: 'gray.950',
      },
    },
  },
  filters: {
    general: {
      background: 'gray.900',
      text: 'gray.100',
    },
    tabs: {
      headerColorPalette: 'green',
      buttons: {
        addNewTab: {
          variant: 'subtle',
          colorPalette: 'green',
        },
        saveTabs: {
          variant: 'subtle',
          colorPalette: 'green',
        },
      },
    },
    toolbox: {
      buttons: {
        filters: {
          apply: {
            variant: 'subtle',
            colorPalette: 'green',
          },
          add: {
            variant: 'subtle',
            colorPalette: 'green',
          },
          unmute: {
            variant: 'subtle',
            colorPalette: 'green',
          },
          mute: {
            variant: 'subtle',
            colorPalette: 'green',
          },
          collapse: {
            variant: 'subtle',
            colorPalette: 'green',
          },
          expand: {
            variant: 'subtle',
            colorPalette: 'green',
          },
        },
        tab: {
          duplicate: {
            variant: 'subtle',
            colorPalette: 'green',
          },
          clear: {
            variant: 'subtle',
            colorPalette: 'red',
          },
          delete: {
            variant: 'subtle',
            colorPalette: 'red',
          },
        },
      },
      input: {
        background: 'gray.900',
        colorPalette: 'green',
        variant: 'outline',
        text: 'gray.100',
      },
    },
    filter: {
      text: 'gray.100',
      background: 'gray.800',
      border: 'gray.700',
      separator: 'gray.600',
      filterNameInput: {
        colorPalette: 'green',
        variant: 'subtle',
        border: 'gray.500',
      },
      buttons: {
        hide: {
          variant: 'subtle',
          colorPalette: 'green',
        },
        duplicate: {
          variant: 'subtle',
          colorPalette: 'green',
        },
        delete: {
          variant: 'subtle',
          colorPalette: 'red',
        },
        addComponent: {
          variant: 'subtle',
          colorPalette: 'green',
        },
      },
      checkbox: {
        variant: 'subtle',
        colorPalette: 'green',
        text: 'gray.100',
      },
      itemHandleColor: 'gray.200',
    },
    component: {
      buttons: {
        delete: {
          variant: 'subtle',
          colorPalette: 'red',
        },
        regex: {
          variant: 'subtle',
          colorPalette: 'green',
        },
        case: {
          variant: 'subtle',
          colorPalette: 'green',
        },
        equals: {
          variant: 'subtle',
          colorPalette: 'green',
        },
      },
      input: {
        background: 'gray.800',
        colorPalette: 'green',
        variant: 'outline',
        text: 'gray.100',
        border: 'gray.500',
      },
      select: {
        background: 'gray.800',
        colorPalette: 'green',
        variant: 'outline',
        text: {
          valid: 'gray.100',
          invalid: 'red.600',
        },
        border: 'gray.500',
        alternatives: {
          background: 'black',
          text: 'gray.100',
          hover: {
            background: 'gray.500',
            text: 'gray.300',
          },
        },
      },
      itemHandle: 'gray.200',
    },
  },
  settings: {
    general: {
      colors: {
        background: 'gray.950',
        border: 'gray.600',
        text: 'gray.200',
      },
      buttons: {
        settings: {
          variant: 'outline',
          colorPalette: 'blue',
        },
      },
    },
    logsImporter: {
      button: {
        variant: 'outline',
        colorPalette: 'green',
      },
    },
    regexConfigurator: {
      buttons: {
        import: {
          variant: 'subtle',
          colorPalette: 'blue',
        },
        export: {
          variant: 'subtle',
          colorPalette: 'blue',
        },
        newTag: {
          variant: 'subtle',
          colorPalette: 'green',
        },
        apply: {
          variant: 'subtle',
          colorPalette: 'green',
        },
        delete: {
          variant: 'subtle',
          colorPalette: 'red',
        },
        hide: {
          variant: 'subtle',
          colorPalette: 'green',
        },
      },
      itemHandleColor: 'gray.200',
    },
  },
  general: {
    background: 'black',
    dragHandle: 'gray.500',
    tooltip: {
      background: 'gray.600',
      text: 'gray.100',
    },
  },
  toolbar: {
    background: 'black',
    input: {
      background: 'gray.900',
      colorPalette: 'green',
      variant: 'subtle',
      text: 'gray.100',
    },
    buttons: {
      settings: {
        variant: 'outline',
        colorPalette: 'green',
      },
      filters: {
        variant: 'outline',
        colorPalette: 'green',
      },
      next: {
        variant: 'outline',
        colorPalette: 'green',
      },
      prev: {
        variant: 'outline',
        colorPalette: 'green',
      },
    },
  },
});
