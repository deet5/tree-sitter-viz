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

//save the tree to a file 
const fs = require('fs');
fs.writeFileSync('ast.json', JSON.stringify(ast, null, 2));
