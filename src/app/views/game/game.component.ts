import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GameService} from '../../services/game.service';
import {SafeHtml, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  gameName: string;
  html: SafeHtml;
  // styles: Array<SafeResourceUrl>;
  private sub: any;

  constructor(private route: ActivatedRoute,
              private gameService: GameService) {
    this.gameName = 'n/a';
    this.html = undefined;
    // this.styles = new Array<SafeResourceUrl>();
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.gameName = params.game;

    //   this.gameService.downloadHtml(this.gameName, 'index.html')
    //     .subscribe(html => this.html = html);
    //   this.gameService.listStyleUrls(this.gameName)
    //     .subscribe(styles => {
    //       styles.forEach(style => {
    //         this.styles.push(style);
    //       });
    //     });
    //   this.gameService.listScriptUrls(this.gameName)
    //     .subscribe(scripts => {
    //       this.myscript = scripts[0];
    //       scripts.forEach(script => {
    //         this.scripts.push(script);
    //       });
    //     });
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
