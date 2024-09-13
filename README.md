# Pierce the Boilerplate

If you've been using Redux & React for any amount of time, you may find yourself writing the same types of reducers over and over again. In my experience, there are **only two types of reducers** that cover 90% of my state needs.

1. The list of things.
2. The key value object.

Bullet provides a high-level API for creating and interfacing with these two types of state structures. The two main exports are the classes: `Entity` and `KeyVal`

## Install

```bash
yarn add bullet
```

Bullet will pull in `@reduxjs/toolkit`.

## Get Started

Let's make an entity. First create a class that extends the `Entity` base class that ships with Bullet. Then define the attributes like the example below. An entity will include the attributes `id`, `createdAt`, and `updatedAt` automatically by default.

```js
import { Entity } from "bullet";

export class Book extends Entity {
  static attributes = {
    title: { type: String, default: "Untitled" },
    pageCount: { type: Number, default: 0 },
    author: { type: String, default: "Unknown" },
  };
}
```

Simply defining this class will create all the redux necessities for a "list of things" slice of state. The actual state shape will look like `{ids: [], entities: {}}` popularized by the Entity Adapter in redux-toolkit.

When you configure your store, you can use the `.slice` property on the `Book` class. This contains an object that looks like this.

```js
Books.slice; // => {books: Book.reducer}
```

By default, the name of the slice is the camelCased, plural class name, but it can be configured using the static `sliceName` attribute.

```js
class Book extends Entity {
  static sliceName = "myBooks"; /* overrides the default "books" */
}
```

Now add your entity slice to the root reducer.

```js
const store = configureStore({
  reducer: combineReducers({
    ...Book.slice,
  }),
});
```

Finally, give the Entity base class a reference to your redux store right after it's created.

```js
import { Entity } from "bullet";

const store = configureStore(/* ... */);

Entity.store = store;
```

I don't know about you, but I got sick of needing to import "dispatch" in every single one of my files. By providing the store to all your entities, you can use a terse, pleasant, high-level API to interact with your state, as you'll see in the next section.

## Entity API

The API mirrors ActiveRecord, the ORM that comes with Ruby on Rails. Here are a few examples.

**Create a New Book**

```js
const book = Book.create({ title: "The Secret Art of React" });
```

You can pass a partial object of the entity's attributes to `Book.create()`. It will save it to the store, and return an instance of the Book class. Getters and setters for all attributes are automatically defined based on the static `attributes` object.

**Get and Set Attributes**

```js
book.title; // "The Secret Art of React"
book.pageCount; // 0
book.attributes; // {id: "1", title: "The Secret Art of React", pageCount: 0, ...}
```

**Update a Book**

You can call `.save()` after mutating an instance.

```js
const book = Book.create({ title: "Pierce the Boilerplate" });
book.pageCount = 4;
book.save(); // Updates the store with the new page count.
```

Or you can call `.update(attrs)` and pass a partial object of attributes to update.

```js
book.update({ author: "JK" }); // Also updates the store.
```

**Initialize a Book**

If you want to instantiate a new book instance without saving it to the store, you can simply `new` one up.

```js
const book = new Book({ title: "React for Dummies" }); // Not saved

book.save(); // But now it's saved and given an id.
```

**Destroy a Book**

Call `.destroy()`

```js
const book = Book.create({ title: "Incriminating Evidence" });
book.destroy(); // Removed from the store
```

**Query for Books**

If you need to get a single book by id, use `.find(id)`. It finds the attribute data in the state slice, then instantiates a new `Book` instance with those attributes.

```js
const book = Book.find("1");
```

If you want all the books, use `.all`

```js
const books = Book.all;
```

If you want to filter the list of books use `.where(filters)`.

```js
const books = Book.where({ pageCount: 99 });
```

The `where` method will only match using strict equality on the attributes' values. This will improve as needs arise.

## React Component Usage

If you wish to use these entities in React and have the component re-render when the state changes, you can "use" these hooks.

```jsx
function LibraryInventory() {
  const everything = Book.useAll;
  const filtered = Book.useWhere({ topic: "Teen Vampire" });
  const single = Book.use("1");
}
```

These `use` hooks utilize `useSelector` from `react-redux`. Instead of Bullet directly depending on it, it will look for that function on the Entity class. So for now you must assign the method to the Entity like you did with the store.

```js
import { useSelector } from "react-redux";
import { Entity } from "bullet";

// To use the selector hooks...
Entity.useSelector = useSelector;
```

## Extending your Entity

You'll likely want to add domain specific methods to your entities. Simply define them on your class. Your entity will inherit helpful methods from the base class like `dispatch(action)` and `select(selector)` that can be used like so.

```js
class Book extends Entities {
  static attributes = {
    authorId: { type: String, default: null },
  };

  burn() {
    // Select some state and dispatch an action.
    const canBurn = this.select(getCanBurn);
    if (canBurn) this.dispatch(burnBook(this.id));
  }

  get author() {
    // Utilize your other entities.
    return Author.find(this.authorId);
  }
}
```

## The KeyVal Reducer

Docs coming at some point.

## Enjoy

You may find that creating these domain models was the missing piece of your react/redux application. In our experience, development velocity has dramatically increased now that reducers, actions, and selectors are all automatically created in the same manner and accessed with a readable, high-level API. Hopefully, you can stop importing useDispatch, drop thunks, and get back to solving your business problems.

**Disclaimer**

This library is brand new. It is being put to use in the Zui application from Brim Data, but there will be feature gaps. The API will change and stabilize over time, so set expectations accordingly.

**Contact**

https://mastodon.social/@jameskerr

https://x.com/specialCaseDev
