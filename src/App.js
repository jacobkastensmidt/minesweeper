import React from 'react';
import './App.css';

import Board from './Board/Board';

function App() {
  const width = 10;
  return (
    <div className="App">
      <Board width={width} numberOfMines={10}/>
    </div>
  );
}

export default App;
