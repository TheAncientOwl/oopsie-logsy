/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file Logger.ts
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description Extend logging functionality.
 */

type LogLevel = 'trace' | 'info' | 'warn' | 'debug' | 'error' | 'log';

const logFunctions: Record<LogLevel, (...args: any[]) => void> = {
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

const _log = (level: LogLevel, levelStyle: string, caller: string, message: string) => {
  const date = new Date();
  const timestamp = `${padLeft(date.getHours())}:${padLeft(date.getMinutes())}:${padLeft(
    date.getSeconds()
  )}:${date.getMilliseconds()}`;

  (logFunctions[level] || console.log)(
    `%c| %c${timestamp} %c| %c${getCallerLocation()}%c@%c${caller} %c» %c${message}`,
    'color: gray',
    'color: dodgerblue',
    'color: gray',
    'color: lightslategrey',
    'color: gray',
    levelStyle,
    'color: gray',
    levelStyle
  );
};

const trace = (caller: string, message: string) => {
  _log('trace', 'color: white', caller, message);
};

const log = (caller: string, message: string) => {
  _log('log', 'color: ghostwhite', caller, message);
};

const info = (caller: string, message: string) => {
  _log('info', 'color: cornsilk', caller, message);
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

(() => {
  info('anonymous-lambda', 'augmenting console logging');

  console.traceX = trace;
  console.logX = log;
  console.infoX = info;
  console.warnX = warn;
  console.debugX = debug;
  console.errorX = error;

  info('anonymous-lambda', 'console logging augmented');
})();
