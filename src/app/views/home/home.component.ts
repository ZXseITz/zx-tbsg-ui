import {Component, Input, OnInit} from '@angular/core';
import {GameService} from '../../services/game.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  welcomeMsg: string;

  constructor(private gameService: GameService) {
    this.welcomeMsg = 'Restricted';
  }

  ngOnInit(): void {
    this.getWelcome();
  }

  getWelcome(): void {
     this.gameService.home()
      .subscribe(str => this.welcomeMsg = str);
  }

}
