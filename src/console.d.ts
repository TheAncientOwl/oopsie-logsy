declare global {
  type Nameable = string | { name: string };
  interface Console {
    traceX(caller: Nameable, ...data: any[]): void;
    verboseX(caller: Nameable, ...data: any[]): void;
    infoX(caller: Nameable, ...data: any[]): void;
    warnX(caller: Nameable, ...data: any[]): void;
    debugX(caller: Nameable, ...data: any[]): void;
    errorX(caller: Nameable, ...data: any[]): void;
    assertX(caller: Nameable, condition: boolean, ...data: any[]);
  }
}

export {};
