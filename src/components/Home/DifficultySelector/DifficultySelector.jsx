import React from 'react'
import DifficultyButton from './DifficultyButton'

import "../Home.css";

export default function DifficultySelector() {
  return (
    <div className="flex-row justify-center">
      <DifficultyButton width="10" height="10" numberOfMines="10" text="Easy" />
      <DifficultyButton width="15" height="13" numberOfMines="40" text="Medium" />
      <DifficultyButton width="30" height="16" numberOfMines="99" text="Hard" />
    </div>
  )
}
