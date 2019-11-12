// React
import React, { Component } from 'react';

// Functions
import {
  adjacent,
  generateTileData,
  countAdjacentMines,
  getTranslatedTileIndex,
  flagTile
} from '../../helpers/Board';

// Components
import Tile from './Tile';

// Styles
import './Board.css';

export default class Board extends Component {
  // Define tile translations for checking surrounding tiles.

  constructor(props) {
    super(props);
    this.state = this.generateBoard();

    // Bind functions passed as props
    this.handleTileClick = this.handleTileClick.bind(this);
    this.handleTileContextMenu = this.handleTileContextMenu.bind(this);
  }

  /**
   * Get an array of indices surrounding a tile.
   *
   * @param {number} index
   *
   * @returns {Array}
   */
  getAdjacentIndices(index) {
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
  configureHeight() {
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
  configureWidth() {
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
  generateBoard() {
    const height = this.configureHeight();
    const width = this.configureWidth();
    const { customNumberOfMines } = this.props;
    const { tileData, numberOfMines } = generateTileData(height, width, customNumberOfMines);
    countAdjacentMines(tileData, height, width);

    return {
      tileData,
      numberOfMines,
      height,
      width
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
  revealTiles(tileData, index) {
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

  checkForWin() {
    const { tileData, numberOfMines } = this.state;
    const numberOfRevealedTiles = tileData.reduce((numberOfTiles, currentTile) => {
      return currentTile.isRevealed ? numberOfTiles + 1 : numberOfTiles;
    }, 0);
    return tileData.length - numberOfRevealedTiles === numberOfMines;
  }

  /**
   * Update state with revealed tiles based on clicked tile.
   *
   * @param {number} index
   */
  handleTileClick(tile, index) {
    const { isGameover, triggerGameover } = this.props;
    const { tileData } = this.state;
    return () => {
      if (!isGameover) {
        if (!tile.isFlagged) {
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

  handleTileContextMenu(index) {
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

  render() {
    const { tileData, width } = this.state;
    const boardGridStyle = {
      'gridTemplateColumns': `repeat(${width}, auto)`
    };
    return (
      <div className="Board">
        <div className="Board-grid" style={boardGridStyle}>
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
