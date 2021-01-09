import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {GameService} from '../../services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  name: string;
  private sub: any;

  constructor(private route: ActivatedRoute, private gameService: GameService) {
    this.name = '';
  }

  ngOnInit(): void {
      this.sub = this.route.params.subscribe(params => {
        this.name = params.game;
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
