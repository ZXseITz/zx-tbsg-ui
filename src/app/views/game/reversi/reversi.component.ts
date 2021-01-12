import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {EventHandler} from '../../../models/eventHandler';
import {GameComponent} from '../game.component';
import {Line, ReversiToken, TokenState} from './token.js';
import {GameService} from '../../../services/game.service';

@Component({
  selector: 'app-game-reversi',
  templateUrl: './reversi.component.html',
  styleUrls: ['./reversi.component.scss']
})
export class ReversiComponent implements OnInit {
  public static get CLIENT_PLACE(): number { return 2000; }

  public static get SERVER_INIT_PLAYER_NEXT(): number { return 2100; }
  public static get SERVER_INIT_OPPONENT_NEXT(): number { return 2101; }
  public static get SERVER_PLAYER_NEXT(): number { return 2110; }
  public static get SERVER_OPPONENT_NEXT(): number { return 2111; }
  public static get SERVER_VICTORY(): number { return 2120; }
  public static get SERVER_DEFEAT(): number { return 2121; }
  public static get SERVER_TIE(): number { return 2122; }

  eventHandler: EventHandler;
  tokens: Array<ReversiToken>;
  hLines: Array<Line>;
  vLines: Array<Line>;
  color: number;

  constructor(@Inject(DOCUMENT) document: Document) {
    const game = this;
    this.eventHandler = {
      invoke(parent: GameComponent, code: number, args: any): void {
        switch (code) {
          case ReversiComponent.SERVER_INIT_PLAYER_NEXT: {
            if (args.hasOwnProperty('color') && args.hasOwnProperty('board') && args.hasOwnProperty('preview')) {
              game.initGame(parent, args.color);
              game.updateBoard(args.board);
              game.showPreview(args.preview);
            }
            break;
          }
          case ReversiComponent.SERVER_INIT_OPPONENT_NEXT: {
            if (args.hasOwnProperty('color') && args.hasOwnProperty('board')) {
              game.initGame(parent, args.color);
              game.updateBoard(args.board);
            }
            break;
          }
          case ReversiComponent.SERVER_PLAYER_NEXT: {
            if (args.hasOwnProperty('source') && args.hasOwnProperty('board') && args.hasOwnProperty('preview')) {
              game.updateBoard(args.board);
              game.updateSource(args.source);
              game.showPreview(args.preview);
            }
            break;
          }
          case ReversiComponent.SERVER_OPPONENT_NEXT: {
            if (args.hasOwnProperty('source') && args.hasOwnProperty('board')) {
              game.updateBoard(args.board);
              game.updateSource(args.source);
            }
            break;
          }
          case ReversiComponent.SERVER_VICTORY: {
            if (args.hasOwnProperty('source') && args.hasOwnProperty('board')) {
              game.updateBoard(args.board);
              game.updateSource(args.source);
              console.log('You won');  // fixme
            }
            break;
          }
          case ReversiComponent.SERVER_DEFEAT: {
            if (args.hasOwnProperty('source') && args.hasOwnProperty('board')) {
              game.updateBoard(args.board);
              game.updateSource(args.source);
              console.log('You lost');  // fixme
            }
            break;
          }
          case ReversiComponent.SERVER_TIE: {
            if (args.hasOwnProperty('source') && args.hasOwnProperty('board')) {
              game.updateBoard(args.board);
              game.updateSource(args.source);
              console.log('It\'s a tie');  // fixme
            }
            break;
          }
          default: {
            console.warn(`Unknown event code ${code}`);
          }
        }
      }
    };
  }

  printColor(color: number): string {
    return color === 1 ? 'black' : color === 2 ? 'white' : 'undefined';
  }

  initGame(parent: GameComponent, color: number): void {
    parent.state = 2;
    parent.challengeInputDisable = true;
    parent.challengeButtonText = 'Challenge';
    console.log(`You play as ${this.printColor(color)}`);
  }

  updateBoard(board: Array<number>): void {
    for (let i = 0; i < board.length; i++) {
      const state = board[i];
      this.tokens[i].state = state === 1 ? TokenState.BLACK : state === 2 ? TokenState.WHITE : TokenState.EMPTY;
    }
  }

  showPreview(preview: Array<number>): void {
    const state = this.color === 1 ? TokenState.BLACK_PREVIEW : TokenState.WHITE_PREVIEW;
    preview.forEach(p => {
      this.tokens[p].state = state;
    });
  }

  updateSource(source: number): void {
    // todo highlight source index
  }

  ngOnInit(): void {
    this.hLines = new Array<Line>(9);
    this.vLines = new Array<Line>(9);
    for (let i = 0; i < 9; i++) {
      const delta = i * 12.5;
      this.hLines[i] = {x1: 0, y1: delta, x2: 100, y2: delta};
      this.vLines[i] = {x1: delta, y1: 0, x2: delta, y2: 100};
    }
    this.tokens = new Array<ReversiToken>(64);
    for (let i = 0; i < 64; i++) {
      this.tokens[i] = {
        radius: 5,
        state: TokenState.EMPTY,
        x: (i % 8) * 12.5 + 6.25,
        y: Math.floor(i / 8) * 12.5 + 6.25
      };
    }
  }
}
