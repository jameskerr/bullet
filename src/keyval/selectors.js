import { camelCase } from "lodash-es";

export function createKeyValSelectors(getSlice, attributes) {
  let selectors = {
    get: getSlice,
  };

  for (const attribute of Object.keys(attributes)) {
    const name = attribute;
    const selector = (state) => {
      return getSlice(state)[attribute];
    };
    selectors[name] = selector;
  }

  return selectors;
}
