import React, { Component } from 'react'
import { Link } from 'react-router-dom';

import Board from './Board/Board';

import './Game.css';
import '../App.css'

const defaultValues = {
  width: 15,
  height: 13,
  customNumberOfMines: 40
}

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameId: 0,
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

  resetGame = () => {
    const { gameId } = this.state;
    this.setState({
      gameId: gameId + 1,
      isGameover: false,
      isWin: false
    });
  }

  getGameBoardData = () => {
    const { location } = this.props;
    if (location.gameProps) {
      return location.gameProps;
    }
    return defaultValues;
  }

  render = () => {
    const { isGameover, isWin, gameId } = this.state;
    // Grab width, height, and the number of mines from props or set to default values
    const { width, height, customNumberOfMines } = this.getGameBoardData();
    const gameOverMessage = isWin ? "You win!" : "You lose!";
    const displayGameover = isGameover ? "flex-center" : "hide";
    return (
      <div className="center-screen">
        <div>
          <div id="info-bar">Number of remaining flags: </div>
          <div className="flex-center">
            <section id="gameboard">
              <div id="board-overlay" className={displayGameover}>
                <div id="gameover-prompt">
                  <div id="game-over-message">{gameOverMessage}</div>
                  <div className="button-group">
                    <button type="button" onClick={this.resetGame}>Play again?</button>
                    <Link to='/'>
                      <button type="button">Home</button>
                    </Link>
                  </div>
                </div>
              </div>
              <Board
                key={gameId}
                width={width}
                height={height}
                customNumberOfMines={customNumberOfMines}
                triggerGameover={this.triggerGameover}
                isGameover={isGameover}
              />
            </section>
          </div>
        </div>
      </div>
    );
  }
}
