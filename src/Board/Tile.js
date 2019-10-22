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
  const {isMine, isFlagged, isRevealed, numberOfAdjacentMines, symbol} = props.tileState;
  const style = {
    position: 'absolute',
    width: '100%',
    height: '100%'
  };
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
    isRevealed: false,
    numberOfAdjacentMines: this.props.tileData.numberOfAdjacentMines,
    symbol: null
  };

  handleClick = () => {
    if (!this.state.isRevealed && !this.state.isFlagged) {
      this.setState(
        {isRevealed: true},
        () => {
          if (this.state.isMine) {
            this.setState({symbol: symbols.mine});
          }
        });
    }
  }
    
  handleContextMenu = (e) => {
      e.preventDefault();
      this.setState(state => {
        return {isFlagged: !state.isFlagged}
      }, () => {
        if(!this.state.isRevealed) {
          if(this.state.isFlagged) {
            this.setState({symbol: symbols.flag});
          } else if (!this.state.isFlagged) {
            this.setState({symbol: symbols.blank});
          }
        }
      });
  }

  render() {
    const {isRevealed} = this.state;
    return (
      <div
        className={`Tile${(isRevealed) ? ' depressed' : ''}`}
        onClick={this.handleClick}
        onContextMenu={this.handleContextMenu}
      >
        <Symbol tileState={this.state} />
      </div>
    );
  }
}
