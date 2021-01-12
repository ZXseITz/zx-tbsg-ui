import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GameService} from '../../services/game.service';
import {Client} from '../../models/client';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  @Input() name: string;
  opponents: Array<Client>;
  private websocket: WebSocket;
  private handler: object;

  constructor(private route: ActivatedRoute,
              private gameService: GameService) {
    this.opponents = new Array<Client>(0);
  }

  private emitMessage(message: object): void {
    this.websocket.send(JSON.stringify(message));
  }

  ngOnInit(): void {
    const url = `${this.gameService.wsUrl}/${this.name}`;
    this.websocket = new WebSocket(url);
    this.websocket.onopen = () => {
      console.log(`connected to ${url}`);
    };
    this.websocket.onclose = (message) => {
      console.log(`disconnected from ${url}`);
    };
    this.websocket.onerror = (error) => {
      console.error(error);
    };
    this.websocket.onmessage = (message) => {
      this.invokeMessage(message.data);
    };
  }

  invokeMessage(message: any): void {
    console.log(`received message: ${message}`); // fixme
    if (typeof message === 'string') {
      const msg = JSON.parse(message);
      if (msg.hasOwnProperty('code') && msg.hasOwnProperty('args')) {
        switch (msg.code) {
          case GameService.CODE_LIST: {
            if (msg.args.hasOwnProperty('opponents')) {
              for (const [id, name] of Object.entries(msg.args.opponents)) {
                const username = name.toString();
                this.opponents.push({id, username});
              }
            }
            break;
          }
          default: {
            console.warn(`Unknown event code ${msg.code}`);
          }
        }
      }
    }
  }

  fetchOpponents(): void {
    this.emitMessage({
      code: GameService.CODE_LIST
    });
  }

  challenge(opponent: Client): void {
    this.emitMessage({
      code: GameService.CODE_CHALLENGE,
      args: {opponent: opponent.id}
    });
  }

  challengeAbort(opponent: Client): void {
    this.emitMessage({
      code: GameService.CODE_CHALLENGE_ABORT,
      args: {opponent: opponent.id}
    });
  }

  challengeAccept(opponent: Client): void {
    this.emitMessage({
      code: GameService.CODE_CHALLENGE_ACCEPT,
      args: {opponent: opponent.id}
    });
  }

  challengeDecline(opponent: Client): void {
    this.emitMessage({
      code: GameService.CODE_CHALLENGE_DECLINE,
      args: {opponent: opponent.id}
    });
  }

  ngOnDestroy(): void {
    this.websocket.close();
  }
}
