import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpots } from "../../store/spots";
import SpotCard from "../SpotCard";
import "./Home.css";

const Home = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getAllSpots());
  }, [dispatch]);

  const spotsList = useSelector((state) => state.spots);

  const spots = spotsList.Spots;
  // const normalizedSpots = {}; 
  // spots.forEach(spot => normalizedSpots[spot.id] = spot);
  // const allSpots = Object.values(normalizedSpots);

  if (!spots) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="home">
      <h2 className="title">Welcome, Search for your next holiday escape</h2>
      <ul className="spots-container">
        <SpotCard spots={spots}/>
      </ul>
    </div>
  );
};

export default Home;
