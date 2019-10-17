import React from 'react';
import './App.css';

import Board from './Board/Board';

function App() {
  const boardWidth = 10;
  return (
    <div className="App">
      <Board boardWidth={boardWidth} />
    </div>
  );
}

export default App;
