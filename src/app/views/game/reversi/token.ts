export enum TokenState {
  EMPTY = 'token',
  WHITE = 'token-white',
  BLACK = 'token-black',
  WHITE_PREVIEW = 'token-white-preview',
  BLACK_PREVIEW = 'token-black-preview',
}

export interface ReversiToken  {
  radius: number;
  x: number;
  y: number;
  state: TokenState;
  click: () => void;
}

export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
