import { Injectable } from '@angular/core';
import { User } from '../../assets/models/user.class';
import { Viewer } from '../../assets/models/viewers.class';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  API_BASE_URL = 'http://127.0.0.1:8000/api/';
  API_VIDEO_URL = 'http://127.0.0.1:8000';
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
  viewers: Viewer[] = [];
  singleViewer: Viewer = new Viewer();
  viewername: String = '';
  emptyViewername: Boolean = false;
  inputIsEmty: Boolean = true;
  randomImgPath: String = '';
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
  availableImages = [
    "/assets/img/avatar-1.png",
    "/assets/img/avatar-2.png",
    "/assets/img/avatar-3.png",
    "/assets/img/avatar-4.jpg",
    "/assets/img/avatar-5.jpg",
    "/assets/img/avatar-6.png",
    "/assets/img/avatar-7.jpg",
    "/assets/img/avatar-8.jpg",
    "/assets/img/avatar-9.jpg",
    "/assets/img/avatar-10.jpg"
  ];

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
  * Navigates to the view page of the application.
  */
  loadViwerPage() {
    this.router.navigate(['/viewer-page']);
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
    if (this.user.token) {
      this.loadViwerPage();
    }
  }

  /**
  * Loads the authenticated user data from local storage and initializes the user object.
  */
  loadUserFromLocalStorage() {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        this.user = new User();
        this.user.token = parsedUser.token || '';
        this.user.user = parsedUser.user || '';
        this.user.username = parsedUser.username || '';
        this.user.first_name = parsedUser.first_name || '';
        this.user.last_name = parsedUser.last_name || '';
        this.user.email = parsedUser.email || '';
      } catch (error) {
        console.error('Error parsing user data from local storage:', error);
      }
    } else {
      console.warn('No user data found in local storage.');
    }
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

  /**
* Sets a random image path from available images, excluding used ones.
* Removes assigned images from the available list.
*/
  setRandomImagePath() {
    if (this.viewers && Array.isArray(this.viewers)) {
      this.viewers.forEach(viewer => {
        if (viewer.picture_file && this.availableImages.includes(viewer.picture_file)) {
          const index = this.availableImages.indexOf(viewer.picture_file);
          if (index !== -1) {
            this.availableImages.splice(index, 1);
          }
        }
      });
    }
    const randomIndex = Math.floor(Math.random() * this.availableImages.length);
    this.randomImgPath = this.availableImages[randomIndex];
  }

  /**
* Resets viewer name error states based on the input value.
* Updates flags for empty input validation.
*/
  resetErrorViewername() {
    if (this.viewername !== '') {
      this.emptyViewername = false;
      this.inputIsEmty = false;
    } else {
      this.emptyViewername = true;
      this.inputIsEmty = true;
    }
  }
}

