import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBomb, faFlag } from '@fortawesome/free-solid-svg-icons'
import './Tile.css';

const symbols = {
  mine: faBomb,
  flag: faFlag,
  blank: null
};

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

  const viewBoxDimensions = "-200 -200 912 912";
  if (symbol && ((isFlagged && !isRevealed) || (isMine && isRevealed))) {
    return <FontAwesomeIcon icon={symbol} style={style} viewBox={viewBoxDimensions}/>;
  } else if (!isMine && isRevealed && numberOfAdjacentMines > 0) {
    return (
      <svg viewBox="-20 -85 100 100" xmlns="http://www.w3.org/2000/svg" style={style}>
        <text fontSize="100">{numberOfAdjacentMines}</text>
      </svg>
    )
  }
  return null;
}

export default class Tile extends Component {
  state = {
    isBlank: this.props.tileData.isBlank,
    isMine: this.props.tileData.isMine,
    isFlagged: false,
    numberOfAdjacentMines: this.props.tileData.numberOfAdjacentMines
  };
    
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
