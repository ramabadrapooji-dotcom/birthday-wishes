export interface CardContent {
  type: 'message' | 'photo' | 'coupon';
  title: string;
  subtitle?: string;
  body: string;
  image?: string;
  emoji?: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  rotation: number;
  vRotation: number;
  shape: 'star' | 'circle' | 'heart' | 'foil';
}
