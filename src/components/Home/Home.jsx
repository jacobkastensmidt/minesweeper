import React, { useState } from 'react';

import Modal from '../Modal/Modal';
import Customizer from '../Customizer/Customizer';
import DifficultySelector from './DifficultySelector/DifficultySelector';

import './Home.css';
import { Button } from '@material-ui/core';

export default function Home() {
  const [isDisplayed, setIsDisplayed] = useState(false);
  const updateDisplayed = () => setIsDisplayed(!isDisplayed);
  return (
    <div className="center-screen">
      <Modal displayed={isDisplayed} child={Customizer} />
      <div className="text-center">
        <div className="flex-column justify-center">
          <h1 id="title">Minesweeper</h1>
          <section id="difficulty-selection" className="flex-column justify-center">
            <div>
              <p>Select a difficulty:</p>
              <DifficultySelector />
            </div>
            <div>
              <p>Or create a custom game:</p>
              <Button variant="outlined" size="small" onClick={updateDisplayed}>Custom</Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
