import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";

import Home from "./components/Home";
import Navigation from "./components/Navigation";
import SingleSpot from "./components/SingleSpot";
import SpotsByUser from "./components/SpotsByUser";
import NewSpot from "./components/NewSpot";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <div className="app">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/spots/current">
              <SpotsByUser />
            </Route>
            <Route path="/spots/new">
              <NewSpot />
            </Route>
            <Route path="/spots/:spotId">
              <SingleSpot />
            </Route>
          </Switch>
        </div>
      )}
    </>
  );
}

export default App;
