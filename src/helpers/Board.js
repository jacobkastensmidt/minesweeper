import { shuffle } from '../utils';

export const adjacent = [
  { x: -1, y: -1 },
  { x: -1, y: 0 },
  { x: -1, y: 1 },
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: 1, y: -1 },
  { x: 1, y: 0 },
  { x: 1, y: 1 }
];

/**
 * Based on the height and tile array index, determine the row and column location of the tile.
 *
 * @param {number} index
 * @param {number} height
 * @param {number} width
 */
export const getTileRowAndColumn = (index, width) => {
  const row = Math.floor(index / width);
  const column = index - row * width;
  return { row, column };
};

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
export const getTranslatedTileIndex = (index, translation, height, width) => {
  const { row, column } = getTileRowAndColumn(index, width);
  const newRowLocation = row + translation.y;
  const newColumnLocation = column + translation.x;
  if (newRowLocation >= 0 &&
    newRowLocation < height &&
    newColumnLocation >= 0 &&
    newColumnLocation < width
  ) {
    return newRowLocation * width + newColumnLocation;
  }
  return false;
};

export const clearAdjacentMineCounts = (tileData) => {
  return tileData.map((originalTile) => {
    const tile = { ...originalTile };
    tile.numberOfAdjacentMines = 0;
    return tile;
  });
}

/**
 * Determine the number of mines next to a tile.
 *
 * @param {object} tileData Data on all tiles.
 * @param {number} height
 * @param {number} width
 */
export const countAdjacentMines = (initialTileData, height, width) => {
  const tileData = initialTileData;
  tileData.forEach((tile, index) => {
    if (tile.isMine) {
      adjacent.forEach(translation => {
        const translatedIndex = getTranslatedTileIndex(index, translation, height, width)
        if (translatedIndex !== false) {
          tileData[translatedIndex].numberOfAdjacentMines += 1;
        }
      });
    }
  });
};

/**
 * Determine the number of mines based on a percentile scaline with board size.
 *
 * @param {number} height
 * @param {number} width
 */
export const determineNumberOfMines = (height, width) => {
  const numberOfTiles = height * width;
  const maxPercentage = .22;
  const minePercentage = maxPercentage - 1 / Math.sqrt(numberOfTiles);
  return Math.floor(minePercentage * numberOfTiles);
};

/**
 * Set up default tile data with randomized mine locations.
 *
 * @param {number} height
 * @param {number} width
 * @param {number} numberOfMines
 *
 * @returns {object} Tile data and number of mines.
 */
export const generateTileData = (height, width, numberOfMines = null) => {
  let tileData = Array(height * width);

  // Fill the array with an object denoting isMine as 'true' for the first numberOfMines, and 'false' thereafter
  for (let i = 0; i < tileData.length; i += 1) {
    tileData[i] = { numberOfAdjacentMines: 0, isRevealed: false, isFlagged: false, id: `tile-${i}` }
    tileData[i].isMine = (i < numberOfMines);
  }
  // Shuffle the mine locations randomly
  tileData = shuffle(tileData);
  return tileData;
};

export const flagTile = (tileData, index) => {
  const tile = tileData[index];
  tile.isFlagged = !tile.isFlagged;
  return tileData;
}

export const swapWithBlank = (index, tileData) => {
  const updatedTileData = [...tileData];
  let randomIndex = Math.floor((Math.random() * tileData.length) - 1);
  let updatedTile = updatedTileData[randomIndex];
  while (updatedTile.isMine) {
    randomIndex = (randomIndex + 1) % tileData.length;
    updatedTile = updatedTileData[randomIndex];
  }
  updatedTileData[randomIndex] = tileData[index];
  updatedTileData[index] = tileData[randomIndex];
  return {
    updatedTile,
    updatedTileData
  }
}

export const matchAspectRatio = (height, width) => {
  const aspectRatio = height / width;
  const screenAspectRation = window.innerHeight / window.innerWidth;
  if ((aspectRatio < 1 && screenAspectRation > 1) || (aspectRatio > 1 && screenAspectRation < 1)) {
    return { height: width, width: height };
  }
  return { height, width };
}