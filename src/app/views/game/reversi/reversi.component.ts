import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {EventHandler} from '../../../models/eventHandler';
import {GameComponent} from '../game.component';
import {ReversiToken, TokenState} from './token.js';

@Component({
  selector: 'app-game-reversi',
  templateUrl: './reversi.component.html',
  styleUrls: ['./reversi.component.scss']
})
export class ReversiComponent implements OnInit {
  eventHandler: EventHandler;
  tokens: Array<ReversiToken>;

  constructor(@Inject(DOCUMENT) document: Document) {
    const game = this;
    this.eventHandler = {
      invoke(parent: GameComponent, code: number, args: any): void {
        switch (code) {
          case 2000: {
            if (args.hasOwnProperty('color') && args.hasOwnProperty('board')) {
              parent.state = 2;
              parent.challengeInputDisable = true;
              parent.challengeButtonText = 'Challenge';
              console.log(`You play as ${game.printColor(args.color)}`);
              for (let i = 0; i < args.board.length; i++) {
                const state = args.board[i];
                game.tokens[i].state = state === 1 ? TokenState.BLACK : state === 2 ? TokenState.WHITE : TokenState.EMPTY;
              }
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

  ngOnInit(): void {
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
