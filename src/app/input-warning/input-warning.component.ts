import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-input-warning',
  templateUrl: './input-warning.component.html',
  styleUrls: ['./input-warning.component.scss']
})
export class InputWarningComponent {
  @Input() errorMsg: string;
  @Input() displayError: boolean;
}
