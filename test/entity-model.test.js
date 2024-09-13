import "./test-helper.js";
import { Entity } from "../src/entity.js";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

class Book extends Entity {
  static schema = {
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

test("initialize a book", () => {
  const book = new Book();
  assert.equal("Untitled", book.title);
  book.title = "Tend";
  assert.equal("Tend", book.title);
});

test("create a book", () => {
  const book = Book.create({ title: "Business Book" });
  const found = Book.find(book.id);
  assert.equal("Business Book", found.title);
});

test("timestamps are serialized and deserialized", () => {
  const { id } = Book.create({ title: "my_book" });
  const book = Book.find(id);
  assert.equal(Date, book.createdAt.constructor);
});

test("get all entities", () => {
  const books = Book.all;
  assert.equal(Array, books.constructor);
  assert.equal(Book, books[0].constructor);
});

test("destroy all", () => {
  Book.destroyAll();
  assert.equal(0, Book.count);
});

test("create with id", () => {
  Book.create({ id: "me" });
  assert.equal("me", Book.all[0].id);
});

test("where", () => {
  Book.destroyAll();
  Book.create({ title: "hello", pageCount: 1 });
  Book.create({ title: "hello", pageCount: 2 });
  Book.create({ title: "hello", pageCount: 3 });
  Book.create({ title: "goodbye", pageCount: 3 });

  assert.equal(3, Book.where({ title: "hello" }).length);
  assert.equal(1, Book.where({ title: "goodbye" }).length);
  assert.equal(1, Book.where({ title: "hello", pageCount: 1 }).length);
  assert.equal(2, Book.where({ pageCount: 3 }).length);
});

test("all selectors memoizes results", () => {
  const array = Book.all;
  const array2 = Book.all;

  assert.equal(array, array2);
});

test("does not memoizes if changed", () => {
  const array = Book.all;
  Book.create({ title: "push" });
  const array2 = Book.all;

  assert.notEqual(array, array2);
});

test("destroy one", () => {
  const book = Book.create({ title: "will be gone" });
  book.destroy();
  assert.equal(null, Book.find(book.id));
});

test("using a different sliceName", () => {
  assert.equal("books", Book.getSliceName());

  class Thing extends Entity {
    static sliceName = "$things";
  }

  assert.equal("$things", Thing.getSliceName());
});

test("action prefix", () => {
  class Thing extends Entity {}
  assert.equal("things/create", Thing.actions.create.toString());

  class Thing2 extends Entity {
    static actionPrefix = "$thingys";
  }
  assert.equal("$thingys/create", Thing2.actions.create.toString());
});

test("update", () => {
  const book = Book.create({ title: "Hello" });
  book.update({ title: "Goodbye" });
  assert.equal("Goodbye", Book.find(book.id).title);
});
