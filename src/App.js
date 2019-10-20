import React from 'react';
import './App.css';

import Board from './Board/Board';

function App() {
  const width = 5;
  return (
    <div className="App">
      <Board width={width} />
    </div>
  );
}

export default App;
