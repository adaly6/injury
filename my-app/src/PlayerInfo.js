import playerData from "./players.json";

export const PlayerInfo = ({ player }) => {
    if (!player) return null;
  
    return (
      <div className="player-info">
        <div className="player-name">{player.name[0]}</div>
        <div className="player-details">
          <span>{`Position: ${player.position[0]}`}</span>
          <span>{`Height: ${player.height[0]} in`}</span>
          <span>{`Weight: ${player.weight[0]} lbs`}</span>
          <span>{`EXP: ${player.experience[0]}`}</span>
        </div>
      </div>
    );
  };
  