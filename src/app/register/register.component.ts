import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  providers: [AuthService],
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;

  constructor(private authService: AuthService) {
    this.form = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.pattern('^\\w{6,20}$')
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$')
      ])
    });
  }

  ngOnInit(): void {
  }

  get username(): AbstractControl {
    return this.form.get('username');
  }

  get email(): AbstractControl {
    return this.form.get('email');
  }

  get password(): AbstractControl {
    return this.form.get('password');
  }

  onSubmit(): void {
    const values = this.form.value;
    this.authService.register(values.username, values.email, values.password)
      .subscribe(_ => console.log(`registered new user ${values.username}`));
  }
}
