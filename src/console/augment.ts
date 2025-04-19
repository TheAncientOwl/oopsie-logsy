/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file Logger.ts
 * @author Alexandru Delegeanu
 * @version 0.9
 * @description Extend logging functionality.
 */

type TLogLevel = 'trace' | 'trace2' | 'info' | 'warn' | 'debug' | 'error' | 'verbose';

const logFunctions: Record<TLogLevel, (...args: any[]) => void> = {
  error: console.error,
  warn: console.warn,
  debug: console.debug,
  info: console.info,
  trace: console.log,
  verbose: console.log,
  trace2: console.trace,
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
    `%c| %c${timestamp} %c| %c${level} %c| %c${extractFileName(
      callerLocation
    )}::${caller}%c@%c${callerLocation} \n%c» %c${message}`,
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
  _log('trace', 'color: lightgray', caller, message, ...data);
};

const traceVerbose = (caller: string, message: string, ...data: any[]) => {
  _log('trace2', 'color: lightgray', caller, message, ...data);
};

const info = (caller: string, message: string, ...data: any[]) => {
  _log('info', 'color: deepskyblue', caller, message, ...data);
};

const warn = (caller: string, message: string, ...data: any[]) => {
  _log('warn', 'color: yellow', caller, message, ...data);
};

const debug = (caller: string, message: string, ...data: any[]) => {
  _log('debug', 'color: greenyellow', caller, message, ...data);
};

const error = (caller: string, message: string, ...data: any[]) => {
  _log('error', 'color: red', caller, message, ...data);
};

const verbose = (caller: string, message: string, ...data: any[]) => {
  _log('verbose', 'color: olivedrab', caller, message, ...data);
};

const assert = (caller: string, condition: boolean, ...data: any[]) => {
  if (!condition) {
    _log('error', 'color: red', caller, `Assertion failed!\n\t${JSON.stringify(data)}`);
  }
};

(() => {
  trace('anonymous-lambda', 'augmenting console logging');

  console.traceX = trace;
  console.traceVerboseX = traceVerbose;
  console.infoX = info;
  console.warnX = warn;
  console.debugX = debug;
  console.errorX = error;
  console.assertX = assert;
  console.verboseX = verbose;

  trace('anonymous-lambda', 'console logging augmented');
})();
