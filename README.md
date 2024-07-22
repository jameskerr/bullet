# The only two types of reducers you'll need.

Let's make an entity reducer.

```js
class Book extends Entity {
  static attributes = {
    title: { type: String, default: "Untitled" },
    pageCount: { type: Number, default: 0 },
    author: { type: String, default: "Unknown" },
  };
}

const store = configureStore({
  reducer: combineReducers({
    ...Book.slice,
  }),
});

Entity.store = store;
```
