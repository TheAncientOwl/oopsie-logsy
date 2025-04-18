/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file Logger.ts
 * @author Alexandru Delegeanu
 * @version 0.6
 * @description Extend logging functionality.
 */

type TLogLevel = 'trace' | 'info' | 'warn' | 'debug' | 'error' | 'log';

const logFunctions: Record<TLogLevel, (...args: any[]) => void> = {
  error: console.error,
  warn: console.warn,
  debug: console.debug,
  info: console.info,
  trace: console.trace,
  log: console.log,
};

const padLeft = (value: number) => value.toString().padStart(2, '0');

const getCallerLocation = (depth = 3): string => {
  const stack = new Error().stack;
  if (!stack) return 'unknown';
  const lines = stack.split('\n');
  const callerLine = lines[depth] || 'unknown';
  return callerLine.trim().replace(/^.*?:\/\/localhost:\d+\//, '');
};

const _log = (level: TLogLevel, levelStyle: string, caller: string, message: string) => {
  const date = new Date();
  const timestamp = `${padLeft(date.getHours())}:${padLeft(date.getMinutes())}:${padLeft(
    date.getSeconds()
  )}:${date.getMilliseconds()}`;

  (logFunctions[level] || console.log)(
    `%c| %c${timestamp} %c| %c${getCallerLocation()}%c@%c${caller} %c» \n%c${message}`,
    'color: gray',
    'color: dodgerblue',
    'color: gray',
    levelStyle,
    'color: gray',
    `${levelStyle}; font-weight: bold`,
    'color: gray',
    levelStyle
  );
};

const trace = (caller: string, message: string) => {
  _log('trace', 'color: lightgray', caller, message);
};

const log = (caller: string, message: string) => {
  _log('log', 'color: lightgreen', caller, message);
};

const info = (caller: string, message: string) => {
  _log('info', 'color: darkturquoise', caller, message);
};

const warn = (caller: string, message: string) => {
  _log('warn', 'color: yellow', caller, message);
};

const debug = (caller: string, message: string) => {
  _log('debug', 'color: olivedrab', caller, message);
};

const error = (caller: string, message: string) => {
  _log('error', 'color: red', caller, message);
};

const assert = (caller: string, condition: boolean, ...data: any[]) => {
  if (!condition) {
    _log('error', 'color: red', caller, `Assertion failed!\n\t${JSON.stringify(data)}`);
  }
};

(() => {
  trace('anonymous-lambda', 'augmenting console logging');

  console.traceX = trace;
  console.logX = log;
  console.infoX = info;
  console.warnX = warn;
  console.debugX = debug;
  console.errorX = error;
  console.assertX = assert;

  trace('anonymous-lambda', 'console logging augmented');
})();
