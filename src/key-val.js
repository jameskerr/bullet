import { createSlice } from "@reduxjs/toolkit";
import { createKeyValReducers } from "./key-val/reducers.js";
import { createKeyValSelectors } from "./key-val/selectors.js";
import { camelCase } from "lodash-es";

export class KeyVal {
  static store = null;
  static useSelector = null;

  constructor(config = {}) {
    this.sliceName = config.name;
    this.attributes = config.attributes;
    for (const name of Object.keys(this.attributes)) {
      // Create the getters and setters
      Object.defineProperty(this, name, {
        get: () => this.select(this.selectors[name]),
        set: (payload) => this.dispatch(this.actions[name](payload)),
      });

      // Create the selectors
      Object.defineProperty(this, camelCase("select_" + name), {
        get: () => this.selectors[name],
      });

      // Create the react hooks
      Object.defineProperty(this, camelCase("use_" + name), {
        get: () => {
          if (this.constructor.useSelector) {
            return this.constructor.useSelector(this.selectors[name]);
          } else {
            throw new Error(
              "You must define useSelector on the KeyVal class to 'use' these methods"
            );
          }
        },
      });
    }
  }

  get store() {
    return this.constructor.store;
  }

  dispatch(action) {
    return this.store.dispatch(action);
  }

  select(selector) {
    return selector(this.store.getState());
  }

  selectSlice(state) {
    return state[this.sliceName];
  }

  get initialState() {
    return { ...this.attributes };
  }

  get reduxSlice() {
    return createSlice({
      initialState: this.initialState,
      name: this.sliceName,
      reducers: createKeyValReducers(this.attributes),
    });
  }

  get reducer() {
    return this.reduxSlice.reducer;
  }

  get slice() {
    return { [this.sliceName]: this.reducer };
  }

  get actions() {
    return this.reduxSlice.actions;
  }

  get selectors() {
    return createKeyValSelectors(this.selectSlice.bind(this), this.attributes);
  }

  get state() {
    return this.select(this.selectSlice.bind(this));
  }
}
