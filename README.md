# Phase 2
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
## Implementation 

### Server
- Added `path-extractor.js` that follows the project requirements. 
- For convenience a test suite is avalable in `path.test.js`. You can run `npm test` from the `/server` directory to see the results. 

### Client

Client is now fully functional. First start the sever from `/server` directory by running `npm start`. Then navige to the `/client` directory and run `npm run dev`. Go to [text](http://localhost:5173/) and you can see a window where you can enter code and see the corresponding AST. Change the code to see different tree outputs. 
