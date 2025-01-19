import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../assets/models/user.class';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, CommonModule,],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  emailOrUsername: string = '';
  password: string = '';
  wrongData: string | undefined;


  constructor(public dataService: DataService,) { }

  async login() {
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

}
