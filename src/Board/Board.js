import React, { Component } from 'react';
import Tile from './Tile';
import './Board.css';

export default class Board extends Component {
	determineNumberOfMines(height, width) {
		const max = (height - 1) * (width - 1);
		const min = (height > width) ? height : width;
		let threeRandom = Array.from(Array(3), (value, key) => Math.random() * (max - min) + min);
		return Math.floor(threeRandom.reduce(
      (accumulator, current) => accumulator + current,
      0)
      / threeRandom.length
    );
	}

	render() {
		const {boardWidth} = this.props;
		let {boardHeight} = this.props;
		boardHeight = boardHeight||boardWidth;
		const boardSize = Array(boardWidth * boardHeight).fill(false);
		const boardGridStyle = {
			'gridTemplateColumns': `repeat(${boardWidth}, auto)`
		};
		let a = this.determineNumberOfMines(boardHeight, boardWidth);
		console.log(boardHeight + " " + boardWidth + " " + a);

		return (
			<div className="Board">
				<div className="BoardGrid" style={boardGridStyle}>
					{boardSize.map((value, index) => {
						return <Tile key={index} isBomb={true}  />
					})}
				</div>
			</div>
		)
	}
}
