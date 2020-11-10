import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  providers: [AuthService],
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
  }

  register(username: string, email: string, password: string): void {
    this.authService.register(username, email, password)
      .subscribe(_ => console.log('registered'));
  }

}
