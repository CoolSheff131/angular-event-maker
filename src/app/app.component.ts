import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ConfirmationService,
  MessageService,
  PrimeNGConfig,
} from 'primeng/api';
import {
  distinctUntilChanged,
  map,
  merge,
  Observable,
  skipWhile,
  take,
} from 'rxjs';
import { ApiService, ResponceStatus } from './api/api.service';
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
  loginStatus: ResponceStatus = 'none';

  display = false;
  authForm = false;

  signInForm = new FormGroup({
    signInLogin: new FormControl<string>('', [Validators.required]),
    signInPassword: new FormControl<string>('', [Validators.required]),
  });

  signUpForm = new FormGroup({
    login: new FormControl<string>('', [Validators.required]),
    email: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required]),
    name: new FormControl<string>('', [Validators.required]),
    group: new FormControl<Group | null>(null, [Validators.required]),
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
    private readonly groupService: GroupService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService
  ) {
    userService.authedUser$.subscribe((user) => {
      this.authedUser = user;
    });
    userService.loginReponce$.subscribe((status) => {
      this.loginStatus = status;
    });
    groupService.groups$.subscribe((groups) => {
      this.groups = groups;
    });

    groupService.getGroups();

    merge(this.userService.registerReponce$)
      .pipe(
        distinctUntilChanged(),
        map((status) => status === 'pending')
      )
      .subscribe((isDisabled) => {
        if (isDisabled) {
          this.signUpForm.disable();
        } else {
          this.signUpForm.enable();
        }
      });
    merge(this.userService.loginReponce$)
      .pipe(
        distinctUntilChanged(),
        map((status) => status === 'pending')
      )
      .subscribe((isDisabled) => {
        if (isDisabled) {
          this.signInForm.disable();
        } else {
          this.signInForm.enable();
        }
      });
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
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
    this.userService.loginReponce$
      .pipe(
        skipWhile((responce) => responce === 'pending'),
        take(1)
      )
      .subscribe((responce) => {
        if (responce === 'success') {
          this.authForm = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Вы вошли в систему',
          });
        }
      });
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  onSubmitSignUp() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    const {
      login: signUpLogin,
      email: signUpEmail,
      name: signUpName,
      password: signUpPassword,
      group: userGroupControl,
    } = this.signUpForm.value;

    this.userService.register(
      signUpLogin!,
      userGroupControl!,
      signUpName!,
      signUpEmail!,
      signUpPassword!
    );

    this.userService.registerReponce$
      .pipe(
        skipWhile((responce) => responce === 'pending'),
        take(1)
      )
      .subscribe((responce) => {
        if (responce === 'success') {
          this.authForm = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Вы зарегестрировались в системе',
          });
        }
      });
  }

  unauthorize() {
    this.confirmationService.confirm({
      message: 'Вы действительно хотите выйти из аккаунта?',
      accept: () => {
        this.userService.unauthorizeUser();

        this.messageService.add({
          severity: 'success',
          summary: 'Вы вышли из аккаунта',
        });
      },
    });
  }
}
