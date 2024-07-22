import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

export function createEntitySelectors(selectSlice, klass) {
  const adapter = createEntityAdapter();
  const selectors = adapter.getSelectors(selectSlice);

  const all = createSelector(
    selectors.selectIds,
    selectors.selectEntities,
    (ids, entities) => {
      return ids.map((id) => new klass(entities[id]));
    }
  );

  return {
    all,
    find: (id) => (s) => selectors.selectById(s, id),
    ids: selectors.selectIds,
    entities: selectors.selectEntities,
    count: (state) => selectors.selectIds(state).length,
  };
}
