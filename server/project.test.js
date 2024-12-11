const fomattedTree = require('./parser');
const PathExtractor = require('./path-extractor');
const PathExtractorTwo = require('./path-extractor2');
const Parser = require('tree-sitter');
const Java = require('tree-sitter-java');
const FunctionVisitor = require('./function-visitor');

describe('PathExtractor Tests', () => {
    let ast;
    let node2Find;

    beforeEach(() => {
        const code = `
            public class Example {
                // This is a comment
                public void method(Object source, Object target) {
                    int a = 0; // another comment
                    int b = 1;
                    a = b;
                    int[] arr = { 1, 2, 3 };
                    b = arr[a];
                    if (a > 0) {
                        System.out.println("Hello");
                    }
                    for (Object elem : this.elements) {
                        if (elem.equals(target)) {
                            return true;
                        }
                    }
                }
            }
        `;
        ast = fomattedTree(code);
        node2Find = new PathExtractorTwo(ast); // Create a fresh instance for each test
    });

    test('test 2 siblings path extraction', () => {
        const source = {
            name: 'void_type',
            text: 'void',
            children: [],
            childId: 1,
        };

        const target = {
            name: 'identifier',
            text: 'method',
            children: [],
            childId: 2,
        };

        expect(node2Find.extractPath(source, target)).toBe('(void_type1)^(method_declaration)_(identifier2)');
    });

    test('MaxPathWidth is greater than 2', () => {
        const source = {
            name: 'public',
            text: 'public',
            children: [],
            childId: 0,
        };

        const target = {
            name: 'identifier',
            text: 'method',
            children: [],
            childId: 2,
        };

        expect(node2Find.extractPath(source, target)).toBe('The path width exceeds MaxPathWidth=2.');
    });

    test('MaxPathLength is greater than 8', () => {
        const source = {
            name: 'return',
            text: 'return',
            children: [],
            childId: 0,
        };

        const target = {
            name: 'identifier',
            text: 'arr',
            children: [],
            childId: 0,
        };

        expect(node2Find.extractPath(source, target)).toBe('The path length exceeds MaxPathLength=8.');
    });

    test('test path length 4', () => {
        const source = {
            name: 'identifier',
            text: 'source',
            children: [],
            childId: 1,
        };

        const target = {
            name: 'identifier',
            text: 'target',
            children: [],
            childId: 1,
        };

        expect(node2Find.extractPath(source, target)).toBe('(identifier1)^(formal_parameter)^(formal_parameters)_(formal_parameter)_(identifier1)');
    });

    test('test path length 6', () => {
        const source = {
            name: 'identifier',
            text: 'a',
            children: [],
            childId: 0,
        };

        const target = {
            name: 'identifier',
            text: 'b',
            children: [],
            childId: 0,
        };

        expect(node2Find.extractPath(source, target)).toBe('(identifier0)^(variable_declarator)^(local_variable_declaration)^(block)_(local_variable_declaration)_(variable_declarator)_(identifier0)');
    });
});

describe('FunctionVisitor Tests', () => {
  test('test FunctionVisitor', () => {
      const parser = new Parser();
      parser.setLanguage(Java);

      const code = `
          class Example {
              void methodOne() {
                  // some code
              }
              
              int methodTwo(int a) {
                  return a + 1;
              }
          }
      `;

      const tree = parser.parse(code);
      const rootNode = tree.rootNode;

      const visitor = new FunctionVisitor();
      visitor.visit(rootNode);

      const methods = visitor.getMethods();
      expect(methods.length).toBe(2);
      expect(methods[0].methodName).toBe('methodOne');
      expect(methods[0].methodLength).toBe(1);
      expect(methods[1].methodName).toBe('methodTwo');
      expect(methods[1].methodLength).toBe(2);
      expect(methods[0].leaves[0].text).toBe('void');
      expect(methods[1].leaves[0].text).toBe('int');
  });
});
