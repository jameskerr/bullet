import { createEntityAdapter } from "@reduxjs/toolkit";

export function createEntitySelectors(selectSlice) {
  const adapter = createEntityAdapter();
  const selectors = adapter.getSelectors(selectSlice);

  return {
    all: selectors.selectAll,
    find: (id) => (s) => selectors.selectById(s, id),
  };
}
