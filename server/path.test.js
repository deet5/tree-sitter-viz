const fomattedTree = require('./parser');
const PathExtractor = require('./path-extractor');

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

const ast = fomattedTree(code);
const node2Find = new PathExtractor(ast);


test('test 2 siblings path extraction', () => {
    const source = {
      "name": "void_type",
      "text": "void",
      "children": [],
      "childId": 1
    };

    const target = {
      "name": "identifier",
      "text": "method",
      "children": [],
      "childId": 2
    };


    expect(node2Find.extractPath(source, target)).toBe('(void_type1)^(method_declaration)_(identifier2)');
});

test('MaxPathWidth is greater than 2', () => {
    const source = {
      "name": "public",
      "text": "public",
      "children": [],
      "childId": 0
    };

    const target = {
      "name": "identifier",
      "text": "method",
      "children": [],
      "childId": 2
    };

    expect(node2Find.extractPath(source, target)).toBe("The path width exceeds MaxPathWidth=2.");
});

test('MaxPathLength is greater than 8', () => {
  const source = {
    "name": "return",
    "text": "return",
    "children": [],
    "childId": 0
  };

  const target = {
    "name": "identifier",
    "text": "arr",
    "children": [],
    "childId": 0
  };

  expect(node2Find.extractPath(source, target)).toBe("The path length exceeds MaxPathLength=8.");
});

test('test path length 4', () => {
  const source = {
    "name": "identifier",
    "text": "source",
    "children": [],
    "childId": 1
  }

  const target = {
    "name": "identifier",
    "text": "target",
    "children": [],
    "childId": 1
  }

  expect(node2Find.extractPath(source, target)).toBe('(identifier1)^(formal_parameter)^(formal_parameters)_(formal_parameter)_(identifier1)');
});

test('test path length 6', () => {
  const source = {
    "name": "identifier",
    "text": "a",
    "children": [],
    "childId": 0
  }

  const target = {
    "name": "identifier",
    "text": "b",
    "children": [],
    "childId": 0
  }
  
  expect(node2Find.extractPath(source, target)).toBe('(identifier0)^(variable_declarator)^(local_variable_declaration)^(block)_(local_variable_declaration)_(variable_declarator)_(identifier0)');
});
