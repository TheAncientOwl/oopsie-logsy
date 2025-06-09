/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file Logger.ts
 * @author Alexandru Delegeanu
 * @version 0.13
 * @description Extend logging functionality.
 */

type TLogLevel = 'trace' | 'info' | 'warn' | 'debug' | 'error' | 'redux';

const cerror = console.error;
const cwarn = console.warn;
const cinfo = console.info;
const ctrace = console.trace;
const clog = console.log;

const logFunctions: Record<TLogLevel, (...args: any[]) => void> = {
  error: cerror,
  warn: cwarn,
  debug: cwarn,
  info: cinfo,
  trace: ctrace,
  redux: clog,
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

const _log = (level: TLogLevel, levelStyle: string, caller: Nameable, ...data: any[]) => {
  const date = new Date();
  const timestamp = `${padLeft(date.getHours())}:${padLeft(date.getMinutes())}:${padLeft(
    date.getSeconds()
  )}:${padLeft(date.getMilliseconds(), 3)}`;

  const callerLocation = getCallerLocation();

  const hasStringMessage = data.length > 0 && typeof data[0] === 'string';

  (logFunctions[level] || console.log)(
    `%c| %c${timestamp} %c| ${formatLevel(level)} %c${extractFileName(
      callerLocation
    )}::${typeof caller === 'string' ? caller : caller.name}%c @ %c${callerLocation} %c${data.length > 0 ? '»\n|' : ''} %c${hasStringMessage ? data[0] : ''}`,
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
    ...(hasStringMessage ? data.slice(1, data.length) : data)
  );
};

const trace = (caller: Nameable, ...data: any[]) => {
  _log('trace', 'color: white', caller, ...data);
};

const info = (caller: Nameable, ...data: any[]) => {
  _log('info', 'color: deepskyblue', caller, ...data);
};

const warn = (caller: Nameable, ...data: any[]) => {
  _log('warn', 'color: yellow', caller, ...data);
};

const debug = (caller: Nameable, ...data: any[]) => {
  _log('debug', 'color: gold', caller, ...data);
};

const error = (caller: Nameable, ...data: any[]) => {
  _log('error', 'color: red', caller, ...data);
};

const redux = (caller: Nameable, ...data: any[]) => {
  _log(
    'redux',
    'color: hotpink; background-color: rgba(128, 0, 128, 0.5); padding: 2px 3px; border-radius: 5px',
    caller,
    ...data
  );
};

const assert = (caller: Nameable, condition: boolean, ...data: any[]) => {
  if (!condition) {
    _log('error', 'color: red', caller, `Assertion failed!\n\t${JSON.stringify(data)}`);
  }
};

(() => {
  trace('setup', 'augmenting console logging');

  console.trace = trace;
  console.info = info;
  console.warn = warn;
  console.debug = debug;
  console.error = error;
  console.assertX = assert;
  console.redux = redux;

  trace('setup', 'console logging augmented');
})();
