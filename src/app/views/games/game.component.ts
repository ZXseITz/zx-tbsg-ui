import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GameService} from '../../services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit, OnDestroy {
  name: string;
  index: any;
  private sub: any;
  private reader: FileReader;

  constructor(private route: ActivatedRoute, private gameService: GameService) {
    this.name = 'n/a';
    this.reader = new FileReader();
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.name = params.game;
      this.display();
    });
  }

  display(): void {
    this.reader.addEventListener('load', () => {
      this.index = this.reader.result;
    });
    this.gameService.blob(this.name, 'index.html').subscribe(blob => {
      this.reader.readAsText(blob);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
