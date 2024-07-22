import { createSlice, nanoid } from "@reduxjs/toolkit";
import { snakeCase } from "lodash-es";
import pluralize from "pluralize";
import { createEntityReducers } from "./entity/reducers.js";
import { createEntitySelectors } from "./entity/selectors.js";
import { Schema } from "./entity/schema.js";
import { cache } from "./utils/cache.js";

export class Entity {
  static store = null;
  static useSelector = null;

  static get slice() {
    return { [this.sliceName]: this.reducer };
  }

  static get sliceName() {
    return pluralize.plural(snakeCase(this.name));
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
    return cache(this, "_selectors", () =>
      createEntitySelectors(this.selectSlice.bind(this), this)
    );
  }

  static dispatch(action) {
    return this.store.dispatch(action);
  }

  static select(selector) {
    return selector(this.store.getState());
  }

  static create(attrs = {}) {
    const entity = new this(attrs);
    entity.save();
    return entity;
  }

  static find(id) {
    const attrs = this.select(this.selectors.find(id));
    if (!attrs) return null;
    return new this(attrs);
  }

  static where(attrs) {
    return this.all.filter((item) => {
      return Object.keys(attrs).every((key) => attrs[key] === item[key]);
    });
  }

  static get all() {
    return this.select(this.selectors.all);
  }

  static destroyAll() {
    this.dispatch(this.actions.destroyAll());
  }

  static get count() {
    return this.select(this.selectors.count);
  }

  static useAll() {
    return this.useSelector(this.selectors.all);
  }

  static use(id) {
    return this.useSelector(this.selector.find(id));
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
      this.id = this.id || nanoid();
      this.createdAt = new Date();
      this.updatedAt = new Date();
      this.Slice.dispatch(this.Slice.actions.create(this.serialize()));
    } else {
      this.Slice.dispatch(
        this.Slice.actions.update({ id: this.id, changes: this.serialize() })
      );
    }
  }

  destroy() {
    this.dispatch(this.Slice.actions.destroy(this.id));
  }

  get isNewRecord() {
    return !this.createdAt;
  }

  get attributes() {
    let attrs = {};
    for (const name of this.schema.names) attrs[name] = this[name];
    return attrs;
  }

  serialize() {
    return this.schema.serialize(this.attrs);
  }

  dispatch(...args) {
    return this.constructor.dispatch(...args);
  }

  select(selector) {
    return this.constructor.select(selector);
  }
}
