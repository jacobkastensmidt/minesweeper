import React, { Component } from 'react';

// Functions
import { shuffle } from '../utils';

// Components
import Tile from './Tile';

// Styles
import './Board.css';

export default class Board extends Component {
  state = this.generateBoard();

  generateBoard() {
    const height = this.configureHeight();
    const width = this.configureWidth();

    return {
      mineLocations: this.generateMineLocations(height, width),
      height: height,
      width: width
    }
  }

  generateMineLocations(height, width, numberOfMines) {
    numberOfMines = numberOfMines || this.determineNumberOfMines(height, width);
    let mineLocations = Array(height * width);

    // Fill the array with 'true' for the number of mine, and false thereafter
    for (let i = 0; i < mineLocations.length; i++) {
      mineLocations[i] = (i < numberOfMines) ? true : false;
    }
    // Shuffle the mine locations randomly
    mineLocations = shuffle(mineLocations);
    return mineLocations;
  }

	determineNumberOfMines(height, width) {
		const max = (height - 1) * (width - 1);
		const min = (height > width) ? height : width;
		let threeRandom = Array.from(Array(3), (value, key) => Math.random() * (max - min) + min);
		return Math.floor(threeRandom.reduce(
      (accumulator, current) => accumulator + current,
      0)
      / threeRandom.length
    );
  }
  
  getBoardDimensions() {
    let {boardHeight, boardWidth} = this.props;
    boardHeight = boardHeight || boardWidth;
    boardWidth = boardWidth || boardHeight;
    return { height: boardHeight, width: boardWidth };
  }

  configureHeight() {
    let {height, width} = this.props;
    height = height || width;
    return height;
  }

  configureWidth() {
    let {height, width} = this.props;
    width = width || height;
    return width;
  }

	render() {
    this.getBoardDimensions();
		const boardGridStyle = {
			'gridTemplateColumns': `repeat(${this.state.width}, auto)`
		};

		return (
			<div className="Board">
				<div className="BoardGrid" style={boardGridStyle}>
					{this.state.mineLocations.map((isBomb, index) => {
						return <Tile key={index} isBomb={isBomb}  />
					})}
				</div>
			</div>
		)
	}
}
