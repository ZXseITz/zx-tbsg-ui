import {Component, ElementRef, Inject, OnInit, Renderer2} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-game-reversi',
  templateUrl: './reversi.component.html',
  styleUrls: ['./reversi.component.scss']
})
export class ReversiComponent implements OnInit {
  constructor(@Inject(DOCUMENT) private document: Document,
              private renderer: Renderer2) {

  }

  ngOnInit(): void {
    // const board = document.getElementById('board');
    // for (let i  = 0; i <= 8; i++) {
    //   const delta = String(i * 12.5);
    //   const hLine = this.renderer.createComment('line');
    //   hLine.classList.add('bline');
    //   hLine.setAttribute('x1', '0.0');
    //   hLine.setAttribute('y1', delta);
    //   hLine.setAttribute('x2', '100.0');
    //   hLine.setAttribute('y2', delta);
    //   board.appendChild(hLine);
    //
    //   const vLine = document.createElement('line');
    //   vLine.classList.add('bline');
    //   vLine.setAttribute('x1', delta);
    //   vLine.setAttribute('y1', '0.0');
    //   vLine.setAttribute('x2', delta);
    //   vLine.setAttribute('y2', '100.0');
    //   board.appendChild(vLine);
    // }
  }
}
