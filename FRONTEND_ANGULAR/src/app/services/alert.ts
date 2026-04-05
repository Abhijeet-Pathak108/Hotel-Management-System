import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Alert {

  show_alert = signal(false);
  type = signal<'success' | 'error' | 'warning' | 'info'>('success');
  title = signal('');
  message = signal('');
  private timer: any;

  show(type: 'success' | 'error' | 'warning' | 'info', message: string, title?: string) {
    clearTimeout(this.timer);
    this.show_alert.set(false);

    setTimeout(() => {
      const defaultTitles = {
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Info'
      };

      this.type.set(type);
      this.message.set(message);
      this.title.set(title || defaultTitles[type]);
      this.show_alert.set(true);

      this.timer = setTimeout(() => this.dismiss(), 4000);
    }, 50);
  }

  dismiss() {
    this.show_alert.set(false);
  }
}