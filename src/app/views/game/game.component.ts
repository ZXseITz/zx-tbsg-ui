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
  connection: string;
  socketId: string;
  private websocket: WebSocket;
  private handler: object;

  constructor(private route: ActivatedRoute,
              private gameService: GameService) {
  }

  private emitMessage(message: object): void {
    this.websocket.send(JSON.stringify(message));
  }

  ngOnInit(): void {
    this.connection = 'connecting';
    const url = `${this.gameService.wsUrl}/${this.name}`;
    this.websocket = new WebSocket(url);
    this.websocket.onopen = () => {
      this.connection = 'connected';
      console.log(`connected to ${url}`);
    };
    this.websocket.onclose = (message) => {
      this.connection = 'disconnected';
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
          case GameService.CODE_ID: {
            if (msg.args.hasOwnProperty('id')) {
              this.socketId = msg.args.id;
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
