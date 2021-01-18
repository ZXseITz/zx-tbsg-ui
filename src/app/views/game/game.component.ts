import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {GameService} from '../../services/game.service';
import {Client} from '../../models/client';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  @Input() name: string;
  @Input() client: Client;
  @ViewChild('challengeId', { static: true }) challengeInput: ElementRef;
  @ViewChild('challengeBtn', { static: true }) challengeButton: ElementRef;
  connection: string;
  socketId: string;
  challenges: Map<string, string>;
  contenders: Map<string, string>;

  state: number;  // todo delete me

  constructor() {
    this.challenges = new Map<string, string>();
    this.contenders = new Map<string, string>();
    // this.contenders.set('cda3ba62-d5e3-27a0-4e9d-a7f99ec05a08', 'guest'); // fixme
    // this.contenders.set('cda3ba62-d5e3-27a0-4e9d-a7f99ec05a09', 'guest'); // fixme
  }

  ngOnInit(): void {
    this.connection = 'connecting';
    this.client.registerOnConnected(0, () => {
      this.connection = 'connected';
    });
    this.client.registerOnDisconnected(0, () => {
      this.connection = 'disconnected';
    });
    this.client.registerOnEvent(GameService.SERVER_ID, args => {
      if (args.has('id')) {
        this.socketId = args.get('id');
      }
    });
    this.client.registerOnEvent(GameService.SERVER_CHALLENGE, args => {
      if (args.has('opponent')) {
        const opponent = args.get('opponent');
        this.contenders.set(opponent, 'guest');  // fixme
      }
    });
    this.client.registerOnEvent(GameService.SERVER_CHALLENGE_ABORT, args => {
      if (args.has('opponent')) {
        const opponent = args.get('opponent');
        this.contenders.delete(opponent);
      }
    });
    this.client.registerOnEvent(GameService.SERVER_CHALLENGE_ACCEPT, args => {
      const opponentId = args.get('opponent');
      if (opponentId) {
        if (!this.challenges.delete(opponentId)) {
          console.warn(`Unknown challenge accept from ${opponentId}`);
        }
      }
    });
    this.client.registerOnEvent(GameService.SERVER_CHALLENGE_DECLINE, args => {
      const opponentId = args.get('opponent');
      if (opponentId) {
        if (!this.challenges.delete(opponentId)) {
          console.warn(`Unknown challenge decline from ${opponentId}`);
        }
      }
    });
  }

  get challengeId(): string {
    return this.challengeInput.nativeElement.value;
  }

  onChallenge(): void {
    const opponentId = this.challengeInput.nativeElement.value;
    this.client.send(GameService.CLIENT_CHALLENGE,
      {opponent: opponentId});
    this.challenges.set(opponentId, 'guest');  // fixme
  }

  onChallengeAbort(opponentId: string): void {
    this.client.send(GameService.CLIENT_CHALLENGE_ABORT,
      {opponent: opponentId});
    this.challenges.delete(opponentId);
  }

  onChallengeAccept(opponentId: string): void {
    this.client.send(GameService.CLIENT_CHALLENGE_ACCEPT,
      {opponent: opponentId});
    this.contenders.delete(opponentId);
  }

  onChallengeDecline(opponentId: string): void {
    this.client.send(GameService.CLIENT_CHALLENGE_DECLINE,
      {opponent: opponentId});
    this.contenders.delete(opponentId);
  }
}
