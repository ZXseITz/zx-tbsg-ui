export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export enum TokenState {
  EMPTY = 'token',
  BLACK = 'token--black',
  WHITE = 'token--white',
  PREVIEW_BLACK = 'token--preview--black',
  PREVIEW_WHITE = 'token--preview--white',
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
    if (this.mState === TokenState.PREVIEW_BLACK || this.mState === TokenState.PREVIEW_WHITE) {
      this.mOnClick();
    }
  }
}
