import { Injectable } from '@angular/core';
import { User } from '../../assets/models/user.class';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  API_BASE_URL = 'http://127.0.0.1:8000/api/';
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
  isNotAnEmail: boolean = false;
  usernameHasSpecialChars: boolean = false;
  rememberMe: boolean = false;
  privacyPolicyAccept: boolean = false;
  inputIsEmpty: boolean = true;
  passwordVisible: boolean = false;
  passwordRegisterVisible: boolean = false;
  passwordRepeatedRegisterVisible: boolean = false;
  user: User = new User;
  privacyContent: string = '';
  imprintContent: string = '';
  loginPageActive: boolean = true;
  resetPasswordPageActive: boolean = false;
  emailRequestHasBeenSent: boolean = false;
  registerPageActive: boolean = false;
  registerPageNameActive: boolean = false;
  registerPagePasswordActive: boolean = false;
  imprintPagePasswordActive: boolean = false;
  privacyPolicyPagePasswordActive: boolean = false;
  private pageState = {
    loginPageActive: false,
    emailRequestHasBeenSent: false,
    resetPasswordPageActive: false,
    registerPageActive: false,
    registerPageNameActive: false,
    registerPagePasswordActive: false,
    imprintPagePasswordActive: false,
    privacyPolicyPagePasswordActive: false,
  };

  constructor(private router: Router, private http: HttpClient) {
    this.loadPrivacyPolicy();
    this.loadImprint();
  }

  /**
  * Navigates to the main page of the application.
  */
  loadMainPage() {
    this.router.navigate(['']);
  }

  /**
  * Loads the privacy policy content from an external HTML file.
  */
  loadPrivacyPolicy() {
    this.http.get('assets/documents/privacy-policy.html', { responseType: 'text' })
      .subscribe({
        next: data => {
          this.privacyContent = data;
        },
        error: err => {
          console.error('Fehler beim Laden der Datenschutzrichtlinie:', err);
          this.privacyContent = '<p>Fehler beim Laden der Datenschutzrichtlinie.</p>';
        }
      });
  }

  /**
  * Loads the imprint content from an external HTML file.
  */
  loadImprint() {
    this.http.get('assets/documents/imprint.html', { responseType: 'text' })
      .subscribe({
        next: data => {
          this.imprintContent = data;
        },
        error: err => {
          console.error('Fehler beim Laden des Impressum:', err);
          this.imprintContent = '<p>Fehler beim Laden der Impressum.</p>';
        }
      });
  }

  /**
  * Loads the imprint page by updating the application state.
  */
  loadImprintPage() {
    this.saveLoadedPage();
    this.resetBooleanOfContent();
    this.imprintPagePasswordActive = true;
  }

  /**
  * Loads the privacy policy page by updating the application state.
  */
  loadPrivacyPolicyPage() {
    this.saveLoadedPage();
    this.resetBooleanOfContent();
    this.privacyPolicyPagePasswordActive = true;
  }

  /**
  * Returns to the previously loaded content page.
  */
  backToContent() {
    this.resetBooleanOfContent()
    this.loadPageState();
  }

  /**
  * Saves the authenticated user data to local storage.
  */
  saveUserToLocalStorage() {
    localStorage.setItem('user', JSON.stringify({
      token: this.user.token,
      user: this.user.user,
      username: this.user.username,
      first_name: this.user.first_name,
      last_name: this.user.last_name,
      email: this.user.email
    }));
  }

  /**
  * Generates the request body for user registration.
  */
  generateBodyRegister() {
    let data = JSON.stringify({
      email: this.email,
      username: this.userName,
      first_name: this.firstName,
      last_name: this.lastName,
      password: this.passwordRegister,
      repeated_password: this.repeatedPasswordRegister
    })
    return data
  }

  /**
  * Saves the current state of active pages.
  */
  saveLoadedPage() {
    this.pageState = {
      loginPageActive: this.loginPageActive,
      emailRequestHasBeenSent: this.emailRequestHasBeenSent,
      resetPasswordPageActive: this.resetPasswordPageActive,
      registerPageActive: this.registerPageActive,
      registerPageNameActive: this.registerPageNameActive,
      registerPagePasswordActive: this.registerPagePasswordActive,
      imprintPagePasswordActive: this.imprintPagePasswordActive,
      privacyPolicyPagePasswordActive: this.privacyPolicyPagePasswordActive,
    };
  }

  /**
  * Restores the previously saved page state.
  */
  loadPageState() {
    this.loginPageActive = this.pageState.loginPageActive;
    this.emailRequestHasBeenSent = this.pageState.emailRequestHasBeenSent;
    this.resetPasswordPageActive = this.pageState.resetPasswordPageActive;
    this.registerPageActive = this.pageState.registerPageActive;
    this.registerPageNameActive = this.pageState.registerPageNameActive;
    this.registerPagePasswordActive = this.pageState.registerPagePasswordActive;
    this.imprintPagePasswordActive = this.pageState.imprintPagePasswordActive;
    this.privacyPolicyPagePasswordActive = this.pageState.privacyPolicyPagePasswordActive;
  }

  /**
  * Resets all boolean flags related to content visibility.
  */
  resetBooleanOfContent() {
    this.resetInputBoolean();
    this.loginPageActive = false;
    this.emailRequestHasBeenSent = false;
    this.resetPasswordPageActive = false;
    this.registerPageActive = false;
    this.registerPageNameActive = false;
    this.registerPagePasswordActive = false;
    this.imprintPagePasswordActive = false;
    this.privacyPolicyPagePasswordActive = false;
  }

  /**
  * Resets all input string fields to empty values.
  */
  resetInputString() {
    this.emailOrUsername = '';
    this.password = '';
    this.firstName = '';
    this.lastName = '';
    this.userName = '';
    this.email = '';
    this.passwordRegister = '';
    this.repeatedPasswordRegister = '';
    this.emailOrUsernameForget = '';
    this.wrongData = '';
  }

  /**
  * Clears validation and state tracking flags for form inputs.
  */
  resetInputBoolean() {
    this.emptyEmailOrUsername = false;
    this.emptyUserName = false;
    this.emptyEmail = false;
    this.emptyLastName = false;
    this.emptyFirstName = false;
    this.emptyPassword = false;
    this.emptyRepeatedPassword = false;
    this.emptyEmailOrUsernameForget = false;
    this.emptyPasswordRegister = false;
    this.emptyPasswordRepeatedRegister = false;
    this.isNotAnEmail = false;
    this.usernameHasSpecialChars = false;
    this.privacyPolicyAccept = false;
  }
}

