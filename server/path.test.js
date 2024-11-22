const Tree = require('./parser');
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

const ast = Tree(code);

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

    const node2Find = new PathExtractor(ast).extractPath(source, target);
    expect(node2Find).toBe('(void_type1)^(method_declaration)_(identifier2)');
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

    const node2Find1 = new PathExtractor(ast).extractPath(source, target);
    expect(node2Find1).toBe("The path width exceeds MaxPathWidth=2.");
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

  const node2Find2 = new PathExtractor(ast).extractPath(source, target);
  expect(node2Find2).toBe("The path length exceeds MaxPathLength=8.");
});



