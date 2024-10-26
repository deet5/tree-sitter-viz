# Phase 1
## Prerequisites
- Make sure you have **Node.js** and **npm** installed.  
  You can download Node.js from [here](https://nodejs.org).
## Installation
1. Clone the repository
```
git clone https://github.com/deet5/tree-sitter-viz.git
```
2. Naviagte to the project folder
```
cd ./path/to/tree-sitter-viz
```
3. cd to the server folder and install required packages
```
npm install
```
4. cd to the client folder and install required packages 
```
npm install
```
## Description 
Since the web-tree-sitter doesn't have grammar package for Java, the only way to parse the Java language is using the backend version of the tree-sitter parser. Therefore, there are two folders: one for the server and one for the client.

The server parses the string and outputs a file in JSON format that represents AST. The client for now has a hardcoded JSON format data structure and uses it to display the tree in the browser.

For now there is no set up API communication between the server and the client. Coming soon.

### Server
I used the code from the project and implemented all the classes and their methods from the template. There are 3 files: `common.js`, `node-property.js`, and `parser.js`. 

`common.js` implements the functions from the `common.py` to process the strings. `node-property.js` implements a class to track the node's attributes and modify the original tree. 

`parser.js` implements a tree builder (similar to leaves collector in the project description). It builds a tree removing the nodes with brackets and semicolumns. It also appends nodes with `node.text` for the visualization purposes. 

To run the program use `node parser.js`. It will save the tree into the tree.json file where you can inspect the tree structure. It will also be the tree sent to the client. You can modify the code in the `parser.js` to see different outputs.

### Client

For now the client only hasa dummy tree to display in the browser. For the client I am using React components, for no obvious reasons. For the tree display I am using D3.js library because it is easy to implement and modify.

To see an example output for the tree in the browser. Navigate to the client folder and run `npm run dev` and then open in the browser `http://localhost:5173/`. You should see an example tree. It is not a final look. 