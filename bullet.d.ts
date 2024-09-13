import { Dispatch, Reducer, Store } from "@reduxjs/toolkit";

declare module "bullet" {
  type Schema = { [name: string]: { type: any; default?: any } };
  type AttributeTypes<T extends Schema> = {
    [Key in keyof T]: T[Key]["default"];
  };

  type Select = <T extends (state: any, ...args: any) => any>(
    selector: T
  ) => ReturnType<T>;

  export class Entity<A> {
    static store: Store;
    static dispatch: Dispatch<any>;
    static select: Select;
    static schema: Schema;
    static count: number;
    static slice: { [name: string]: Reducer };
    static useAll<T extends Entity<any>, A>(
      this: new (a: Partial<A>) => T
    ): T[];
    static where<T extends Entity<any>, A>(
      this: new (a: Partial<A>) => T,
      attributes: Partial<A>
    ): T[];
    static find<T extends Entity<unknown>, A>(
      this: new (a: Partial<A>) => T,
      id: string
    ): T;
    static create<T extends Entity<unknown>, A>(
      this: new (a?: Partial<A>) => T,
      attributes?: Partial<A>
    ): T;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    attributes: A;
    dispatch: Dispatch<any>;
    select: Select;
    constructor(attributes?: Partial<A>);
    save(): boolean;
    destroy(): void;
    update(attributes: Partial<A>): void;
  }
}
