import React from 'react'
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core'

export default function DifficultyButton(props) {
  const { width, height, numberOfMines, text } = props;
  return (
    <div>
      <Link to={{
        pathname: "/game",
        gameProps: {
          width: width,
          height: height,
          customNumberOfMines: numberOfMines
        }
      }}>
        <Button variant="outlined" size="small">
          {text}
        </Button>
      </Link>
    </div>
  )
}
