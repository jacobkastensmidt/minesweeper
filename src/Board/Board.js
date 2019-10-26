import React, { Component } from 'react';

// Functions
import { shuffle } from '../utils';

// Components
import Tile from './Tile';

// Styles
import './Board.css';

export default class Board extends Component {
  // Define tile translations for checking surrounding tiles.
  static adjacent = [
    {x: -1, y: -1},
    {x: -1, y: 0},
    {x: -1, y: 1},
    {x: 0, y: -1},
    {x: 0, y: 1},
    {x: 1, y: -1},
    {x: 1, y: 0},
    {x: 1, y: 1}
  ];
  state = this.generateBoard();

  /**
   * Generate board with height * width number of tiles.
   * 
   * @returns {object} Object containing generated board state.
   */
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
    };
  }

  /**
   * Set up default tile data with randomized mine locations.
   * 
   * @param {number} height
   * @param {number} width
   * @param {number} numberOfMines
   * 
   * @returns {object} Tile data and number of mines.
   */
  generateTileData(height, width, numberOfMines = null) {
    numberOfMines = numberOfMines || this.determineNumberOfMines(height, width);
    let tileData = Array(height * width);

    // Fill the array with an object denoting isMine as 'true' for the first numberOfMines, and 'false' thereafter
    for (let i = 0; i < tileData.length; i++) {
      tileData[i] = { numberOfAdjacentMines: 0, isRevealed: false }
      tileData[i].isMine = (i < numberOfMines) ? true : false;
    }
    // Shuffle the mine locations randomly
    tileData = shuffle(tileData);
    return {
      tileData: tileData,
      numberOfMines: numberOfMines
    };
  }

  /**
   * Determine the number of mines next to a tile.
   * 
   * @param {object} tileData Data on all tiles.
   * @param {number} height
   * @param {number} width
   */
  countAdjacentMines(tileData, height, width) {
    tileData.forEach((tile, index) => {
      if (tile.isMine){
        Board.adjacent.forEach(translation => {
          const translatedIndex = this.getTranslatedTileIndex(index, translation, height, width)
          if (translatedIndex) {
            tileData[translatedIndex].numberOfAdjacentMines++;
          }
        });
      }
    }); 
  }

  /**
   * Determine the number of mines based on a percentile scaline with board size.
   * 
   * @param {number} height
   * @param {number} width
   */
	determineNumberOfMines(height, width) {
    const numberOfTiles = height * width;
    const maxPercentage = .22;
    const minePercentage = maxPercentage - 1 / Math.sqrt(numberOfTiles);
		return Math.floor(minePercentage * numberOfTiles);
  }

  /**
   * Determine height.  Defaults to width if no height prop found.
   * 
   * @returns {number}
   */
  configureHeight() {
    let {height, width} = this.props;
    height = height || width;
    return height;
  }

  /**
   * Determine width.  Defaults to width if no width prop found.
   * 
   * @returns {number}
   */
  configureWidth() {
    let {height, width} = this.props;
    width = width || height;
    return width;
  }

  /**
   * Based on the height and tile array index, determine the row and column location of the tile.
   * 
   * @param {number} index
   * @param {number} height
   */
  getTileRowAndColumn(index, height) {
    const row = Math.floor(index / height);
    const column = index % height;
    return {
      row: row,
      column: column
    };
  }

  /**
   * Get the new index of a tile after translating it.  If the tile is not in the
   * grid after the translation, 'false' is returned instead.
   * 
   * @param {number} index
   * @param {object} translation X and y values to translate on the game grid.
   * @param {number} height
   * @param {number} width
   * 
   * @returns {(number|bool)}
   */
  getTranslatedTileIndex(index, translation, height, width) {
    const {row, column} = this.getTileRowAndColumn(index, height);
    const newRowLocation = row + translation.y;
    const newColumnLocation = column + translation.x;
    if(newRowLocation >= 0 &&
      newRowLocation < height &&
      newColumnLocation >= 0 &&
      newColumnLocation < width
    ) {
      return newRowLocation * height + newColumnLocation;
    }
    return false;
  }

  /**
   * Get an array of indexes surrounding a tile.
   * 
   * @param {number} index
   * 
   * @returns {Array}
   */
  getAdjacentIndexes = (index) => {
    const {height, width} = this.state.height;
    return Board.adjacent.map((translation) => {
      const translatedIndex = this.getTranslatedTileIndex(index, translation, height, width);
      if(translatedIndex) {
        return translatedIndex;
      }
    });
  }

  /**
   * Set tiles to revealed recursively.
   * 
   * @param {object} tileData
   * @param {number} index
   * 
   * @returns {object} Tile data updated with revealed tiles.
   */
  revealTiles(tileData, index) {
    const adjacentIndexes = this.getAdjacentIndexes(index);
    const tile = tileData[index];
    const {height, width} = this.state;
    tile.isRevealed = true;
    if(!tile.isMine && tile.numberOfAdjacentMines === 0) {
      adjacentIndexes.forEach((adjacentIndex) => {
        if (this.getTranslatedTileIndex(adjacentIndex, {x: 0, y: 0}, height, width) && 
          !tileData[adjacentIndex].isRevealed
        ) {
          tileData = this.revealTiles(tileData, adjacentIndex);
        }
      });
    }
    return tileData;
  }

  /**
   * Update state with revealed tiles based on clicked tile.
   * 
   * @param {number} index
   */
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
