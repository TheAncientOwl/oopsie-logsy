/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file Logger.ts
 * @author Alexandru Delegeanu
 * @version 0.10
 * @description Extend logging functionality.
 */

type TLogLevel = 'trace' | 'info' | 'warn' | 'debug' | 'error' | 'verbose';

const logFunctions: Record<TLogLevel, (...args: any[]) => void> = {
  error: console.error,
  warn: console.warn,
  debug: console.warn,
  info: console.info,
  trace: console.trace,
  verbose: console.log,
};

const padLeft = (value: number, digits: number = 2) => value.toString().padStart(digits, '0');

const getCallerLocation = (depth = 3): string => {
  const stack = new Error().stack;
  if (!stack) return 'unknown';
  const lines = stack.split('\n');
  const callerLine = lines[depth] || 'unknown';
  return callerLine.trim().replace(/^.*?:\/\/localhost:\d+\//, '');
};

const extractFileName = (input: string): string => {
  const pathPart = input.split(':')[0];
  const fileWithExt = pathPart.split('/').pop();
  return fileWithExt?.replace(/\.ts$/, '') ?? '';
};

const formatLevel = (level: TLogLevel) => {
  return level !== 'trace' ? `%c ${level} %c |` : `%c%c`;
};

const _log = (
  level: TLogLevel,
  levelStyle: string,
  caller: string,
  message: string,
  ...data: any[]
) => {
  const date = new Date();
  const timestamp = `${padLeft(date.getHours())}:${padLeft(date.getMinutes())}:${padLeft(
    date.getSeconds()
  )}:${padLeft(date.getMilliseconds(), 3)}`;

  const callerLocation = getCallerLocation();

  (logFunctions[level] || console.log)(
    `%c| %c${timestamp} %c| ${formatLevel(level)} %c${extractFileName(
      callerLocation
    )}::${caller}%c @ %c${callerLocation} %c»\n| %c${message}`,
    'color: gray',
    'color: dodgerblue',
    'color: gray',
    levelStyle,
    'color: gray',
    levelStyle,
    'color: gray',
    levelStyle,
    'color: gray',
    levelStyle,
    ...data
  );
};

const trace = (caller: string, message: string, ...data: any[]) => {
  _log('trace', 'color: white', caller, message, ...data);
};

const info = (caller: string, message: string, ...data: any[]) => {
  _log('info', 'color: deepskyblue', caller, message, ...data);
};

const warn = (caller: string, message: string, ...data: any[]) => {
  _log('warn', 'color: yellow', caller, message, ...data);
};

const debug = (caller: string, message: string, ...data: any[]) => {
  _log('debug', 'color: lightgreen', caller, message, ...data);
};

const error = (caller: string, message: string, ...data: any[]) => {
  _log('error', 'color: red', caller, message, ...data);
};

const verbose = (caller: string, message: string, ...data: any[]) => {
  _log('verbose', 'color: gray', caller, message, ...data);
};

const assert = (caller: string, condition: boolean, ...data: any[]) => {
  if (!condition) {
    _log('error', 'color: red', caller, `Assertion failed!\n\t${JSON.stringify(data)}`);
  }
};

(() => {
  trace('setup', 'augmenting console logging');

  console.traceX = trace;
  console.infoX = info;
  console.warnX = warn;
  console.debugX = debug;
  console.errorX = error;
  console.assertX = assert;
  console.verboseX = verbose;

  trace('setup', 'console logging augmented');
})();
