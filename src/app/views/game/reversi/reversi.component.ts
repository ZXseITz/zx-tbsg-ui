import {Component, OnInit, OnDestroy} from '@angular/core';
import {Line, Token, TokenState} from './token.js';
import {Client} from '../../../models/client';
import {GameService} from '../../../services/game.service';

@Component({
  selector: 'app-game-reversi',
  templateUrl: './reversi.component.html',
  styleUrls: ['./reversi.component.scss']
})
export class ReversiComponent implements OnInit, OnDestroy {
  public static get CLIENT_PLACE(): number { return 2000; }

  public static get SERVER_INIT_PLAYER_NEXT(): number { return 2100; }
  public static get SERVER_INIT_OPPONENT_NEXT(): number { return 2101; }
  public static get SERVER_PLAYER_NEXT(): number { return 2110; }
  public static get SERVER_OPPONENT_NEXT(): number { return 2111; }
  public static get SERVER_VICTORY(): number { return 2120; }
  public static get SERVER_DEFEAT(): number { return 2121; }
  public static get SERVER_TIE(): number { return 2122; }

  name: string;
  client: Client;
  tokens: Array<Token>;
  hLines: Array<Line>;
  vLines: Array<Line>;
  color: number;

  constructor(private gameService: GameService) {
    this.name = 'reversi';
    this.client = new Client(`${gameService.wsUrl}/reversi`);
  }

  ngOnInit(): void {
    this.client.registerOnEvent(ReversiComponent.SERVER_INIT_PLAYER_NEXT, args => {
      if (args.has('color') && args.has('board') && args.has('preview')) {
        this.initGame(args.get('color'));  // fixme
        this.updateBoard(args.get('board'));
        this.showPreview(args.get('preview'));
      }
    });
    this.client.registerOnEvent(ReversiComponent.SERVER_INIT_OPPONENT_NEXT, args => {
      if (args.has('color') && args.has('board')) {
        this.initGame(args.get('color'));
        this.updateBoard(args.get('board'));
      }
    });
    this.client.registerOnEvent(ReversiComponent.SERVER_PLAYER_NEXT, args => {
      if (args.has('source') && args.has('board') && args.has('preview')) {
        this.updateBoard(args.get('board'));
        this.updateSource(args.get('source'));
        this.showPreview(args.get('preview'));
      }
    });
    this.client.registerOnEvent(ReversiComponent.SERVER_OPPONENT_NEXT, args => {
      if (args.has('source') && args.has('board')) {
        this.updateBoard(args.get('board'));
        this.updateSource(args.get('source'));
      }
    });
    this.client.registerOnEvent(ReversiComponent.SERVER_VICTORY, args => {
      if (args.has('source') && args.has('board')) {
        this.finishGame();
        this.updateBoard(args.get('board'));
        this.updateSource(args.get('source'));
        console.log('You won');  // fixme
      }
    });
    this.client.registerOnEvent(ReversiComponent.SERVER_DEFEAT, args => {
      if (args.has('source') && args.has('board')) {
        this.finishGame();
        this.updateBoard(args.get('board'));
        this.updateSource(args.get('source'));
        console.log('You lost');  // fixme
      }
    });
    this.client.registerOnEvent(ReversiComponent.SERVER_TIE, args => {
      if (args.has('source') && args.has('board')) {
        this.finishGame();
        this.updateBoard(args.get('board'));
        this.updateSource(args.get('source'));
        console.log('It\'s a tie');  // fixme
      }
    });
    this.client.connect();
    this.hLines = new Array<Line>(9);
    this.vLines = new Array<Line>(9);
    for (let i = 0; i < 9; i++) {
      const delta = i * 12.5;
      this.hLines[i] = {x1: 0, y1: delta, x2: 100, y2: delta};
      this.vLines[i] = {x1: delta, y1: 0, x2: delta, y2: 100};
    }
    this.tokens = new Array<Token>(64);
    for (let i = 0; i < 64; i++) {
      this.tokens[i] = new Token(i, () => {
        this.client.send(ReversiComponent.CLIENT_PLACE, {
          index: i
        });
      });
    }
  }

  printColor(color: number): string {
    return color === 1 ? 'black' : color === 2 ? 'white' : 'undefined';
  }

  initGame(color: number): void {
    this.client.inGame = true;
    this.color  = color;
    console.log(`You play as ${this.printColor(color)}`);
  }

  finishGame(): void {
    this.client.inGame = false;
  }

  updateBoard(board: Array<number>): void {
    for (let i = 0; i < board.length; i++) {
      const state = board[i];
      this.tokens[i].color = state === 1 ? TokenState.BLACK : state === 2 ? TokenState.WHITE : TokenState.EMPTY;
    }
  }

  showPreview(preview: Array<number>): void {
    const state = this.color === 1 ? TokenState.PREVIEW_BLACK : TokenState.PREVIEW_WHITE;
    preview.forEach(p => {
      this.tokens[p].color = state;
    });
  }

  updateSource(source: number): void {
    // todo highlight source index
  }

  ngOnDestroy(): void {
    this.client.disconnect();
  }
}
