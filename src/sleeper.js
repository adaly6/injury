import React, { useEffect, useState } from "react";
import { scaleLinear } from "d3-scale";
import injuryData from "./injuries.json";
import playerData from "./players.json";
import "./sleeper.css";

const BODY_PARTS = [ 
  { name: "head", x: 50, y: 20 }, 
  { name: "chest", x: 50, y: 60 }, 
  { name: "stomach", x: 50, y: 90 }, 
  { name: "leftArm", x: 30, y: 60 }, 
  { name: "rightArm", x: 70, y: 60 }, 
  { name: "leftForearm", x: 20, y: 80 }, 
  { name: "rightForearm", x: 80, y: 80 }, 
  { name: "leftHand", x: 10, y: 100 }, 
  { name: "rightHand", x: 90, y: 100 }, 
  { name: "leftThigh", x: 30, y: 120 }, 
  { name: "rightThigh", x: 70, y: 120 }, 
  { name: "leftCalf", x: 20, y: 160 }, 
  { name: "rightCalf", x: 80, y: 160 }, 
  { name: "leftFoot", x: 30, y: 180 }, 
  { name: "rightFoot", x: 70, y: 180 },
];

const InjuryMarker = ({ bodyPart, injury }) => { 
  const colorScale = scaleLinear().domain([1, 12]).range(["yellow", "red"]); 
    if (!injury) return null; 
  const severity = injury.injury1 + injury.injury2; 
  const color = colorScale(severity);
  
  return (
    <circle
      cx={bodyPart.x}
      cy={bodyPart.y}
      r="15"
      fill={color}
      stroke="black"
      strokeWidth="2"
    />
  );
};

const InjuryTab = () => {
  const [playerInjuries, setPlayerInjuries] = useState(injuryData);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const players = playerData;
    const injuries = injuryData;

    const playerInjuries = injuries.reduce((acc, injury) => {
      const player = players.find((p) => p.id[0] === injury.id[0]);
      if (!acc[player.name[0]]) {
        acc[player.name[0]] = [];
      }
      acc[player.name[0]].push(injury);
      return acc;
    }, {});

    setPlayerInjuries(playerInjuries);
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPlayers = Object.entries(playerInjuries)
    .filter(([name]) => name.toLowerCase().includes(searchQuery.toLowerCase()))
    .reduce((acc, [name, injuries]) => {
      acc[name] = injuries;
      return acc;
    }, {});

  return (
    <div className="injury-tab">
      <input
        type="text"
        placeholder="Search player name..."
        value={searchQuery}
        onChange={handleSearch}
      />
      {Object.entries(filteredPlayers).map(([name, injuries]) => (
        <div key={name} className="player-container">
          <svg width="100" height="200">
            {BODY_PARTS.map((bodyPart) => (
              <InjuryMarker
                key={bodyPart.name}
                bodyPart={bodyPart}
                injury={injuries.find((injury) => injury.bodyPart === bodyPart.name)}
              />
            ))}
          </svg>
          <div className="injury-log">
            {injuries.map((injury, index) => (
              <div key={index}>
                {injury.bodyPart} - {injury.practice_status} - {injury.game_status}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const App = () => {
  return (
    <div className="App">
      <h1>NFL Injury Tracker</h1>
      <InjuryTab />
    </div>
  );
};

export default { App, InjuryTab };
