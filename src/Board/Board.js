import React, { Component } from 'react';
import Tile from './Tile';
import './Board.css';

export default class Board extends Component {
    render() {
        const {boardWidth} = this.props;
        let {boardHeight} = this.props;
        boardHeight = boardHeight||boardWidth;
        const boardSize = Array.from(new Array(boardWidth * boardHeight), (val,index)=>index);
        const boardGridStyle = {
            'gridTemplateColumns': `repeat(${boardWidth}, auto)`
        };

        return (
            <div className="Board">
                <div className="BoardGrid" style={boardGridStyle}>
                    {boardSize.map((value, index) => {
                        return <Tile key={value} boardWidth={boardWidth} />
                    })}
                </div>
            </div>
        )
    }
}
