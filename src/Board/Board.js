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
    const {tileData, numberOfMines} = this.generateTileData(height, width, this.props.numberOfMines);
    this.countAdjacentMines(tileData, height, width);

    return {
      tileData: tileData,
      numberOfFlags:numberOfMines,
      height: height,
      width: width
    }
  }

  generateTileData(height, width, numberOfMines) {
    numberOfMines = numberOfMines || this.determineNumberOfMines(height, width);
    let tileData = Array(height * width);

    // Fill the array with an object denoting isMine as 'true' for the first numberOfMines, and 'false' thereafter
    for (let i = 0; i < tileData.length; i++) {
      tileData[i] = { numberOfAdjacentMines: 0 }
      const isMine = (i < numberOfMines);
      tileData[i].isMine = (isMine) ? true : false;
    }
    // Shuffle the mine locations randomly
    tileData = shuffle(tileData);
    return {
      tileData: tileData,
      numberOfMines: numberOfMines
    }
  }

  countAdjacentMines(tileData, height, width) {
    const adjacent = [ [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1] ];
    tileData.forEach((tile, index) => {
      if (tile.isMine){
        const row = Math.floor(index / height);
        const column = index % height;
        adjacent.forEach(coordinates => {
          if (this.tileWithinBoard([row, column], coordinates, height, width)) {
            tileData[(row * height) + (coordinates[0] * height) + column + coordinates[1]].numberOfAdjacentMines++;
          }
        });
      }
    }); 
  }

  tileWithinBoard(current, tileDirection, height, width) {
    if (
      (current[0] + tileDirection[0] >= 0) &&
      (current[0] + tileDirection[0] < height) &&
      (current[1] + tileDirection[1] >= 0) &&
      (current[1] + tileDirection[1] < width)
    ) {
      return true;
    } else {
      return false;
    }
  }

	determineNumberOfMines(height, width) {
    const numberOfTiles = height * width;
    const maxPercentage = .22;
    const minePercentage = maxPercentage - 1 / Math.sqrt(numberOfTiles);
    console.log(minePercentage);
		return Math.floor(minePercentage * numberOfTiles);
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
		const boardGridStyle = {
			'gridTemplateColumns': `repeat(${this.state.width}, auto)`
		};
    console.log(this.state.height + " " + this.state.width + " " + this.state.numberOfFlags);
		return (
			<div className="Board">
				<div className="BoardGrid" style={boardGridStyle}>
					{this.state.tileData.map((tile, index) => {
						return <Tile key={index} tileData={tile} />
					})}
				</div>
			</div>
		)
	}
}
