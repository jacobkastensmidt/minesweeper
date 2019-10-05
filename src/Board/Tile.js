import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBomb, faFlag } from '@fortawesome/free-solid-svg-icons'
import './Tile.css';

const symbols = {
    bomb: faBomb,
    flag: faFlag,
    blank: null
};

class Tile extends Component {
    state = {
        isRevealed: false,
        isBomb: true,
        isFlagged: false,
        symbol: null
    }

    handleClick = () => {
        if (!this.state.isRevealed && !this.state.isFlagged) {
            this.setState(
                {isRevealed: true},
                () => {
                    if (this.state.isBomb) {
                        this.setState({symbol: symbols.bomb});
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
        return (
            <div
                className={`Tile${(this.state.isRevealed) ? ' depressed' : ''}`}
                onClick={this.handleClick}
                onContextMenu={this.handleContextMenu}
            >
                {this.state.symbol && ((this.state.isFlagged && !this.state.isRevealed) ||
                    (this.state.isBomb && this.state.isRevealed)) &&
                    <FontAwesomeIcon icon={this.state.symbol} />
                }
            </div>
        );
    }
}

export default Tile;
