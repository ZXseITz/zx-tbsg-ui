export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Audit {
  color: number;
  field: number;
}

export enum TokenState {
  EMPTY = 'token',
  BLACK = 'token--black',
  WHITE = 'token--white',
  PREVIEW_BLACK = 'token--preview--black',
  PREVIEW_WHITE = 'token--preview--white',
}

export class Token {
  public readonly id: number;
  public readonly x: number;
  public readonly y: number;
  public readonly radius: number;
  public readonly classList: string[];

  private mState: TokenState;
  private mHighlight: boolean;
  private readonly mOnClick: () => void;

  constructor(id: number, onClick: () => void) {
    this.id = id;
    this.x = (id % 8) * 12.5 + 6.25;
    this.y = Math.floor(id / 8) * 12.5 + 6.25;
    this.radius = 5;
    this.mState = TokenState.EMPTY;
    this.mHighlight = false;
    this.classList = [TokenState.EMPTY];
    this.mOnClick = onClick;
  }

  public get state(): TokenState {
    return this.mState;
  }

  public set color(color: TokenState) {
    this.mState = color;
    this.classList[0] = color;
  }

  public set highlight(value: boolean) {
    // console.log(`highlight token ${this.id}: ${value}`);
    if (value && !this.mHighlight) {
      this.classList.push('highlight');
    } else if (!value && this.mHighlight) {
      this.classList.pop();
    }
    this.mHighlight = value;
  }

  public onClick(): void {
    if (this.mState === TokenState.PREVIEW_BLACK || this.mState === TokenState.PREVIEW_WHITE) {
      this.mOnClick();
    }
  }
}
