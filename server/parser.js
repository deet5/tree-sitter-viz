const Parser = require('tree-sitter');
const Java = require('tree-sitter-java');
const NodeProperty = require('./node-property');
const { text } = require('express');

const parser = new Parser();
parser.setLanguage(Java);

class BuildTree {
    constructor(node) {
        this.node = node;
    }

    build() {
        const children = [];

        for (let i = 0; i < this.node.childCount; i++) {
            const child = this.node.child(i);
            const nodeProperty = new NodeProperty(child, child.childCount === 0);
            const childTree = new BuildTree(child).build();
            
            if (child.type.match(/^[a-zA-Z0-9_]/) 
                && child.type != "line_comment" 
                && child.type != "block_comment") {
                children.push({
                    name: nodeProperty.abstractType,
                    text: nodeProperty.normalizedName,
                    children: childTree.children,
                    childId: i
                });
            }
            
        }
        return {
            name: this.node.type,
            text: this.node.text,
            childId: this.node.childId,
            children
        };
    }
}

function treeToJSON(sourceCode) {
    const tree = parser.parse(sourceCode);
    const rootNode = new BuildTree(tree.rootNode).build();
    return rootNode;
}

module.exports = treeToJSON;
