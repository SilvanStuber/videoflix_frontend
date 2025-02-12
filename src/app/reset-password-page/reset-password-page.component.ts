import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../service/data.service';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password-page.component.html',
  styleUrl: './reset-password-page.component.scss'
})
export class ResetPasswordPageComponent {
  input: boolean = false;

  constructor(private route: ActivatedRoute, public apiService: ApiService, public dataService: DataService,) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.dataService.uid = params['uid'];
      this.dataService.token = params['token'];
    });
  }

  async setNewPassword() {
    if (!this.dataService.password) {
      this.dataService.emptyPassword = true;
      return;
    }
    if (this.dataService.password !== this.dataService.repeatedPassword) {
      this.dataService.emptyRepeatedPassword = true;
      return;
    } else {
      await this.apiService.setNewPasswordOnApi();
    }
  }



  resetErrorPassword() {
    this.input = true;
    if (this.dataService.password !== '') {
      this.dataService.emptyPassword = false;
    } else {
      this.dataService.emptyPassword = true;
    }
    if (this.dataService.repeatedPassword === this.dataService.password) {
      this.dataService.emptyRepeatedPassword = false;
    } else {
      this.dataService.emptyRepeatedPassword = true;
    }
  }

  resetErrorRepeatedPassword() {
    this.input = true;
    if (this.dataService.repeatedPassword === this.dataService.password) {
      this.dataService.emptyRepeatedPassword = false;
    } else {
      this.dataService.emptyRepeatedPassword = true;
    }
  }

  toggleResetPasswordVisibility() {
    this.dataService.passwordResetVisible = !this.dataService.passwordResetVisible;
  }

  toggleResetPasswordRepeatedVisibility() {
    this.dataService.passwordRepeatedResetVisible = !this.dataService.passwordRepeatedResetVisible;
  }
}
