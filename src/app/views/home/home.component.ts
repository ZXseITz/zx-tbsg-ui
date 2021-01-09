import {Component, Input, OnInit} from '@angular/core';
import {GameService} from '../../services/game.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  games: Array<string>;

  constructor(private gameService: GameService) {
    this.games = [];
  }

  ngOnInit(): void {
    this.listGames();
  }

  listGames(): void {
     this.gameService.list()
      .subscribe(games => this.games = games);
  }
}
