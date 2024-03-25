import React, { useState } from "react";
import { scaleLinear } from "d3-scale";
import injuryData from "./injuries.json";
import playerData from "./players.json";
import silhouette from './silhouette.png';
import "./sleeper.css";
import _ from 'lodash';

const injuryToBodyPartMap = [ 
  { name: "Abdomen", x: 100, y: 160 }, 
  { name: "Ankle", x: 81, y: 300 }, 
  { name: "ankle", x: 120, y: 300 }, 
  { name: "Arm", x: 150, y: 140 }, 
  { name: "Back", x: 100, y: 150 }, 
  { name: "Biceps", x: 52, y: 130 }, 
  { name: "Calf", x: 82, y: 285 }, 
  { name: "Chest", x: 100, y: 120 }, 
  { name: "Concussion", x: 100, y: 45 }, 
  { name: "Elbow", x: 152, y: 145 }, 
  { name: "Face", x: 100, y: 45 }, 
  { name: "Finger", x: 150, y: 175 }, 
  { name: "Foot", x: 120, y: 310 }, 
  { name: "Forearm", x: 50, y: 160 }, 
  { name: "Groin", x: 100, y: 200 }, 
  { name: "Hamstring", x: 118, y: 235 }, 
  { name: "Hand", x: 150, y: 175 },
  { name: "Heel", x: 120, y: 300 }, 
  { name: "Hip", x: 120, y: 180 }, 
  { name: "Kidney", x: 100, y: 170 }, 
  { name: "Knee", x: 83, y: 260 }, 
  { name: "left Hand", x: 50, y: 180 }, 
  { name: "left Finger", x: 50, y: 180 }, 
  { name: "left Hamstring", x: 83, y: 235 }, 
  { name: "left Knee", x: 83, y: 260 }, 
  { name: "left Quadricep", x: 83, y: 235 }, 
  { name: "Neck", x: 100, y: 80 }, 
  { name: "Oblique", x: 80, y: 180 }, 
  { name: "Pectoral", x: 85, y: 110 }, 
  { name: "Quadricep", x: 118, y: 235 }, 
  { name: "Rib", x: 115, y: 135 }, 
  { name: "Ribs", x: 85, y: 135 }, 
  { name: "right Elbow", x: 152, y: 145 }, 
  { name: "right Groin", x: 100, y: 200 },
  { name: "right Hamstring", x: 118, y: 235 }, 
  { name: "right Quadricep", x: 118, y: 235 }, 
  { name: "right Shoulder", x: 140, y: 110 },
  { name: "right Thumb", x: 150, y: 175 }, 
  { name: "right Wrist", x: 150, y: 172 }, 
  { name: "Shin", x: 118, y: 285 }, 
  { name: "Shoulder", x: 60, y: 110 }, 
  { name: "Thigh", x: 83, y: 235 }, 
  { name: "Thumb", x: 50, y: 180 }, 
  { name: "Toe", x: 80, y: 310 }, 
  { name: "Tooth", x: 100, y: 50 }, 
  { name: "Triceps", x: 148, y: 130 }, 
  { name: "Wrist", x: 50, y: 173 }, 
];

const InjuryMarker = ({ bodyPart, injuries }) => {
  const occurrences = injuries.filter(injury => injury.bodyPart === bodyPart.name).length;
  const colorScale = scaleLinear().domain([1, 5]).range(['yellow', 'red']);
  const color = occurrences > 0 ? colorScale(occurrences) : 'transparent';

  return occurrences > 0 ? (
    <circle cx={bodyPart.x} cy={bodyPart.y} r='12' fill={color} stroke='black' strokeWidth='1' />
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
    const playerInjuries = injuryData.filter(injury => injury.name[0] === playerName);
    const injuryOccurrences = {};
  
    playerInjuries.forEach(injuryRecord => {
      Object.keys(injuryRecord).forEach(key => {
        if (key.startsWith('injury') && injuryRecord[key][0]) {
          const bodyPartName = injuryRecord[key][0];
          const gameStatus = injuryRecord.game_status[0];
  
          // Make sure we are not duplicating "null" or "NA" entries
          if (bodyPartName.toLowerCase() !== 'na' && bodyPartName.toLowerCase() !== 'null') {
            // Use the body part name as the key to consolidate the same injuries
            const statusKey = `${bodyPartName.toLowerCase()}`;
  
            if (!injuryOccurrences[statusKey]) {
              injuryOccurrences[statusKey] = {
                bodyPart: bodyPartName,
                occurrences: 1,
                gameStatus: gameStatus,
              };
            } else {
              // Only increment the count if the gameStatus matches
              if (injuryOccurrences[statusKey].gameStatus === gameStatus) {
                injuryOccurrences[statusKey].occurrences++;
              } else {
                // Handle a new gameStatus for an existing bodyPartName
                injuryOccurrences[statusKey + '-' + gameStatus] = {
                  bodyPart: bodyPartName,
                  occurrences: 1,
                  gameStatus: gameStatus,
                };
              }
            }
          }
        }
      });
    });
  
    // Convert the occurrences object to an array of injury objects
    return Object.values(injuryOccurrences);
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