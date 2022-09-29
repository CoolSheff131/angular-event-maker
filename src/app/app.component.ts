import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { Observable } from 'rxjs';
import { ApiService } from './api/api.service';
import { User } from './api/interfaces/user.interface';
import { UserService } from './pages/admin/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'event-maker';

  display = false;

  signInLogin = new FormControl('');
  signInPassword = new FormControl('');

  signUpLogin = new FormControl('');
  signUpEmail = new FormControl('');
  signUpPassword = new FormControl('');
  signUpName = new FormControl('');

  authedUser: User | undefined;

  constructor(
    private readonly primengConfig: PrimeNGConfig,
    private readonly userService: UserService
  ) {
    userService.authedUser$.subscribe((user) => {
      console.log(user);
      this.authedUser = user;
    });
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    console.log(this.authedUser);
  }

  get isLogged() {
    return Boolean(this.authedUser);
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
    this.userService.login(login, password);
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
    this.userService.register(login, name, email, password);
  }

  onUserClick() {
    this.display = true;
  }

  unauthorize() {
    this.userService.unauthorizeUser();
  }
}
