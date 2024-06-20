import { Attribute } from "./attribute.js";

export class Schema {
  constructor(config) {
    this.config = { ...config };
    this.addId();
    this.addTimestamps();
    this.attributes = Object.entries(this.config).map(
      ([name, { type, default: defaultValue }]) =>
        new Attribute(name, type, defaultValue)
    );
  }

  addId() {
    this.config["id"] = { type: String };
  }

  addTimestamps() {
    this.config["createdAt"] = { type: Date };
    this.config["updatedAt"] = { type: Date };
  }

  get names() {
    return Object.keys(this.config);
  }

  fill(values) {
    return { ...this.defaults, ...values };
  }

  get defaults() {
    let defaults = {};
    for (const name of this.names) {
      defaults[name] = this.config[name].default ?? null;
    }
    return defaults;
  }

  serialize(values) {
    const object = {};
    for (const attribute of this.attributes) {
      const name = attribute.name;
      object[name] = attribute.serialize(values[name]);
    }
    return object;
  }

  deserialize(values) {
    const object = {};
    for (const attribute of this.attributes) {
      const name = attribute.name;
      object[name] = attribute.deserialize(values[name]);
    }
    return object;
  }
}
