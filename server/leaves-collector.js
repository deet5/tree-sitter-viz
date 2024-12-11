const common = require('./common');
const NodeProperty = require('./node-property');

class LeavesCollector {
  /**
   * Collects the leaves (terminal nodes) of the AST and stores them in the `leaves` list.
   * Implements a Visitor pattern.
   */
  constructor() {
    this.leaves = [];
  }

  visit(node) {
    // Skip comment nodes
    if (this.isComment(node)) {
      return;
    }

    // Set node's child_id
    common.nodeIdManager.setNodeData(node, this.getChildId(node));

    // Check if node is a leaf
    const isLeaf = !this.hasChild(node) && !this.isComment(node);
    if (isLeaf) {
      const nodeStr = node.text;
      if (nodeStr && nodeStr !== 'null') {
          if (!/[^a-zA-Z0-9]/.test(node.text)) {
            this.leaves.push(node);
        }
      }
    }

    // Set node properties
    common.nodePropertyManager.setNodeData(node, new NodeProperty(node, isLeaf));

    // Recursively visit children
    for (const child of node.children) {
      this.visit(child);
    }
  }


  // Checks if a node has children.
  hasChild(node) {
    return node.children && node.children.length > 0;
  }


  // Gets the child_id of a given node.
  getChildId(node) {
    if (!node.parent) {
      return null; // Root node has no child_id
    }
    return node.parent.children.indexOf(node);
  }


  //  Determines if a node is a comment node.
  //  Considers single-line and multi-line comments.
  isComment(node) {
    return node.type === 'line_comment' || node.type === 'block_comment';
  }

  // Returns the collected leaves.
  getLeaves() {
    return this.leaves;
  }
}

module.exports = LeavesCollector;
