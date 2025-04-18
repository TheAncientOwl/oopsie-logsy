declare global {
  interface Console {
    traceX(caller: string, message: string): void;
    logX(caller: string, message: string): void;
    infoX(caller: string, message: string): void;
    warnX(caller: string, message: string): void;
    debugX(caller: string, message: string): void;
    errorX(caller: string, message: string): void;
    assertX(caller: string, condition: boolean, ...data: any[]);
  }
}

export {};
