import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import Game from "./Game/Game";
import Home from './Home/Home';

const App = () => {
  return (
    <Router>
      <Route path="/game" component={Game} />
      <Route exact path="/" component={Home} />
    </Router>
  )
}

export default App;