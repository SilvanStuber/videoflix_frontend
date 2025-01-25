import { Injectable } from '@angular/core';
import { User } from '../../assets/models/user.class';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  API_BASE_URL = 'http://127.0.0.1:8000/api/';
  user: User = new User;
  constructor(private router: Router) { }

  loadMainPage() {
    this.router.navigate(['']);
  }
}

