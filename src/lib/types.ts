export interface DiagramBlock {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  fill: string;
  isHovered: boolean;
  icon: string;
  isTargetCandidate?: boolean;
}

export interface Connection {
  from: string;
  to: string;
  fromDir: 'top' | 'bottom' | 'left' | 'right';
  toDir: 'top' | 'bottom' | 'left' | 'right';
  color: string;
}
