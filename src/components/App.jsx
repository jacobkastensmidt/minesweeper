import React, { Component } from 'react'
import './App.css';

import Board from './Board/Board';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 10,
      customNumberOfMines: 10,
      isGameover: false,
      isWin: false
    };

    // Bind functions passed as props
    this.triggerGameover = this.triggerGameover.bind(this);
  }

  triggerGameover(victory) {
    this.setState({
      isGameover: true,
      isWin: victory
    });
  }

  render() {
    const {width, customNumberOfMines, isGameover, isWin} = this.state;
    let gameOverMessage = null;
    if (isWin) {
      gameOverMessage = "You win!";
    } else {
      gameOverMessage = "You lose!";
    }
    return (
      <div className="App">
        <div id="info-bar" className="flex-center">
          {isGameover &&
            <span id="game-over-message">{gameOverMessage}</span>
          }
        </div>
        <div className="flex-center">
          <Board
            width={width}
            customNumberOfMines={customNumberOfMines}
            triggerGameover={this.triggerGameover}
            isGameover={isGameover}
          />
        </div>
      </div>
    );
  }
}
