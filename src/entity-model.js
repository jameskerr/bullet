import { createSlice, nanoid } from "@reduxjs/toolkit";
import { snakeCase } from "lodash-es";
import { createEntityReducers } from "./entity/reducers.js";
import { createEntitySelectors } from "./entity/selectors.js";
import { Schema } from "./entity/schema.js";

export class EntityModel {
  static store = null;

  static get slice() {
    return { [this.sliceName]: this.reducer };
  }

  static get sliceName() {
    return snakeCase(this.name);
  }

  static get reduxSlice() {
    return createSlice({
      name: this.sliceName,
      reducers: createEntityReducers(),
      initialState: { ids: [], entities: {} },
    });
  }

  static get reducer() {
    return this.reduxSlice.reducer;
  }

  static get actions() {
    return this.reduxSlice.actions;
  }

  static selectSlice() {
    return this.select((state) => state[this.sliceName]);
  }

  static get selectors() {
    return createEntitySelectors(this.selectSlice.bind(this));
  }

  static dispatch(action) {
    return this.store.dispatch(action);
  }

  static select(selector) {
    return selector(this.store.getState());
  }

  static create(attrs) {
    const entity = new this(attrs);
    entity.save();
    return entity;
  }

  static find(id) {
    const attrs = this.select(this.selectors.find(id));
    if (!attrs) return null;
    return new this(attrs);
  }

  constructor(attrs = {}) {
    this.Slice = this.constructor;
    this.schema = new Schema(this.Slice.attributes);
    this.attrs = this.schema.deserialize(this.schema.fill(attrs));
    for (const name of this.schema.names) {
      Object.defineProperty(this, name, {
        get: () => this.attrs[name],
        set: (value) => (this.attrs[name] = value),
      });
    }
  }

  save() {
    if (this.isNewRecord) {
      this.id = nanoid();
      this.createdAt = new Date();
      this.updatedAt = new Date();
      this.Slice.dispatch(this.Slice.actions.create(this.serialize()));
    } else {
    }
  }

  get isNewRecord() {
    return !this.id;
  }

  get attributes() {
    let attrs = {};
    for (const name of this.schema.names) attrs[name] = this[name];
    return attrs;
  }

  serialize() {
    return this.schema.serialize(this.attrs);
  }
}
