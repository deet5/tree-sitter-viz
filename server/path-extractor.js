const Parser = require('tree-sitter');
const { MethodContents } = require('./common');
const FunctionVisitor = require('./function-visitor');
const AstPathSet = require('./ast-path-set');
const { AstPath } = require('./ast-path');
const common = require('./common');
const Java = require('tree-sitter-java');

const MinCodeLen = 2;
const MaxCodeLen = 1000;
const MaxPathLen = 8;
const MaxPathWidth = 2;
const MaxChildId = Infinity;

const UpSymbol = '^';
const DownSymbol = '_';
const LParen = '(';
const RParen = ')';
const PathSeparator = '';

const ParentTypeToAddChildId = new Set([
  'assignment_expression',
  'array_access',
  'method_invocation',
]);

class PathExtractor {
  constructor() {
    this.parser = new Parser().setLanguage(Java);
  }

  extractPaths(code) {
    const rootNode = this.parseFile(code);

    const functionVisitor = new FunctionVisitor();
    functionVisitor.visit(rootNode);
    const methods = functionVisitor.getMethods();

    return this.extractMethodsPaths(methods);
  }

  parseFile(code) {
    const tree = this.parser.parse(code);
    return tree.rootNode;
  }

  extractMethodsPaths(methods) {
    const methodsPaths = [];

    for (const method of methods) {
      if (
        method.methodLength < MinCodeLen ||
        method.methodLength > MaxCodeLen
      ) {
        continue;
      }

      const pathsOfMethod = this.extractSingleMethodPaths(method);
      if (!pathsOfMethod.isEmpty()) {
        methodsPaths.push(pathsOfMethod);
      }
    }

    return methodsPaths;
  }

  extractSingleMethodPaths(method) {
    const leaves = method.leaves;
    const astPaths = new AstPathSet(method.methodName);
    
    for (let i = 0; i < leaves.length; i++) {
      for (let j = i + 1; j < leaves.length; j++) {
        const path = this.extractPath(leaves[i], leaves[j], PathSeparator);
        if (path) {
          astPaths.addPath(leaves[i], leaves[j], path);
        }
      }
    }

    return astPaths;
  }

  extractPath(source, target, separator) {
    const sourceStack = this.#getPathStack(source);
    const targetStack = this.#getPathStack(target);

    const { lenCommonPrefix, idxSrc, idxTar } = this.#lenCommonPrefix(
      sourceStack,
      targetStack
    );
    
    if (
      idxSrc < 0 ||
      idxTar < 0 ||
      sourceStack.length + targetStack.length - 2 * lenCommonPrefix >
        MaxPathLen
    ) {
      return '';
    }

    const pathWidth =
      this.#getChildId(sourceStack[idxSrc]) -
      this.#getChildId(targetStack[idxTar]);

    if (Math.abs(pathWidth) > MaxPathWidth) {
      return '';
    }

    let path = '';
    const cpIdx = sourceStack.length - lenCommonPrefix;
    for (let i = 0; i < cpIdx; i++) {
      const node = sourceStack[i];
      const childId =
        i === 0 || ParentTypeToAddChildId.has(node.parent.type)
          ? this.#saturateId(this.#getChildId(node))
          : '';
      path += `(${common.nodePropertyManager.getNodeData(node).abstractType}${childId})${UpSymbol}`;
    }

    const commonNode = sourceStack[sourceStack.length - lenCommonPrefix];
    const commonChildId = ParentTypeToAddChildId.has(commonNode.type)
      ? this.#saturateId(this.#getChildId(commonNode))
      : '';
    path += `(${common.nodePropertyManager.getNodeData(commonNode).abstractType}${commonChildId})`;
    
    for (let i = targetStack.length - lenCommonPrefix - 1; i >= 0; i--) {
      const node = targetStack[i];
      const childId =
        i === 0 ||
        ParentTypeToAddChildId.has(node.parent.type)
          ? this.#saturateId(this.#getChildId(node))
          : '';
      path += `${DownSymbol}(${common.nodePropertyManager.getNodeData(node).abstractType}${childId})`;
    }

    // console.log(path);
    return path;
  }

  #getPathStack(node) {
    const stack = [];
    while (node) {
      stack.push(node);
      node = node.parent;
    }
    return stack;
  }

  #lenCommonPrefix(sourceStack, targetStack) {
    let i = sourceStack.length - 1;
    let j = targetStack.length - 1;
    let lenCommonPrefix = 0;

    while (i >= 0 && j >= 0 && sourceStack[i] === targetStack[j]) {
      lenCommonPrefix++;
      i--;
      j--;
    }

    return { lenCommonPrefix, idxSrc: i, idxTar: j };
  }

  #getChildId(node) {
    return common.nodeIdManager.getNodeData(node);
  }

  #saturateId(id) {
    return Math.min(Number(id), MaxChildId);
  }
}

module.exports = PathExtractor;