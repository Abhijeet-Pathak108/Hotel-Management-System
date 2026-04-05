import { Component, signal, OnInit, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Api } from './services/api';
import { LandingPage } from './landing-page/landing-page';
import { Alert as AlertService } from './services/alert';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Alert } from './services/alert';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LandingPage, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('FRONTEND_ANGULAR');

  message = signal('Loading...');


  alertData = {
    show: false,
    type: '',
    message: ''
  };

  constructor(private api: Api, public alertService: AlertService,
    private cdr: ChangeDetectorRef,
  ) { }

  // dismissAlert() {
  //   this.alertService.dismiss();
  //   this.cdr.detectChanges();
  // }

  ngDoCheck() {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.api.getHome().subscribe({
      next: (res) => {
        console.log("response from backend: ", res);
        this.message.set(res);
        console.log(this.message);

      },
      error: (err) => {
        this.message.set("Error while fetching message");
      }
    })

  }
}
