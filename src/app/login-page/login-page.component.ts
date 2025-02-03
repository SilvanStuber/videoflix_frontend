import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../assets/models/user.class';
import { DataService } from '../service/data.service';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

  constructor(public dataService: DataService, public apiService: ApiService, private router: Router) { }

  /**
   * Initializes the component by loading login data.
   */
  ngOnInit() {
    this.loadLoginData();
  }

  /**
  * Handles the login process by validating input fields.
  */
  async login() {
    if (!this.dataService.emailOrUsername) {
      this.dataService.emptyEmailOrUsername = true;
      return;
    }
    if (!this.dataService.password) {
      this.dataService.emptyPassword = true;
      return;
    } else {
      await this.apiService.loginOnApi();
      this.handleLoginSuccess();
    }
  }

  /**
   * Resets the email or username error flag.
   */
  resetErrorEmailOrUsername() {
    this.dataService.emptyEmailOrUsername = false;
    if (this.dataService.emailOrUsername !== '' && this.dataService.password !== '') {
      this.dataService.inputIsEmpty = false;
    } else {
      this.dataService.inputIsEmpty = true;
    }
  }

  /**
   * Resets the email or username error flag for the password reset process.
   */
  resetErrorEmailOrUsernameForget() {
    this.dataService.emptyEmailOrUsernameForget = false;
    if (this.dataService.emailOrUsernameForget !== '') {
      this.dataService.inputIsEmpty = false;
    } else {
      this.dataService.inputIsEmpty = true;
    }
  }

  /**
   * Resets the password error flag.
   */
  resetErrorPassword() {
    this.dataService.emptyPassword = false;
    if (this.dataService.emailOrUsername !== '' && this.dataService.password !== '') {
      this.dataService.inputIsEmpty = false;
    } else {
      this.dataService.inputIsEmpty = true;
    }
  }

  /**
   * Handles actions after a successful login.
   */
  handleLoginSuccess() {
    if (this.dataService.rememberMe) {
      this.saveLoginData();
    } else {
      this.clearLoginData();
    }
  }

  /**
  * Saves login credentials to local storage.
  */
  saveLoginData() {
    localStorage.setItem('loginData', JSON.stringify({
      emailOrUsername: this.dataService.emailOrUsername,
      password: this.dataService.password
    }));
  }

  /**
   * Clears saved login credentials from local storage.
   */
  clearLoginData() {
    localStorage.removeItem('loginData');
  }

  /**
   * Toggles the 'remember me' option.
   */
  toggleRememberMe() {
    this.dataService.rememberMe = !this.dataService.rememberMe;
  }

  /**
   * Toggles the acceptance of the privacy policy.
   */
  togglePrivacyPolicy() {
    this.dataService.privacyPolicyAccept = !this.dataService.privacyPolicyAccept;
  }

  /**
   * Activates the password reset page.
   */
  loadForgetPassword() {
    this.dataService.resetBooleanOfContent();
    this.dataService.resetInputString();
    this.dataService.resetPasswordPageActive = true;
    this.dataService.inputIsEmpty = true;
  }

  /**
   * Loads stored login data from local storage.
   */
  loadLoginData() {
    let loginData = localStorage.getItem('loginData');
    if (loginData) {
      try {
        const parsedData = JSON.parse(loginData);
        this.dataService.emailOrUsername = parsedData.emailOrUsername;
        this.dataService.password = parsedData.password;
        this.toggleRememberMe();
        this.dataService.inputIsEmpty = false;
      } catch (error) {
        console.error('Fehler beim Laden der Login-Daten:', error);
      }
    }
  }

  /**
   * Loads stored login credentials from local storage.
   */
  async setForgetPassword() {
    if (!this.dataService.emailOrUsernameForget) {
      this.dataService.emptyEmailOrUsernameForget = true;
    } else {
      await this.resetPasswordRequestOnAPI();
    }
  }

  /**
   * Sends a password reset request to the API.
   */
  async resetPasswordRequestOnAPI() {
    try {
      const response = await fetch(`${this.dataService.API_BASE_URL}authentication/password_reset/`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_or_username: this.dataService.emailOrUsernameForget }),
      });
      const responseData = await response.json();
      this.dataService.resetBooleanOfContent();
      this.dataService.emailRequestHasBeenSent = true;
      this.dataService.resetInputString();
    } catch (error) {
      this.dataService.wrongData = 'Ein unbekannter Fehler ist aufgetreten';
    }
  }

  /**
   * Loads the registration page and updates input validation status.
   */
  loadRegisterPage() {
    if (this.dataService.email !== '') {
      this.dataService.inputIsEmpty = false;
    } else {
      this.dataService.inputIsEmpty = true;
    }
    this.dataService.resetBooleanOfContent();
    this.dataService.registerPageActive = true;
  }

  /**
   * Navigates back to the sign-in page.
   */
  backToSigInPage() {
    this.dataService.resetBooleanOfContent();
    this.loadLoginData();
    if (this.dataService.emailOrUsername !== '' && this.dataService.password !== '') {
      this.dataService.inputIsEmpty = false;
    } else {
      this.dataService.inputIsEmpty = true;
    }
    this.dataService.loginPageActive = true;
    this.toggleRememberMe();
  }

  /**
   * Validates the email format and switches to the name input page.
   */
  switchToNamePage() {
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(this.dataService.email)) {
      this.dataService.inputIsEmpty = true;
      this.dataService.isNotAnEmail = false;
      this.dataService.resetBooleanOfContent();
      this.dataService.registerPageNameActive = true;
    } else {
      this.dataService.isNotAnEmail = true;
    }
  }

  /**
  * Validates the email format and navigates to the name input page.
  */
  switchToPasswordPage() {
    if (this.dataService.firstName === '') {
      this.dataService.emptyFirstName = true;
    } else if (this.dataService.lastName === '') {
      this.dataService.emptyLastName = true;
    } else if (this.dataService.userName === '') {
      this.dataService.emptyUserName = true;
    } else if (/[^a-zA-Z0-9]/.test(this.dataService.userName)) {
      this.dataService.usernameHasSpecialChars = true;
    } else {
      this.dataService.inputIsEmpty = true;
      this.dataService.resetBooleanOfContent();
      this.dataService.registerPagePasswordActive = true;
    }
  }

  /**
  * Resets the email empty error flag and updates input validation state.
  */
  resetEmailEmptyError() {
    if (this.dataService.email !== '') {
      this.dataService.emptyEmail = false;
      this.dataService.isNotAnEmail = false;
      this.dataService.inputIsEmpty = false;
    } else {
      this.dataService.emptyEmail = true;
      this.dataService.inputIsEmpty = true;
    }
  }

  /**
  * Resets the first name error flag and checks input completeness.
  */
  resetErrorFirstName() {
    if (this.dataService.firstName !== '') {
      this.dataService.emptyFirstName = false;
    } else {
      this.dataService.emptyFirstName = true;
    }
    if (this.dataService.firstName !== '' && this.dataService.lastName !== '' && this.dataService.userName !== '') {
      this.dataService.inputIsEmpty = false;
    } else {
      this.dataService.inputIsEmpty = true;
    }
  }

  /**
  * Resets the last name error flag and checks input completeness.
  */
  resetErrorLastName() {
    if (this.dataService.lastName !== '') {
      this.dataService.emptyLastName = false;
    } else {
      this.dataService.emptyLastName = true;
    }
    if (this.dataService.firstName !== '' && this.dataService.lastName !== '' && this.dataService.userName !== '') {
      this.dataService.inputIsEmpty = false;
    } else {
      this.dataService.inputIsEmpty = true;
    }
  }

  /**
  * Resets the last name error flag and checks input completeness.
  */
  resetErrorUsername() {
    if (this.dataService.userName !== '') {
      this.dataService.emptyUserName = false;
      if (/[^a-zA-Z0-9]/.test(this.dataService.userName)) {
        this.dataService.usernameHasSpecialChars = true;
      } else {
        this.dataService.usernameHasSpecialChars = false;
      }
    } else {
      this.dataService.emptyUserName = true;
    }
    if (this.dataService.firstName !== '' && this.dataService.lastName !== '' && this.dataService.userName !== '') {
      this.dataService.inputIsEmpty = false;
    } else {
      this.dataService.inputIsEmpty = true;
    }
  }

  /**
  * Resets the password registration error flag and checks input completeness..
  */
  resetErrorPasswordRegister() {
    this.dataService.emptyPasswordRegister = false;
    if (this.dataService.passwordRegister !== '' && this.dataService.repeatedPasswordRegister !== '') {
      this.dataService.inputIsEmpty = false;
    } else {
      this.dataService.inputIsEmpty = true;
    }
  }

  /**
  * Resets the repeated password registration error flag and checks input validity.
  */
  resetErrorPasswordRepeatedRegister() {
    this.dataService.emptyPasswordRepeatedRegister = false;
    if (this.dataService.passwordRegister !== '' && this.dataService.repeatedPasswordRegister !== '' && this.dataService.passwordRegister === this.dataService.repeatedPasswordRegister) {
      this.dataService.inputIsEmpty = false;
    } else {
      this.dataService.inputIsEmpty = true;
      this.dataService.emptyPasswordRepeatedRegister = true;
    }
  }

  /**
  * Navigates back to the name registration page.
  */
  backNameRegisterPage() {
    if (this.dataService.firstName !== '' && this.dataService.lastName !== '' && this.dataService.userName !== '') {
      this.dataService.inputIsEmpty = false;
    } else {
      this.dataService.inputIsEmpty = true;
    }
    this.dataService.resetBooleanOfContent();
    this.dataService.registerPageNameActive = true;
  }

  /**
  * Toggles the visibility of the password input field.
  */
  togglePasswordVisibility() {
    this.dataService.passwordVisible = !this.dataService.passwordVisible;
  }

  /**
  * Toggles the visibility of the registration password input field.
  */
  togglePasswordVisibilityRegister() {
    this.dataService.passwordRegisterVisible = !this.dataService.passwordRegisterVisible;
  }

  /**
  * Toggles the visibility of the repeated password input field during registration.
  */
  togglePasswordRepeatedVisibilityRegister() {
    this.dataService.passwordRepeatedRegisterVisible = !this.dataService.passwordRepeatedRegisterVisible;
  }

  /**
  * Initiates the user registration process.
  */
  register() {
    if (this.dataService.passwordRegister === this.dataService.repeatedPasswordRegister) {
      this.registerUserOnAPI();
    } else {
      this.dataService.emptyPasswordRepeatedRegister = true;
    }
  }

  /**
  * Handles the user registration process.
  */
  async registerUserOnAPI() {
    try {
      const response = await fetch(`${this.dataService.API_BASE_URL}authentication/registration/`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: this.dataService.generateBodyRegister(),
      });
      const responseData = await response.json();
      if (!response.ok) {
        this.dataService.wrongData = "Ein Benutzer mit diesem Benutzernamen oder E-Mail existiert bereits.";
      } else {
        this.dataService.resetBooleanOfContent();
        this.dataService.emailRequestHasBeenSent = true;
        this.dataService.resetInputString();
      }
    } catch (error) {
      this.dataService.wrongData = 'Ein unbekannter Fehler ist aufgetreten';
    }
  }
}
