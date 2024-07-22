import "./test-helper.js";

import { KeyVal } from "../src/key-val.js";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

const MySettings = new KeyVal({
  name: "my_settings",
  attributes: {
    canEmail: true,
    timezone: "UTC",
  },
});

const store = configureStore({
  reducer: combineReducers({
    ...MySettings.slice,
  }),
});

KeyVal.store = store;
KeyVal.useSelector = (thing) => thing;

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

test("using getters and setters", () => {
  MySettings.timezone = "PST";
  assert.equal("PST", MySettings.timezone);
  assert.deepEqual({ canEmail: false, timezone: "PST" }, MySettings.state);
});

test("using a selector", () => {
  assert.equal(false, MySettings.selectCanEmail(store.getState()));
  MySettings.canEmail = true;
  assert.equal(true, MySettings.selectCanEmail(store.getState()));

  const canEmail = MySettings.useCanEmail;
  const timeZone = MySettings.useTimeZone;
});
