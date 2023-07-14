import { Component } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';

interface FormData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private authService: AuthService) {}

  handleSubmit(formValue: FormData) {
    this.authService.login(formValue.email, formValue.password);
  }
}
