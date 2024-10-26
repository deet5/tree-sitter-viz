const Parser = require('tree-sitter');
const Java = require('tree-sitter-java');
const NodeProperty = require('./node-property');


const parser = new Parser();
parser.setLanguage(Java);

const sourceCode = 
`//comment
Integer a = 5;`;

const tree = parser.parse(sourceCode);

// build a new tree with NodeProperty
class BuildTree {
    constructor(node) {
        this.node = node;
        this.children = [];
    }

    build() {
        for (let i = 0; i < this.node.childCount; i++) {
            const child = this.node.child(i);
            const nodeProperty = new NodeProperty(child, child.childCount === 0);
            const buildTree = new BuildTree(child).build();
            
            if (child.type.match(/^[a-zA-Z0-9_]/) 
                && child.type != "line_comment" 
                && child.type != "block_comment") {
                this.children.push({
                    name: nodeProperty.abstractType,
                    text: child.text,
                    normalizedName: nodeProperty.normalizedName,
                    children: buildTree.length > 0 ? buildTree : this.addNameChild(child.text)
                });
            }
            
        }
        return this.children;
    }

    addNameChild(parentText) {
        return [
            {
                name: parentText,
                children: []
            }
        ]
    }
}

const rootNode = new BuildTree(tree.rootNode).build();

const fs = require('fs');
const { normalize } = require('path');
fs.writeFileSync('tree.json', JSON.stringify(rootNode, null, 2));
