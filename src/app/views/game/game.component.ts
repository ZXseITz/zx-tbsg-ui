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
          case 1100: {
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
    this.websocket.send(JSON.stringify({
      code: 1100
    }));
  }

  ngOnDestroy(): void {
    this.websocket.close();
  }
}
