export interface HeartData {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  rotate: number;
}

export interface PopEffectProps {
  x: number | string;
  y: number | string;
  message: string;
  onComplete: () => void;
}
