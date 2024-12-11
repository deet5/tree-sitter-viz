const AstPath = require('./ast-path');

class AstPathSet {
  constructor(name) {
    this.name = name;
    this.paths = []; // Initialize as an empty array
  }

  isEmpty() {
    // Returns true if the paths array is empty
    return this.paths.length === 0;
  }

  addPath(source, target, path) {
    const newPath = new AstPath(source, target, path);
    this.paths.push(newPath); // Append the newPath to the paths array
  }
}

module.exports = AstPathSet;
