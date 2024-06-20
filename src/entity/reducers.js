import { createEntityAdapter } from "@reduxjs/toolkit";

export function createEntityReducers() {
  const adapter = createEntityAdapter();
  return {
    sync: (state, action) => {
      adapter.setAll(state, action.payload);
    },
    create: (state, action) => {
      if (Array.isArray(action.payload)) {
        adapter.addMany(state, action.payload);
      } else {
        adapter.addOne(state, action.payload);
      }
    },
    update: (state, action) => {
      if (Array.isArray(action.payload)) {
        adapter.updateMany(state, action.payload);
      } else {
        adapter.updateOne(state, action.payload);
      }
    },
    upsert: (state, action) => {
      if (Array.isArray(action.payload)) {
        adapter.upsertMany(state, action.payload);
      } else {
        adapter.upsertOne(state, action.payload);
      }
    },
    delete: (state, action) => {
      if (Array.isArray(action.payload)) {
        adapter.removeMany(state, action.payload.map(getId));
      } else {
        adapter.removeOne(state, getId(action.payload));
      }
    },
    deleteAll: (state) => {
      adapter.removeAll(state);
    },
  };
}
