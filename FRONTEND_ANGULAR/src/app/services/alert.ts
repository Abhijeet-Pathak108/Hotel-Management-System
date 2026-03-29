import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Alert {
  show_alert = false;
  type: 'success' | 'error' | 'warning' | 'info' = 'success';
  title = '';
  message = '';
  private timer: any;

 show(type: 'success' | 'error' | 'warning' | 'info', message: string, title?: string) {
  clearTimeout(this.timer);

  // 🔥 FORCE RESET FIRST
  this.show_alert = false;

  setTimeout(() => {
    const defaultTitles = {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info'
    };

    this.type = type;
    this.message = message;
    this.title = title || defaultTitles[type];
    this.show_alert = true;

    this.timer = setTimeout(() => this.dismiss(), 4000);
  }, 50); 
}

  dismiss() {
    this.show_alert = false;
  }
}