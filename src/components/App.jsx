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

  triggerGameover = (victory) => {
    this.setState({
      isGameover: true,
      isWin: victory
    });
  }

  render = () => {
    const { width, customNumberOfMines, isGameover, isWin } = this.state;
    const gameOverMessage = isWin ? "You win!" : "You lose!";
    const displayGameover = isGameover ? "flex-center" : "hide";
    return (
      <div className="App">
        <div id="info-bar">Number of remaining flags: </div>
        <div className="flex-center">
          <section id="gameboard">
            <div id="board-overlay" className={displayGameover}>
              <div id="gameover-prompt">
                <div id="game-over-message">{gameOverMessage}</div>
                <div className="button-group">
                  <button type="button">Play again?</button>
                  <button type="button">Options</button>
                </div>
              </div>
            </div>
            <Board
              width={width}
              customNumberOfMines={customNumberOfMines}
              triggerGameover={this.triggerGameover}
              isGameover={isGameover}
            />
          </section>
        </div>
      </div>
    );
  }
}
