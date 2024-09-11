import React, { useEffect, useRef, useState } from 'react';
import { Player, Enemy, Position, Bullet } from '../Types/indext';
import PlayerComponent from './Player';

const Game: React.FC = () => {
  const [player, setPlayer] = useState<Player>({
    position: { x: window.innerWidth / 2, y: window.innerHeight - 50 },
    size: 40,
    speed: 5,
    bullets: [],
  });

  const [enemies, setEnemies] = useState<Enemy[]>([]);

  // Game loop logic
  const gameLoop = useRef<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setPlayer((prev: Player) => ({
          ...prev,
          position: { ...prev.position, x: prev.position.x - prev.speed },
        }));
      }
      if (e.key === 'ArrowRight') {
        setPlayer((prev: Player) => ({
          ...prev,
          position: { ...prev.position, x: prev.position.x + prev.speed },
        }));
      }
      if (e.key === ' ') {
        shootBullet();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const shootBullet = () => {
    setPlayer((prev: Player) => ({
      ...prev,
      bullets: [
        ...prev.bullets,
        { position: { x: prev.position.x + prev.size / 2, y: prev.position.y }, speed: 5 },
      ],
    }));
  };

  const updateGame = () => {
    setPlayer((prev: Player) => ({
      ...prev,
      bullets: prev.bullets
        .map((bullet: Bullet) => ({
          ...bullet,
          position: { ...bullet.position, y: bullet.position.y - bullet.speed },
        }))
        .filter((bullet: Bullet) => bullet.position.y > 0),
    }));

    setEnemies((prev: Enemy[]) =>
      prev.map((enemy: Enemy) => ({
        ...enemy,
        position: { ...enemy.position, y: enemy.position.y + enemy.speed },
      }))
    );

    handleCollisions();
  };

  const handleCollisions = () => {
    setEnemies((prevEnemies: Enemy[]) =>
      prevEnemies.filter((enemy: Enemy) => {
        const bulletHit = player.bullets.some((bullet: Bullet) => {
          return (
            bullet.position.x > enemy.position.x &&
            bullet.position.x < enemy.position.x + enemy.size &&
            bullet.position.y > enemy.position.y &&
            bullet.position.y < enemy.position.y + enemy.size
          );
        });
        return !bulletHit;
      })
    );
  };

  useEffect(() => {
    const spawnEnemy = () => {
      setEnemies((prev: Enemy[]) => [
        ...prev,
        { position: { x: Math.random() * window.innerWidth, y: 0 }, size: 30, speed: 2 },
      ]);
    };

    const enemyInterval = setInterval(spawnEnemy, 2000);

    return () => clearInterval(enemyInterval);
  }, []);

  useEffect(() => {
    const loop = () => {
      updateGame();
      gameLoop.current = requestAnimationFrame(loop);
    };

    loop();

    return () => cancelAnimationFrame(gameLoop.current);
  }, []);

  return (
    <div className="game-container">
      <PlayerComponent player={player} />
      {player.bullets.map((bullet: Bullet, index: number) => (
        <div
          key={index}
          className="bullet"
          style={{ left: bullet.position.x, top: bullet.position.y }}
        />
      ))}
      {enemies.map((enemy: Enemy, index: number) => (
        <div
          key={index}
          className="enemy"
          style={{ left: enemy.position.x, top: enemy.position.y }}
        />
      ))}
    </div>
  );
};

export default Game;
