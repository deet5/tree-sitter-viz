const common = require('./common');

class AstPath {
    constructor(source, target, path) {
      this.source = source;
      this.target = target;
      this.path = path;
      this.hashedPath = AstPath.hashPath(path); // Use the updated method
    }
  
    static hashPath(path) {
      if (typeof path !== "string" || !path) {
        throw new TypeError('Invalid "path" argument. It must be a non-empty string.');
      }
  
      const crypto = require('crypto'); // Ensure crypto is imported
      return crypto.createHash('sha256').update(path, 'utf8').digest('hex');
    }
  
    static setNoHash() {
      this.hashPath = (x) => x; // Replace the hashPath function with a no-op
    }
  
    toString() {
      return `${common.nodePropertyManager.getNodeData(this.source).normalizedName},` +
             `${this.path},` +
             `${common.nodePropertyManager.getNodeData(this.target).normalizedName}`;
    }
  
    getHashedPath() {
      return this.hashedPath;
    }
  }
  
module.exports = AstPath;
