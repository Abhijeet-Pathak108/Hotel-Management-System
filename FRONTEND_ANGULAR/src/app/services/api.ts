import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


export interface AuthRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})

export class Api {

  // private baseUrl = 'https://hotel-management-system-7gqa.onrender.com/';
  private baseUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) {}

  getHome(){
    return this.http.get(this.baseUrl + '/home', { responseType: 'text' });
  }

  doLogin(request: AuthRequest){
    return this.http.post(
      this.baseUrl + 'auth/login',
      request,
      {
        withCredentials: true // if using cookies/session
      }
    );
  }

  doRegister(request: any){
    return this.http.post(this.baseUrl + 'auth/register', request);
  }

  createBooking(amount: number){
    const token = localStorage.getItem('token');
    return this.http.post(this.baseUrl + 'auth/create-booking', { amount: amount },{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  verifyPayment(paymentData: any){
    const token = localStorage.getItem('token');
    return this.http.post(this.baseUrl + 'auth/verify-payment', paymentData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  updateProfile(profileData: any){
    const token = localStorage.getItem('token');
    console.log("Token is:",token);
    
    return this.http.post<any>(this.baseUrl + 'user/updateDetails', profileData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getUserData(email: string) {
  const token = localStorage.getItem('token');

  return this.http.post<any>(
    this.baseUrl + 'user/getUserData',
    email, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
}

  saveBooking(data: any) {
    const token = localStorage.getItem('token');
    return this.http.post(this.baseUrl + 'booking/saveBooking', data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  completeBooking(email: string) {
    const token = localStorage.getItem('token');
    return this.http.post(this.baseUrl + 'booking/completedBooking',{email}, {
      headers: {  
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  allBookings(email: string) {
    const token = localStorage.getItem('token');
    return this.http.post(this.baseUrl + 'booking/allBookings',{email}, {
      headers: {  
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  ongoingBookings(email: string) {
    const token = localStorage.getItem('token');
    return this.http.post(this.baseUrl + 'booking/ongoingBookings',{email}, {
      headers: {  
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }
  
  deleteAccount(email: string) {
    const token = localStorage.getItem('token');
    return this.http.post(this.baseUrl + 'user/deleteAccount',{email}, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  upcomingBookings(email: string) {
    const token = localStorage.getItem('token');
    return this.http.post(this.baseUrl + 'booking/upcomingBookings',{email}, {
      headers: {  
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

    // 📩 SEND OTP (FORGOT PASSWORD)
  sendOtp(email: string) {
    return this.http.post(this.baseUrl + 'password/forgot-password', { email: email },
      {responseType: 'text'}
    );
  }

  // 🔢 VERIFY OTP
  verifyOtp(email: string, otp: string) {
    return this.http.post(this.baseUrl + 'password/verify-otp', {
      email: email,
      otp: otp
    },{responseType: 'text'});
  }

  // 🔑 RESET PASSWORD
  resetPassword(email: string, newPassword: string, confirmPassword: string) {
    return this.http.post(this.baseUrl + 'password/reset-password', {
      email: email,
      newPassword: newPassword,
      confirmPassword: confirmPassword
    },{responseType: 'text'});
  }

}
