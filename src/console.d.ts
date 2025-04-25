declare global {
  type Nameable = string | { name: string };
  interface Console {
    trace(caller: Nameable, ...data: any[]): void;
    verbose(caller: Nameable, ...data: any[]): void;
    info(caller: Nameable, ...data: any[]): void;
    warn(caller: Nameable, ...data: any[]): void;
    debug(caller: Nameable, ...data: any[]): void;
    error(caller: Nameable, ...data: any[]): void;
    assertX(caller: Nameable, condition: boolean, ...data: any[]);
  }
}

export {};
