import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password-page.component.html',
  styleUrl: './reset-password-page.component.scss'
})
export class ResetPasswordPageComponent {
  uid: string | null = null;
  token: string | null = null;
  password: string = '';
  repeatedPassword: string = '';
  wrongData: string | undefined;
  emptyPassword: boolean = false;
  emptyRepeatedPassword: boolean = false;
  passwordResetVisible: boolean = false;
  passwordRepeatedResetVisible: boolean = false;

  constructor(private route: ActivatedRoute, public dataService: DataService,) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.uid = params['uid'];
      this.token = params['token'];
    });
  }

  async setNewPassword() {
    if (!this.password) {
      this.emptyPassword = true;
      return;
    }
    if (this.password !== this.repeatedPassword) {
      this.emptyRepeatedPassword = true;
      return;
    } else {
      await this.setNewPasswordOnApi();
    }
  }

  async setNewPasswordOnApi() {
    try {
      const response = await fetch(`${this.dataService.API_BASE_URL}authentication/password_reset_confirm/${this.uid}/${this.token}/`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: this.password, repeated_password: this.repeatedPassword }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        this.wrongData = responseData.detail;
      } else {
        this.dataService.loadMainPage()
      }
    } catch (error) {
      this.wrongData = 'Ein unbekannter Fehler ist aufgetreten';
    }
  }

  resetErrorPassword() {
    this.emptyPassword = false;
  }

  resetErrorRepeatedPassword() {
    this.emptyPassword = false;
  }

  toggleResetPasswordVisibility() {
    this.passwordResetVisible = !this.passwordResetVisible;
  }

  toggleResetPasswordRepeatedVisibility() {
    this.passwordRepeatedResetVisible = !this.passwordRepeatedResetVisible;
  }
}
