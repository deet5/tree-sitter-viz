/* eslint-disable react/prop-types */
import TreeChart from './TreeChart'

function Button({ text }) {
  return (
    <button>{text}</button>
  )
}

function CodeArea({ defaultCode }) {
  return (
    <textarea defaultValue={defaultCode} />
  )
}

const defaultCode = `public class Main {
  public static void main(String[] args) {
    Integer a = 5;
    Integer b = 10;
    Integer c = a + b;
  }
}`;

// Sample data for the tree
const data = 
{
  "name": "local_variable_declaration",
  "text": "Integer a = 5;",
  "normalizedName": "Integer a = 5;",
  "children": [
    {
      "name": "integral_type",
      "text": "Integer",
      "normalizedName": "integer",
      "children": [
        {
          "name": "Integer",
          "children": []
        }
      ]
    },
    {
      "name": "variable_declarator",
      "text": "a = 5",
      "normalizedName": "a = 5",
      "children": [
        {
          "name": "identifier",
          "text": "a",
          "normalizedName": "a",
          "children": [
            {
              "name": "a",
              "children": []
            }
          ]
        },
        {
          "name": "decimal_integer_literal",
          "text": "5",
          "normalizedName": "|",
          "children": [
            {
              "name": "5",
              "children": []
            }
          ]
        }
      ]
    }
  ]
};

function App() {

  return (
    <>
      <div>
        <Button text="AST"/>
        <CodeArea defaultCode={defaultCode}/>
      </div>
      <div>
        <TreeChart data={data}/>
      </div>
    </>
  )
}

export default App
