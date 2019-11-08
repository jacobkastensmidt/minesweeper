import React, { Component } from 'react'
import './App.css';

import Board from './Board/Board';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 10,
      customNumberOfMines: 10
    };
  }

  render() {
    const {width, customNumberOfMines} = this.state;
    return (
      <div className="App">
      <Board width={width} customNumberOfMines={customNumberOfMines}/>
    </div>
    );
  }
}
