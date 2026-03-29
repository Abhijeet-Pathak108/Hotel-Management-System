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

  private baseUrl = 'http://localhost:8090/auth';

  constructor(private http: HttpClient) {}

  getHome(){
    return this.http.get(this.baseUrl + '/home', { responseType: 'text' });
  }

  doLogin(request: AuthRequest){
    return this.http.post(
      this.baseUrl + '/login',
      request,
      {
        withCredentials: true // if using cookies/session
      }
    );
  }

  doRegister(request: any){
    return this.http.post(this.baseUrl + '/register', request);
  }

}
