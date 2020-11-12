import {Component, OnInit} from '@angular/core';
import {User} from '../user';
import {UserService} from '../user.service';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  user: User;

  constructor(private userService: UserService) {
    this.user = {
      username: undefined,
      email: undefined,
    };
  }

  ngOnInit(): void {
    const userid = localStorage.getItem('userid');
    this.getUser(userid);
  }

  getUser(userid: string): void {
    this.userService.loadUser(userid)
      .subscribe(usr => this.user = usr);
  }
}
