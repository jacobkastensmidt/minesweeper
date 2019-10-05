import React, { Component } from 'react';
import './Tile.css';

const symbols = {
    bomb: 'fa-bomb',
    flag: 'fa-flag',
    blank: 'blank'
};

export default class Tile extends Component {
    render() {
        return (
            <div className="Tile">
                <i className={'icon fas ' + symbols.blank}></i>
            </div>
        );
    }
}
