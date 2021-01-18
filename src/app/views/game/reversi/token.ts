export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export enum TokenState {
  EMPTY = 'token',
  BLACK = 'token-black',
  WHITE = 'token-white',
  BLACK_PREVIEW = 'token-black-preview',
  WHITE_PREVIEW = 'token-white-preview',
}

export class Token {
  public readonly x: number;
  public readonly y: number;
  public readonly radius: number;

  private mState: TokenState;
  private readonly mOnClick: () => void;

  constructor(id: number, onClick: () => void) {
    this.x = (id % 8) * 12.5 + 6.25;
    this.y = Math.floor(id / 8) * 12.5 + 6.25;
    this.radius = 5;
    this.mState = TokenState.EMPTY;
    this.mOnClick = onClick;
  }

  public get state(): TokenState {
    return this.mState;
  }

  public set color(color: TokenState) {
    this.mState = color;
  }

  public onClick(): void {
    if (this.mState === TokenState.BLACK_PREVIEW || this.mState === TokenState.WHITE_PREVIEW) {
      this.mOnClick();
    }
  }
}
