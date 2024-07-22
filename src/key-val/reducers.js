export function createKeyValReducers(attributes) {
  let actions = {
    set(_state, action) {
      return action.payload;
    },
    merge(state, action) {
      return { ...state, ...action.payload };
    },
  };

  for (const attribute of Object.keys(attributes)) {
    const name = attribute;
    const setter = (state, action) => {
      state[attribute] = action.payload;
    };
    actions[name] = setter;
  }

  return actions;
}
