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

  constructor(private route: ActivatedRoute,
              private gameService: GameService) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
