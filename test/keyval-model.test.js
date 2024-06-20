import "./test-helper.js";

import { KeyValModel } from "../src/keyval-model.js";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

class MySettings extends KeyValModel {
  static attributes = {
    canEmail: true,
    timezone: "UTC",
  };
}

const store = configureStore({
  reducer: combineReducers({
    ...MySettings.slice,
  }),
});

MySettings.store = store;

test("slice name", () => {
  assert.equal(MySettings.sliceName, "my_settings");
});

test("initial state", () => {
  assert.deepEqual(MySettings.initialState, {
    canEmail: true,
    timezone: "UTC",
  });
});

test("set canEmail to false", () => {
  store.dispatch(MySettings.actions.canEmail(false));
  assert.equal(false, MySettings.selectors.canEmail(store.getState()));
});

test("using an instance", () => {
  const settings = MySettings.instance();
  settings.timezone = "PST";
  assert.equal("PST", settings.timezone);
});
