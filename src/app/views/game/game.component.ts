import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GameService} from '../../services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  @Input() name: string;
  private websocket: WebSocket;

  constructor(private route: ActivatedRoute,
              private gameService: GameService) {
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

  sendMessage(message: any): void {
    this.websocket.send(message);
  }

  invokeMessage(message: any): void {
    console.log(message);  // fixme
  }

  ngOnDestroy(): void {
    this.websocket.close();
  }
}
