import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../assets/models/user.class';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  firstName: string = '';
  lastName: string = '';
  userName: string = '';
  email: string = '';
  emailOrUsername: string = '';
  password: string = '';
  passwordRegister: string = '';
  repeatedPasswordRegister: string = '';
  emailOrUsernameForget: string = '';
  wrongData: string | undefined;
  emptyEmailOrUsername: boolean = false;
  emptyUserName: boolean = false;
  emptyEmail: boolean = false;
  emptyLastName: boolean = false;
  emptyFirstName: boolean = false;
  emptyPassword: boolean = false;
  emptyRepeatedPassword: boolean = false;
  emptyEmailOrUsernameForget: boolean = false;
  emptyPasswordRegister: boolean = false;
  emptyPasswordRepeatedRegister: boolean = false;
  rememberMe: boolean = false;
  isNotAnEmail: boolean = false;
  usernameHasSpecialChars: boolean = false;
  inputIsEmpty: boolean = true;
  passwordVisible: boolean = false;
  passwordRegisterVisible: boolean = false;
  passwordRepeatedRegisterVisible: boolean = false;

  constructor(public dataService: DataService) { }

  ngOnInit() {
    this.loadLoginData();

  }

  async login() {
    if (!this.emailOrUsername) {
      this.emptyEmailOrUsername = true;
      return;
    }
    if (!this.password) {
      this.emptyPassword = true;
      return;
    } else {
      await this.loginOnApi();
      this.handleLoginSuccess();
    }
  }

  async loginOnApi() {
    try {
      const response = await fetch(`${this.dataService.API_BASE_URL}login/`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username_or_email: this.emailOrUsername, password: this.password }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        this.wrongData = responseData.detail;
      }
      if (responseData && responseData.token) {
        this.dataService.user = new User(responseData);
        this.saveUserToLocalStorage();
      } else {
        this.wrongData = responseData.detail;
      }
    } catch (error) {
      this.wrongData = 'Ein unbekannter Fehler ist aufgetreten';
    }
  }

  saveUserToLocalStorage() {
    localStorage.setItem('user', JSON.stringify({
      token: this.dataService.user.token,
      user: this.dataService.user.user,
      username: this.dataService.user.username,
      first_name: this.dataService.user.first_name,
      last_name: this.dataService.user.last_name,
      email: this.dataService.user.email
    }));
  }

  resetErrorEmailOrUsername() {
    this.emptyEmailOrUsername = false;
    if (this.emailOrUsername !== '' && this.password !== '') {
      this.inputIsEmpty = false;
    } else {
      this.inputIsEmpty = true;
    }
  }

  resetErrorEmailOrUsernameForget() {
    this.emptyEmailOrUsernameForget = false;
    if (this.emailOrUsernameForget !== '') {
      this.inputIsEmpty = false;
    } else {
      this.inputIsEmpty = true;
    }
  }

  resetErrorPassword() {
    this.emptyPassword = false;
    if (this.emailOrUsername !== '' && this.password !== '') {
      this.inputIsEmpty = false;
    } else {
      this.inputIsEmpty = true;
    }
  }

  handleLoginSuccess() {
    if (this.rememberMe) {
      this.saveLoginData();
    } else {
      this.clearLoginData();
    }
  }

  saveLoginData() {
    localStorage.setItem('loginData', JSON.stringify({
      emailOrUsername: this.emailOrUsername,
      password: this.password
    }));
  }

  clearLoginData() {
    localStorage.removeItem('loginData');
  }

  toggleRememberMe() {
    this.rememberMe = !this.rememberMe;
  }

  loadForgetPassword() {
    this.dataService.resetBooleanOfContent();
    this.dataService.resetPasswordPageActive = true;
    this.inputIsEmpty = true;
  }

  loadLoginData() {
    let loginData = localStorage.getItem('loginData');
    if (loginData) {
      try {
        const parsedData = JSON.parse(loginData);
        this.emailOrUsername = parsedData.emailOrUsername;
        this.password = parsedData.password;
        this.toggleRememberMe();
        this.inputIsEmpty = false;
      } catch (error) {
        console.error('Fehler beim Laden der Login-Daten:', error);
      }
    }
  }


  async setForgetPassword() {
    if (!this.emailOrUsernameForget) {
      this.emptyEmailOrUsernameForget = true;
    } else {
      await this.resetPasswordRequestOnAPI();
    }
  }

  async resetPasswordRequestOnAPI() {
    try {
      const response = await fetch(`${this.dataService.API_BASE_URL}authentication/password_reset/`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_or_username: this.emailOrUsernameForget }),
      });
      const responseData = await response.json();
      this.dataService.resetBooleanOfContent();
      this.dataService.emailRequestHasBeenSent = true;
      this.resetInputString();
    } catch (error) {
      this.wrongData = 'Ein unbekannter Fehler ist aufgetreten';
    }
  }

  loadRegisterPage() {
    if (this.email !== '') {
      this.inputIsEmpty = false;
    } else {
      this.inputIsEmpty = true;
    }
    this.dataService.resetBooleanOfContent();
    this.dataService.registerPageActive = true;
  }

  backToSigInPage() {
    this.dataService.resetBooleanOfContent();
    this.loadLoginData();
    if (this.emailOrUsername !== '' && this.password !== '') {
      this.inputIsEmpty = false;
    } else {
      this.inputIsEmpty = true;
    }
    this.dataService.loginPageActive = true;
    this.toggleRememberMe();
  }

  switchToNamePage() {
    this.inputIsEmpty = true;
    this.isNotAnEmail = false
    this.dataService.resetBooleanOfContent();
    this.dataService.registerPageNameActive = true;
  }

  switchToPasswordPage() {
    if (this.firstName === '') {
      this.emptyFirstName = true;
    } else if (this.lastName === '') {
      this.emptyLastName = true;
    } else if (this.userName === '') {
      this.emptyUserName = true;
    } else if (/[^a-zA-Z0-9]/.test(this.userName)) {
      this.usernameHasSpecialChars = true;
    } else {
      this.inputIsEmpty = true;
      this.dataService.resetBooleanOfContent();
      this.dataService.registerPagePasswordActive = true;
    }
  }

  resetEmailEmptyError() {
    if (this.email !== '') {
      this.emptyEmail = false;
      this.isNotAnEmail = false;
      this.inputIsEmpty = false;
    } else {
      this.emptyEmail = true;
      this.inputIsEmpty = true;
    }
  }

  resetErrorFirstName() {
    if (this.firstName !== '') {
      this.emptyFirstName = false;
    } else {
      this.emptyFirstName = true;
    }
    if (this.firstName !== '' && this.lastName !== '' && this.userName !== '') {
      this.inputIsEmpty = false;
    } else {
      this.inputIsEmpty = true;
    }
  }

  resetErrorLastName() {
    if (this.lastName !== '') {
      this.emptyLastName = false;
    } else {
      this.emptyLastName = true;
    }
    if (this.firstName !== '' && this.lastName !== '' && this.userName !== '') {
      this.inputIsEmpty = false;
    } else {
      this.inputIsEmpty = true;
    }
  }

  resetErrorUsername() {
    if (this.userName !== '') {
      this.emptyUserName = false;
      if (/[^a-zA-Z0-9]/.test(this.userName)) {
        this.usernameHasSpecialChars = true;
      } else {
        this.usernameHasSpecialChars = false;
      }
    } else {
      this.emptyUserName = true;
    }
    if (this.firstName !== '' && this.lastName !== '' && this.userName !== '') {
      this.inputIsEmpty = false;
    } else {
      this.inputIsEmpty = true;
    }
  }

  resetErrorPasswordRegister() {
    this.emptyPasswordRegister = false;
    if (this.passwordRegister !== '' && this.repeatedPasswordRegister !== '') {
      this.inputIsEmpty = false;
    } else {
      this.inputIsEmpty = true;
    }
  }

  resetErrorPasswordRepeatedRegister() {
    this.emptyPasswordRepeatedRegister = false;
    if (this.passwordRegister !== '' && this.repeatedPasswordRegister !== '' && this.passwordRegister === this.repeatedPasswordRegister) {
      this.inputIsEmpty = false;
    } else {
      this.inputIsEmpty = true;
      this.emptyPasswordRepeatedRegister = true;
    }
  }

  backNameRegisterPage() {
    if (this.firstName !== '' && this.lastName !== '' && this.userName !== '') {
      this.inputIsEmpty = false;
    } else {
      this.inputIsEmpty = true;
    }
    this.dataService.resetBooleanOfContent();
    this.dataService.registerPageNameActive = true;
  }

  resetInputString() {
    this.emailOrUsername = '';
    this.password = '';
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  togglePasswordVisibilityRegister() {
    this.passwordRegisterVisible = !this.passwordRegisterVisible;
  }

  togglePasswordRepeatedVisibilityRegister() {
    this.passwordRepeatedRegisterVisible = !this.passwordRepeatedRegisterVisible;
  }

  register() {
    if (this.passwordRegister === this.repeatedPasswordRegister) {
      this.registerUserOnAPI();
    } else {
      this.emptyPasswordRepeatedRegister = true;
    }
  }

  async registerUserOnAPI() {
    try {
      const response = await fetch(`${this.dataService.API_BASE_URL}authentication/registration/`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: this.email,
          username: this.userName,
          first_name: this.firstName,
          last_name: this.lastName,
          password: this.passwordRegister,
          repeated_password: this.repeatedPasswordRegister
        }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        this.wrongData = "Ein Benutzer mit diesem Benutzernamen oder E-Mail existiert bereits.";
      } else {
        this.dataService.resetBooleanOfContent();
        this.dataService.emailRequestHasBeenSent = true;
        this.resetInputString();
      }
    } catch (error) {
      this.wrongData = 'Ein unbekannter Fehler ist aufgetreten';
    }
  }
}
