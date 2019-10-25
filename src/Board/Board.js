import React, { Component } from 'react';

// Functions
import { shuffle } from '../utils';

// Components
import Tile from './Tile';

// Styles
import './Board.css';

export default class Board extends Component {
  static adjacent = [ [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1] ];
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
      tileData[i] = { numberOfAdjacentMines: 0, isRevealed: false }
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
    tileData.forEach((tile, index) => {
      if (tile.isMine){
        const {row, column} = this.getTileRowAndColumn(index, height);
        Board.adjacent.forEach(coordinates => {
          if (this.tileWithinBoard(row, column, coordinates[0], coordinates[1], height, width)) {
            tileData[
              this.getTranslatedTileIndex(
                row,
                column,
                coordinates[0],
                coordinates[1],
                height
              )
            ].numberOfAdjacentMines++;
          }
        });
      }
    }); 
  }

  tileWithinBoard(row, column, yTranslation, xTranslation, height, width) {
    if (
      (row + yTranslation >= 0) &&
      (row + yTranslation < height) &&
      (column + xTranslation >= 0) &&
      (column + xTranslation < width)
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

  getTileRowAndColumn(index, height) {
    const row = Math.floor(index / height);
    const column = index % height;
    return {
      row: row,
      column: column
    };
  }

  getTranslatedTileIndex(row, column, yTranslation, xTranslation, height) {
    return (row * height) + (yTranslation * height) + column + xTranslation;
  }

  getAdjacentIndexes = (index) => {
    const height = this.state.height;
    const {row, column} = this.getTileRowAndColumn(index, height);
    return Board.adjacent.map((coordinate) => {
      if(this.tileWithinBoard(row, column, coordinate[0], coordinate[1], height, this.state.width)) {
        return this.getTranslatedTileIndex(row, column, coordinate[0], coordinate[1], height);
      }
    });
  }

  revealTiles(tileData, index) {
    const adjacentIndexes = this.getAdjacentIndexes(index);
    const tile = tileData[index];
    tile.isRevealed = true;
    if(!tile.isMine && tile.numberOfAdjacentMines === 0) {
      adjacentIndexes.forEach((adjacentIndex) => {
        const {row, column} = this.getTileRowAndColumn(adjacentIndex, this.state.height);
        if (this.tileWithinBoard(row, column, 0, 0, this.state.height, this.state.width) && !tileData[adjacentIndex].isRevealed) {
          tileData = this.revealTiles(tileData, adjacentIndex);
        }
      });
    }
    return tileData;
  }

  handleTileClick = (index) => {
    this.setState((state) => {
      let tileData = this.revealTiles(state.tileData, index);
      return {tileData: tileData};
    });
  }

	render() {
		const boardGridStyle = {
			'gridTemplateColumns': `repeat(${this.state.width}, auto)`
		};
		return (
			<div className="Board">
				<div className="BoardGrid" style={boardGridStyle}>
					{this.state.tileData.map((tile, index) => {
						return <Tile key={index} tileData={tile} handleClick={() => this.handleTileClick(index)} />
					})}
				</div>
			</div>
		)
	}
}
