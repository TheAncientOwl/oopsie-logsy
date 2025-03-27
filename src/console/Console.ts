/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file Logger.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description Logger utility.
 */

type LogLevel = 'trace' | 'info' | 'warn' | 'debug' | 'error' | 'log';

export class Console {
  private static _log(level: LogLevel, levelStyle: string, caller: string, message: string) {
    const padLeft = (value: number) => value.toString().padStart(2, '0');
    const date = new Date();
    const timestamp = `${padLeft(date.getHours())}:${padLeft(date.getMinutes())}:${padLeft(
      date.getSeconds()
    )}:${date.getMilliseconds()}`;

    const getLogFunction = () => {
      switch (level) {
        case 'error':
          return console.error;
        case 'warn':
          return console.warn;
        case 'debug':
          return console.debug;
        case 'info':
          return console.info;
        case 'trace':
          return console.trace;
        default:
          return console.log;
      }
    };

    getLogFunction()(
      `%c| %c${timestamp} %c| ::%c${caller} %c» %c${message}`,
      'color: gray',
      'color: dodgerblue',
      'color: gray',
      levelStyle,
      'color: gray',
      levelStyle
    );
  }

  public static trace(caller: string, message: string) {
    this._log('trace', 'color: white', caller, message);
  }

  public static log(caller: string, message: string) {
    this._log('log', 'color: ghostwhite', caller, message);
  }

  public static info(caller: string, message: string) {
    this._log('info', 'color: cornsilk', caller, message);
  }

  public static warn(caller: string, message: string) {
    this._log('warn', 'color: yellow', caller, message);
  }

  public static debug(caller: string, message: string) {
    this._log('debug', 'color: olivedrab', caller, message);
  }

  public static error(caller: string, message: string) {
    this._log('error', 'color: red', caller, message);
  }
}
