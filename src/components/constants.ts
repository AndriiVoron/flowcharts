import { v4 as uuidv4 } from 'uuid';

export const CONNECTOR_OFFSET = 8;

export const DIAGRAME_BASE = [
  {
    id: uuidv4(),
    x: 100,
    y: 100,
    width: 100,
    height: 60,
    name: 'Start',
    fill: '#ffffff',
    isHovered: false,
    icon: 'Box',
  },
  {
    id: uuidv4(),
    x: 300,
    y: 100,
    width: 100,
    height: 60,
    name: 'Database',
    fill: '#ffffff',
    isHovered: false,
    icon: 'Database',
  },
  {
    id: uuidv4(),
    x: 500,
    y: 250,
    width: 100,
    height: 60,
    name: 'Code',
    fill: '#ffffff',
    isHovered: false,
    icon: 'Code2',
  },
];
