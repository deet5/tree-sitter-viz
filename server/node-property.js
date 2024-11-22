const { name } = require('tree-sitter-java');
const { splitToSubtokens } = require('./common'); // Importing helper function

const BoxedTypes = {
  Integer: "integral_type",
  Double: "floating_point_type",
  Float: "floating_point_type",
  Long: "integral_type",
  Short: "integral_type",
  Byte: "integral_type",
  Character: "character_type",
  Boolean: "boolean_type"
};

const INTERNAL_SEPARATOR = "|";
const NUMERIC_KEEP_VALUES = new Set(["0", "1", "32", "64"]);
const Max_Label_Length = 8;

class NodeProperty {
  /*  This is a wrapper class for a Tree-sitter node in the AST.
      We maintain some useful user defined properties for each tree-sitter node.

      Abstract type: It abstracts the original node.type. 
      For now we only consider abstracting Java boxed types into primitive types.

      Normalized name: It is the normalized version of the node.text.

      is_leaf: It is a boolean value indicating whether the node is a leaf node or not.

      In the initialization, we also append the operator to the abstract type 
          if the node is a binary, unary or assignment expression.

      For simplicity, if the node is a leaf node, 
          we normalize the name of the node
          1 set the separator to "|" of camel case or snake case names to differentiate the separator used in the AST path.
          2 remove the special characters and whitespaces from the name 
  */

  constructor(node, isLeaf) {
    this.abstractType = node.type;
    this.normalizedName = node.text;
    this.isLeaf = isLeaf;
    this.child_id = 0;

    // Set the abstract type for Java nodes with boxed types.
    if (this.isJavaBoxedType(node)) {
      this.abstractType = this.getPrimitiveType(node);
    }

    var operator = "";
    if (this.isBinaryExpr(node) || this.isUnaryExpr(node) || this.isAssignExpr(node)) {
      // get operator from the text using regex
      operator = node.text.match(/[\+\-\*\/\%\=\&\|\!\^\<\>\?]/g);
      operator = operator ? operator.join("") : "";
    }

    if (operator) {
      this.abstractType += ":" + operator
    }

    if (this.isLeaf) {
      let nameToSplit = node.text;
      const splitNameParts = splitToSubtokens(nameToSplit);
      let nm = splitNameParts.join(INTERNAL_SEPARATOR);

      if (nm) {
        if (this.isNumericLiteral(node) && !NUMERIC_KEEP_VALUES.has(nm)) {
          nm = '<NUM>';
        }
        if (nm.length > Max_Label_Length) {
          nm = nm.substring(0, Max_Label_Length);
        }
        this.normalizedName = nm;
      }
    }
  }

  isJavaBoxedType(node) {
    // Check if the node's type is listed in BoxedTypes.
    return BoxedTypes.hasOwnProperty(node.text);
  }

  getPrimitiveType(node) {
    // Return the primitive type corresponding to the boxed type.
    return BoxedTypes[node.text];
  }

  isBinaryExpr(node) {
    // Return true if the node represents a binary expression.
    return node.type === "binary_expression";
  }

  isUnaryExpr(node) {
    // Return true if the node represents a unary expression.
    return node.type === "unary_expression";
  }

  isAssignExpr(node) {
    // Return true if the node represents an assignment expression.
    return node.type === "assignment_expression";
  }

  isNumericLiteral(node) {
    // Return true if the node is a numeric literal (integer or float).
    return node.type === "integer_literal" || node.type === "float_literal" || node.type === "decimal_integer_literal";
  }

}

module.exports = NodeProperty;
