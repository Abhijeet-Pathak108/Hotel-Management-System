import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class User {

  private email: string = '';

  setEmail(email: string) {
    localStorage.setItem('userEmail', email);
  }

  getEmail(): string {
    return localStorage.getItem('userEmail') || '';
  }
  clearEmail() {
    localStorage.removeItem('userEmail');
  }
}