import React, { useState } from "react";
import { scaleLinear } from "d3-scale";
import injuryData from "./injuries.json";
import playerData from "./players.json";
import silhouette from './silhouette.png';
import "./sleeper.css";

const injuryToBodyPartMap = [ 
  { name: "Abdomen", x: 100, y: 260 }, 
  { name: "Ankle", x: 72, y: 467 }, 
  { name: "ankle", x: 128, y: 467 }, 
  { name: "Arm", x: 100, y: 180 }, 
  { name: "Back", x: 100, y: 180 }, 
  { name: "Biceps", x: 50, y: 150 }, 
  { name: "Calf", x: 74, y: 420 }, 
  { name: "Chest", x: 100, y: 180 }, 
  { name: "Concussion", x: 100, y: 65 }, 
  { name: "Elbow", x: 10, y: 257 }, 
  { name: "Face", x: 100, y: 65 }, 
  { name: "Finger", x: 176, y: 257 }, 
  { name: "Foot", x: 128, y: 467 }, 
  { name: "Forearm", x: 80, y: 200 }, 
  { name: "Groin", x: 100, y: 300 }, 
  { name: "Hamstring", x: 75, y: 345 }, 
  { name: "Hand", x: 176, y: 257 },
  { name: "Heel", x: 72, y: 467 }, 
  { name: "Hip", x: 100, y: 180 }, 
  { name: "Kidney", x: 100, y: 260 }, 
  { name: "Knee", x: 50, y: 150 }, 
  { name: "left Hand", x: 150, y: 150 }, 
  { name: "left Finger", x: 150, y: 150 }, 
  { name: "left Hamstring", x: 75, y: 345 }, 
  { name: "left Knee", x: 25, y: 240 }, 
  { name: "left Quadricep", x: 75, y: 345 }, 
  { name: "Neck", x: 100, y: 80 }, 
  { name: "Oblique", x: 100, y: 250 }, 
  { name: "Pectoral", x: 100, y: 180 }, 
  { name: "Quadricep", x: 126, y: 345 }, 
  { name: "Rib", x: 100, y: 190 }, 
  { name: "Ribs", x: 100, y: 190 }, 
  { name: "right Elbow", x: 72, y: 467 }, 
  { name: "right Groin", x: 100, y: 300 },
  { name: "right Hamstring", x: 126, y: 345 }, 
  { name: "right Quadricep", x: 126, y: 345 }, 
  { name: "right Shoulder", x: 150, y: 150 }, 
  { name: "right Thumb", x: 50, y: 150 }, 
  { name: "right Wrist", x: 150, y: 150 }, 
  { name: "Shin", x: 120, y: 420 }, 
  { name: "Shoulder", x: 50, y: 150 }, 
  { name: "Thigh", x: 10, y: 257 }, 
  { name: "Thumb", x: 176, y: 257 }, 
  { name: "Toe", x: 128, y: 467 }, 
  { name: "Tooth", x: 100, y: 65 }, 
  { name: "Triceps", x: 74, y: 420 }, 
  { name: "Wrist", x: 176, y: 257 }, 
];

const InjuryMarker = ({ bodyPart, injuries }) => {
  const occurrences = injuries.filter(injury => injury.bodyPart === bodyPart.name).length;
  const colorScale = scaleLinear().domain([1, 5]).range(['yellow', 'red']);
  const color = occurrences > 0 ? colorScale(occurrences) : 'transparent';

  return occurrences > 0 ? (
    <circle cx={bodyPart.x} cy={bodyPart.y} r='20' fill={color} stroke='black' strokeWidth='1' />
  ) : null;
};

const InjuryTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.length > 0) {
      const searchResults = playerData.filter(player => player.name[0].toLowerCase().startsWith(query));
      setFilteredPlayers(searchResults);
    } else {
      setFilteredPlayers([]);
    }
  };

  const handleSelectPlayer = (player) => {
    setSelectedPlayer(player);
    setSearchQuery(player.name[0]);
    setFilteredPlayers([]);
  };

  const getPlayerInjuries = (playerName) => {
    // Find the player's injuries based on their name
    const playerInjuries = injuryData.filter(injury => injury.name[0] === playerName);
  
    // Map over the found injuries to create a list of injury occurrences with details
    return playerInjuries.flatMap(injury => {
      return injuryToBodyPartMap.flatMap(bodyPart => {
        if (injury[bodyPart.name] && injury[bodyPart.name].length > 0) {
          return {
            bodyPart: bodyPart.name,
            occurrences: injury[bodyPart.name].length,
            gameStatus: injury.game_status ? injury.game_status[0] : "Unknown",
          };
        }
        return [];
      });
    });
  };
  
  const InjuryLog = ({ injuries, playerName }) => {
    if (!injuries || injuries.length === 0) {
      return null;
    }

    return (
      <div className='injury-log'>
        {injuries.map((injury, index) => (
          <div key={index} className='injury-log-item'>
            {`${playerName} had ${injury.occurrences} occurrence(s) of a ${injury.bodyPart} injury, with a game status of ${injury.gameStatus}.`}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className='injury-tab'>
      <input
        type='text'
        placeholder='Search player'
        value={searchQuery}
        onChange={handleSearch}
        className='search-input'
      />
      {searchQuery && filteredPlayers.map((player, index) => (
        <div
          key={index}
          onClick={() => handleSelectPlayer(player)}
          className='search-result-item'
        >
          {player.name[0]}
        </div>
      ))}
      {filteredPlayers.length > 0 && (
        <div className='suggestions'>
          {filteredPlayers.map(player => (
            <div key={player.id[0]} onClick={() => handleSelectPlayer(player)} className='suggestion-item'>
              {player.name[0]}
            </div>
          ))}
        </div>
      )}
      {selectedPlayer && (
        <>
          <div className='player-info'>
            <div className='player-name'>{selectedPlayer.name[0]}</div>
            <div className='player-details'>
              {selectedPlayer.position && <span>{`Position: ${selectedPlayer.position[0]}`}</span>}
              {selectedPlayer.height && <span>{`Height: ${selectedPlayer.height[0]} in`}</span>}
              {selectedPlayer.weight && <span>{`Weight: ${selectedPlayer.weight[0]} lbs`}</span>}
              {selectedPlayer.experience && <span>{`EXP: ${selectedPlayer.experience[0]}`}</span>}
            </div>
          </div>
          <div className='player-container'>
            <img src={silhouette} alt='Player Silhouette' className='player-silhouette' />
            <svg className='player-injuries-svg' viewBox='0 0 200 400'>
              {selectedPlayer && injuryToBodyPartMap.map((bodyPart) => (
                <InjuryMarker
                  key={bodyPart.name}
                  bodyPart={bodyPart}
                  injuries={getPlayerInjuries(selectedPlayer.name[0])}
                />
              ))}
            </svg>
          </div>
          <InjuryLog injuries={getPlayerInjuries(selectedPlayer.name[0])} playerName={selectedPlayer.name[0]} />
        </>
      )}
    </div>
  );
};

export default InjuryTab;