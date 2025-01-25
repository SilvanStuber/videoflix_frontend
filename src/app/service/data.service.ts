import { Injectable } from '@angular/core';
import { User } from '../../assets/models/user.class';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  API_BASE_URL = 'http://127.0.0.1:8000/api/';
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

  loadMainPage() {
    this.router.navigate(['']);
  }

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

  loadImprintPage() {
    this.saveLoadedPage();
    this.resetBooleanOfContent();
    this.imprintPagePasswordActive = true;
  }

  loadPrivacyPolicyPage() {
    this.saveLoadedPage();
    this.resetBooleanOfContent();
    this.privacyPolicyPagePasswordActive = true;
  }

  backToContent() {
    this.resetBooleanOfContent()
    this.loadPageState();
  }

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


  resetBooleanOfContent() {
    this.loginPageActive = false;
    this.emailRequestHasBeenSent = false;
    this.resetPasswordPageActive = false;
    this.registerPageActive = false;
    this.registerPageNameActive = false;
    this.registerPagePasswordActive = false;
    this.imprintPagePasswordActive = false;
    this.privacyPolicyPagePasswordActive = false;
  }
}

