import "./test-helper.js";
import { EntityModel } from "../src/entity-model.js";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

class Book extends EntityModel {
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

EntityModel.store = store;

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
