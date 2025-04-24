declare global {
  interface Console {
    traceX(caller: string, message: string, ...data: any[]): void;
    verboseX(caller: string, message: string, ...data: any[]): void;
    infoX(caller: string, message: string, ...data: any[]): void;
    warnX(caller: string, message: string, ...data: any[]): void;
    debugX(caller: string, message: string, ...data: any[]): void;
    errorX(caller: string, message: string, ...data: any[]): void;
    assertX(caller: string, condition: boolean, ...data: any[]);
  }
}

export {};
