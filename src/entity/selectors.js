import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { memo } from "../utils/memo.js";

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

  const memoAttrs = memo(
    (attrs) => attrs,
    (a, b) => JSON.stringify(a) === JSON.stringify(b)
  );

  const where = createSelector(
    all,
    (_, attrs) => memoAttrs(attrs),
    (all, attrs) => {
      return all.filter((item) => {
        return Object.keys(attrs).every((key) => attrs[key] === item[key]);
      });
    }
  );

  return {
    all,
    where,
    find: (id) => (s) => selectors.selectById(s, id),
    ids: selectors.selectIds,
    entities: selectors.selectEntities,
    count: (state) => selectors.selectIds(state).length,
  };
}
