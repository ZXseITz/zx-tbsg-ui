import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  providers: [AuthService],
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  private formSubmitAttempt: boolean;

  constructor(private authService: AuthService) {
    this.formSubmitAttempt = false;
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
        Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,20}$')
      ])
    });
  }

  ngOnInit(): void {
  }

  isFieldInvalid(name: string): boolean {
    return this.formSubmitAttempt && !this.form.get(name).valid;
  }

  onSubmit(): void {
    this.formSubmitAttempt = true;
    if (this.form.valid) {
      const values = this.form.value;
      this.authService.register(values.username, values.email, values.password)
        .subscribe(_ => console.log(`registered new user ${values.username}`));
    }
  }
}
