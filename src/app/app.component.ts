import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { Observable } from 'rxjs';
import { ApiService } from './api/api.service';
import { Group } from './api/interfaces/group.interface';
import { User } from './api/interfaces/user.interface';
import { GroupService } from './pages/admin/services/group.service';
import { UserService } from './pages/admin/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'event-maker';
  loginStatus: 'waiting' | 'success' | 'error' | 'pending' = 'waiting';

  display = false;
  authForm = false;

  signInForm = new FormGroup({
    signInLogin: new FormControl<string>('', [Validators.required]),
    signInPassword: new FormControl<string>('', [Validators.required]),
  });

  signUpForm = new FormGroup({
    signUpLogin: new FormControl<string>('', [Validators.required]),
    signUpEmail: new FormControl<string>('', [Validators.required]),
    signUpPassword: new FormControl<string>('', [Validators.required]),
    signUpName: new FormControl<string>('', [Validators.required]),
    userGroupControl: new FormControl<Group | null>(null, [
      Validators.required,
    ]),
  });

  openAuth() {
    this.authForm = true;
  }

  groups: Group[] = [];

  authedUser: User | undefined;

  constructor(
    private readonly primengConfig: PrimeNGConfig,
    private readonly userService: UserService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly groupService: GroupService
  ) {
    userService.authedUser$.subscribe((user) => {
      console.log(user);
      this.authedUser = user;
    });
    userService.loginStatus$.subscribe((status) => {
      this.loginStatus = status;
    });
    groupService.groups$.subscribe((groups) => {
      this.groups = groups;
    });

    groupService.getGroups();
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    console.log(this.authedUser);
  }

  get isLogged() {
    return Boolean(this.authedUser);
  }

  onSubmitSignIn() {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    const login = this.signInForm.controls.signInLogin.value!;
    const password = this.signInForm.controls.signInPassword.value!;
    this.userService.login(login, password);
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  onSubmitSignUp() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    const login = this.signUpForm.controls.signUpLogin.value!;
    const password = this.signUpForm.controls.signUpPassword.value!;
    const email = this.signUpForm.controls.signUpEmail.value!;
    const name = this.signUpForm.controls.signUpName.value!;
    const group = this.signUpForm.controls.userGroupControl.value!;
    this.userService.register(login, group, name, email, password);
  }

  onUserClick() {
    this.display = true;
  }

  unauthorize() {
    this.userService.unauthorizeUser();
  }
}
