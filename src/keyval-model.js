import { createSlice } from "@reduxjs/toolkit";
import { snakeCase } from "lodash-es";
import { createKeyValReducers } from "./keyval/reducers.js";
import { createKeyValSelectors } from "./keyval/selectors.js";

export class KeyValModel {
  static store = null;

  static instance() {
    return new this();
  }

  static dispatch(action) {
    return this.store.dispatch(action);
  }

  static select(selector) {
    return selector(this.store.getState());
  }

  static selectSlice(state) {
    return state[this.sliceName];
  }

  static get initialState() {
    return { ...this.attributes };
  }

  static get reduxSlice() {
    return createSlice({
      initialState: this.initialState,
      name: this.sliceName,
      reducers: createKeyValReducers(this.attributes),
    });
  }

  static get sliceName() {
    return snakeCase(this.name);
  }

  static get reducer() {
    return this.reduxSlice.reducer;
  }

  static get slice() {
    return { [this.sliceName]: this.reducer };
  }

  static get actions() {
    return this.reduxSlice.actions;
  }

  static get selectors() {
    return createKeyValSelectors(this.selectSlice.bind(this), this.attributes);
  }

  constructor() {
    const Slice = this.constructor;
    for (const name of Object.keys(Slice.attributes)) {
      Object.defineProperty(this, name, {
        get: () => Slice.select(Slice.selectors[name]),
        set: (payload) => Slice.dispatch(Slice.actions[name](payload)),
      });
    }
  }
}
