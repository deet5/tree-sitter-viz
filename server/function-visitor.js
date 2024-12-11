const LeavesCollector = require('./leaves-collector');
const MethodContents = require('./common').MethodContents;
const common = require('./common');

class FunctionVisitor {
  constructor() {
    this.methods = [];
  }

  visit(programNode) {
    for (const child of programNode.children) {
      if (child.type === "method_declaration") {
        this.visitMethod(child);
      }

      // Recursively visit the children of the current node
      this.visit(child);
    }
  }


  visitMethod(methodDeclarationNode) {
    const leavesCollector = new LeavesCollector();
    leavesCollector.visit(methodDeclarationNode);

    const leaves = leavesCollector.getLeaves();

    // npm tree-sitter does not have a .child_by_field_name method
    const methodName = methodDeclarationNode.children.find(child => child.type === 'identifier').text;

    const methodLength = this.getMethodLength(methodDeclarationNode);

    this.methods.push(new MethodContents(leaves, methodName, methodLength));
  }

  getMethods() {
    return this.methods;
  }

  getMethodLength(methodDeclarationNode) {
    const methodCode = methodDeclarationNode.text;
    const cleanCode = methodCode.replace(/\r\n/g, '\n').replace(/\t/g, ' ');

    if (!cleanCode.trim()) {
      return 0;
    }

    const lines = cleanCode.split('\n');
    const codeLength = lines.filter(line => {
      const trimmed = line.trim();
      return (
        trimmed &&
        !['{', '}'].includes(trimmed) && 
        !trimmed.startsWith('/') && 
        !trimmed.startsWith('*')
      );
    }).length;

    return codeLength;
  }
}

module.exports = FunctionVisitor;
