import React from 'react';
import { Player } from '../Types/indext';

interface PlayerProps {
  player: Player;
}

const PlayerComponent: React.FC<PlayerProps> = ({ player }) => {
  return (
    <div
      className="player"
      style={{
        left: player.position.x,
        top: player.position.y,
        width: player.size,
        height: player.size,
      }}
    />
  );
};

export default PlayerComponent;
