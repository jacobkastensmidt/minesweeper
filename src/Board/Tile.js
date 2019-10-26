import React, { Component } from 'react';
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
  const {isMine, isFlagged, numberOfAdjacentMines} = props.tileState;
  const isRevealed = props.isRevealed;
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
    return <FontAwesomeIcon icon={symbol} style={style} viewBox={"-200 -200 912 912"}/>;
  } else if (isRevealed && numberOfAdjacentMines > 0) {
    return (
      <svg viewBox="-20 -85 100 100" xmlns="http://www.w3.org/2000/svg" style={style}>
        <text fontSize="100">{numberOfAdjacentMines}</text>
      </svg>
    );
  }
  return null;
}

export default class Tile extends Component {
  state = {
    isMine: this.props.tileData.isMine,
    isFlagged: false,
    numberOfAdjacentMines: this.props.tileData.numberOfAdjacentMines
  };

  /**
   * Flag tile on right click.
   */
  handleContextMenu = (e) => {
    e.preventDefault();
    this.setState(state => {return {isFlagged: !state.isFlagged}});
  }

  render() {
    const {isRevealed} = this.props.tileData;
    return (
      <div
        className={`Tile${(isRevealed) ? ' depressed' : ''}`}
        onClick={this.props.handleClick}
        onContextMenu={this.handleContextMenu}
      >
        <Symbol isRevealed={isRevealed} tileState={this.state} />
      </div>
    );
  }
}
