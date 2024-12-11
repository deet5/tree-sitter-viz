const fomattedTree = require('./parser');
const PathExtractor = require('./path-extractor');

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

const ast = fomattedTree(code);

//save the tree to a file 
const fs = require('fs');
fs.writeFileSync('ast.json', JSON.stringify(ast, null, 2));