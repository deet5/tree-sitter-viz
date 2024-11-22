/* eslint-disable react/prop-types */
import TreeChart from './TreeChart'
import { useState, useEffect } from 'react'
import CodeEditor from '@uiw/react-textarea-code-editor';

function Button({ text, onClick }) {
  return (
    <button className={text} onClick={onClick}>{text}</button>
  )
}

const defaultCode = `void f(int[] array) {
    boolean swapped = true;
    for (int i = 0; i < array.length && swapped; i++) {
        swapped = false;
        for (int j = 0; j < array.length - 1 - i; j++) {
           if (array[j] > array[j+1]) {
               int temp = array[j];
               array[j] = array[j+1];
               array[j+1]= temp;
               swapped = true;
           }
        }
    }
}`;

function App() {
  const [code, setCode] = useState(defaultCode);
  const [graphData, setGraphData] = useState(null);

  const fetchAST = async (code) => {
    try {
      const response = await fetch('http://localhost:3001/ast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      });
      const data = await response.json();
      setGraphData(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleASTBttnClick = () => {
    fetchAST(code);
  }

  useEffect(() => {
    fetchAST(defaultCode);
  }, []);

  return (
    <>
      <div className="inputContent">
        <Button text="AST" onClick={handleASTBttnClick}/>
        <CodeEditor 
          value={code}
          language="java"
          onChange={(evn) => {
            setCode(evn.target.value);
          }}
          padding={15}
          data-color-mode='light'
          style={{
            backgroundColor: 'white',
            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
            fontSize: 12,
            width: 500,
            height: 250,
            borderRadius: 2,
            overflowY: 'scroll',
          }}
          />
      </div>
      <div>
        <TreeChart className='astTree' data={graphData}/>
      </div>
    </>
  )
}

export default App
