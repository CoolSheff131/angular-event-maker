import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { ApiService } from './api/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'event-maker';
  isLogged = false;
  display = false;

  signInLogin = new FormControl('');
  signInPassword = new FormControl('');

  signUpLogin = new FormControl('');
  signUpEmail = new FormControl('');
  signUpPassword = new FormControl('');
  signUpName = new FormControl('');
  constructor(
    private readonly primengConfig: PrimeNGConfig,
    private readonly apiService: ApiService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  onSubmitSignIn() {
    if (this.signInLogin.value === null) {
      return;
    }
    if (this.signInPassword.value === null) {
      return;
    }

    const login = this.signInLogin.value;
    const password = this.signInPassword.value;
    this.apiService.login(login, password).subscribe({
      next: (value) => {
        console.log(value);
      },
    });
  }

  onSubmitSignUp() {
    if (this.signUpLogin.value === null) {
      return;
    }
    if (this.signUpPassword.value === null) {
      return;
    }
    if (this.signUpEmail.value === null) {
      return;
    }
    if (this.signUpName.value === null) {
      return;
    }

    const login = this.signUpLogin.value;
    const password = this.signUpPassword.value;
    const email = this.signUpEmail.value;
    const name = this.signUpName.value;
    this.apiService.register(login, name, email, password).subscribe({
      next: (value) => {
        console.log(value);
      },
    });
  }

  onUserClick() {
    this.display = true;
  }
}
