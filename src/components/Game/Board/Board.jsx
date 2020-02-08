// React
import React, { Component } from 'react';

// Functions
import {
  adjacent,
  determineNumberOfMines,
  generateTileData,
  countAdjacentMines,
  getTranslatedTileIndex,
  flagTile,
  swapWithBlank,
  clearAdjacentMineCounts,
  matchAspectRatio
} from '../../../helpers/Board';

// Components
import Tile from './Tile';

// Styles
import './Board.css';

export default class Board extends Component {
  // Define tile translations for checking surrounding tiles.

  constructor(props) {
    super(props);
    this.state = this.generateBoard();
  }

  /**
   * Get an array of indices surrounding a tile.
   *
   * @param {number} index
   *
   * @returns {Array}
   */
  getAdjacentIndices = (index) => {
    const { height, width } = this.state;
    return adjacent.map((translation) => {
      const translatedIndex = getTranslatedTileIndex(index, translation, height, width);
      if (translatedIndex !== false) {
        return translatedIndex;
      }
      return null;
    }).filter((adjacentIndex) => adjacentIndex !== null);
  };

  /**
   * Determine height.  Defaults to width if no height prop found.
   *
   * @returns {number}
   */
  configureHeight = () => {
    const { width } = this.props;
    let { height } = this.props;
    height = height || width;
    return height;
  }

  /**
   * Determine width.  Defaults to width if no width prop found.
   *
   * @returns {number}
   */
  configureWidth = () => {
    const { height } = this.props;
    let { width } = this.props;
    width = width || height;
    return width;
  }

  /**
   * Generate board with height * width number of tiles.
   *
   * @returns {object} Object containing generated board state.
   */
  generateBoard = () => {
    let height = this.configureHeight();
    let width = this.configureWidth();
    const adjustedAspect = matchAspectRatio(height, width);
    height = adjustedAspect.height;
    width = adjustedAspect.width;
    let { numberOfMines } = this.props;
    numberOfMines = numberOfMines || determineNumberOfMines(height, width);
    const tileData = generateTileData(height, width, numberOfMines);
    countAdjacentMines(tileData, height, width);

    return {
      tileData,
      numberOfMines,
      height,
      width,
      firstClick: true
    };
  }

  /**
   * Set tiles to revealed recursively.
   *
   * @param {object} tileData
   * @param {number} index
   *
   * @returns {object} Tile data updated with revealed tiles.
   */
  revealTiles = (tileData, index) => {
    const adjacentIndices = this.getAdjacentIndices(index);
    const tile = tileData[index];
    const { height, width } = this.state;
    tile.isRevealed = true;
    if (!tile.isMine && tile.numberOfAdjacentMines === 0) {
      adjacentIndices.forEach((adjacentIndex) => {
        if (getTranslatedTileIndex(adjacentIndex, { x: 0, y: 0 }, height, width) !== false &&
          !tileData[adjacentIndex].isRevealed &&
          !tileData[adjacentIndex].isFlagged
        ) {
          return this.revealTiles(tileData, adjacentIndex);
        }
        return tileData
      });
    }
    return tileData;
  }

  /**
   * Check for a win by checking if all non-bomb tiles have been revealed.
   *
   * @returns {boolean} If a win has been achieved
   */
  checkForWin = () => {
    const { tileData, numberOfMines } = this.state;
    const numberOfRevealedTiles = tileData.reduce((numberOfTiles, currentTile) => {
      return currentTile.isRevealed ? numberOfTiles + 1 : numberOfTiles;
    }, 0);
    return tileData.length - numberOfRevealedTiles === numberOfMines;
  }

  /**
   * Return a function that updates state with revealed tiles based on clicked tile.
   *
   * @param {number} index
   */
  handleTileClick = (tile, index) => {
    const { isGameover, triggerGameover } = this.props;
    const { tileData, firstClick } = this.state;
    return () => {
      if (!isGameover) {
        if (!tile.isFlagged) {
          if (firstClick) {
            if (tile.isMine) {
              const { height, width } = this.state;
              let { updatedTile, updatedTileData } = swapWithBlank(index, tileData);
              updatedTileData = clearAdjacentMineCounts(updatedTileData);
              countAdjacentMines(updatedTileData, height, width);
              this.setState({
                firstClick: false,
                tileData: updatedTileData
              }, () => this.handleTileClick(updatedTile, index)());
            } else {
              this.setState({
                firstClick: false
              }, () => this.handleTileClick(tile, index)());
            }
            return;
          }
          this.setState({
            tileData: this.revealTiles(tileData, index)
          }, () => {
            if (tile.isMine) {
              triggerGameover(false);
            } else if (this.checkForWin()) {
              triggerGameover(true);
            }
          });
        }
      }
    };
  }

  /**
   * Return a function that updates the state for a tile to be flagged
   *
   * @param {number} index
   */
  handleTileContextMenu = (index) => {
    const { isGameover, tileData } = this.state;
    return (e) => {
      e.preventDefault();
      if (!isGameover) {
        this.setState({
          tileData: flagTile(tileData, index)
        });
      }
    }
  }

  render = () => {
    const { tileData, width, height } = this.state;
    const boardGridStyle = {
      'gridTemplateColumns': `repeat(${width}, auto)`
    };
    // Determine board width.  Needed as padding is based on screen width.
    const boardWidth = 75 * (width / height);
    return (
      <div id="Board" style={{ width: `${boardWidth}vh` }} >
        <div id="Board-grid" style={boardGridStyle}>
          {tileData.map((tile, index) => {
            return <Tile
              key={tile.id}
              tileData={tile}
              handleClick={this.handleTileClick(tile, index)}
              handleContextMenu={this.handleTileContextMenu(index)}
            />
          })}
        </div>
      </div>
    )
  }
}
