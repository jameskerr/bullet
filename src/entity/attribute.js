export class Attribute {
  constructor(name, type, defaultValue) {
    this.name = name;
    this.type = type;
    this.defaultValue = defaultValue;
  }

  serialize(value) {
    if (value === null) return null;

    switch (this.type) {
      case Date:
        return value.toISOString();
      default:
        return value;
    }
  }

  deserialize(value) {
    if (value === null) return null;

    switch (this.type) {
      case Date:
        return new Date(value);
      default:
        return value;
    }
  }
}
