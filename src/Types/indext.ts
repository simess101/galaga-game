export interface Position {
    x: number;
    y: number;
  }
  
  export interface Player {
    position: Position;
    size: number;
    speed: number;
    bullets: Bullet[];
  }
  
  export interface Bullet {
    position: Position;
    speed: number;
  }
  
  export interface Enemy {
    position: Position;
    size: number;
    speed: number;
  }
  