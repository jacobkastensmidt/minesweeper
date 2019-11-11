import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBomb, faFlag } from '@fortawesome/free-solid-svg-icons'
import './Tile.css';

const symbols = {
  mine: faBomb,
  flag: faFlag,
  blank: null
};

/**
 * Renders a number, bomb symbol, or flag symbol.
 * 
 * @param {object} props
 * 
 * @returns {(null|string)} HTML markup for the component.
 */
function Symbol(props) {
  const {isRevealed, isFlagged, isMine, numberOfAdjacentMines} = props;
  const style = {
    position: 'absolute',
    width: '100%',
    height: '100%'
  };

  let symbol = symbols.blank;
  if (isRevealed && isMine) {
    symbol = symbols.mine;
  } else if (!isRevealed && isFlagged) {
    symbol = symbols.flag;
  }

  if (symbol) {
    return <FontAwesomeIcon icon={symbol} style={style} viewBox="-200 -200 912 912"/>;
  }
  if (isRevealed && numberOfAdjacentMines > 0) {
    return (
      <svg viewBox="-20 -85 100 100" xmlns="http://www.w3.org/2000/svg" style={style}>
        <text fontSize="100">{numberOfAdjacentMines}</text>
      </svg>
    );
  }
  return null;
}

export default function Tile (props) {
  const {tileData, handleClick, handleContextMenu} = props;
  const {isRevealed, isFlagged, isMine, numberOfAdjacentMines} = tileData;
  return (
    <button
      className={`Tile${(isRevealed) ? ' depressed' : ''}`}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      type="button"
    >
      <Symbol
        isRevealed={isRevealed}
        isFlagged={isFlagged}
        isMine={isMine}
        numberOfAdjacentMines={numberOfAdjacentMines}
      />
    </button>
  );
}
