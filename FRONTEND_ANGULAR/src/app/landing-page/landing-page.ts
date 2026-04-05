import { Component, OnInit, HostListener, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Api } from '../services/api';
import { ChangeDetectorRef } from '@angular/core';
import { Alert as AlertService } from '../services/alert';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { User } from '../services/user';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage implements OnInit {

  constructor(private api: Api,
    private cdr: ChangeDetectorRef,
    public alertService: AlertService,
    private router: Router,
    private titleService: Title,
    private ngZone: NgZone,
    private userService: User
  ) { }

  // Navbar state
  isScrolled = false;
  menuOpen = false;

  // Modal state
  showLoginModal = false;
  showRegisterModal = false;

  // Login form data
  loginData = {
    email: '',
    password: ''
  };

  // Register form data
  registerData = {
    name: '',
    email: '',
    mobileno: '',
    password: ''
  };

  showPassword = false;


  ngOnInit(): void {
    this.titleService.setTitle('Grand Horizon - Welcome');
    this.alertService.dismiss();
  }

  showRoomModal = false;
  selectedRoom: any = null;

  rooms: any = [
    {
      image: 'services/classic-room.jpg',
      badge: 'Most Popular', badgeClass: '',
      type: 'Classic Room', name: 'Horizon Classic',
      rating: '★★★★★',
      desc: 'A serene retreat featuring plush king-size bedding, city-view windows, and hand-selected furnishings with modern amenities.',
      amenities: ['🛏 King Bed', '📶 Free WiFi', '🌆 City View', '❄️ AC'],
      price: '₹8,500',
      size: '320 sq ft',
      occupancy: '2 Adults',
    },
    {
      image: 'services/delux-room.jpg',
      badge: 'Featured', badgeClass: 'gold-badge',
      type: 'Deluxe Room', name: 'Grand Deluxe',
      rating: '★★★★★',
      desc: 'Expansive interiors with panoramic skyline views, a private lounge area, premium minibar, and signature Grand Horizon turndown service.',
      amenities: ['🛏 King Bed', '🌅 Skyline View', '🛁 Jacuzzi', '🥂 Minibar'],
      price: '₹14,000',
      size: '320 sq ft',
      occupancy: '2 Adults',
    },
    {
      image: 'services/executive-suite.jpg',
      badge: '', badgeClass: '',
      type: 'Executive Suite', name: 'Executive Suite',
      rating: '★★★★★',
      desc: 'A full-floor suite with a dedicated butler, private dining area, and an exclusive terrace overlooking the city\'s glittering horizon.',
      amenities: ['🛏 Twin Beds', '🍽 Private Dining', '🧖 Butler', '🌃 Terrace'],
      price: '₹28,000',
      size: '420 sq ft',
      occupancy: '3 Adults',
    },
    {
      image: 'services/presedential-suite.jpg',
      badge: 'Ultra Luxury', badgeClass: 'prestige-badge',
      type: 'Presidential Suite', name: 'Presidential Suite',
      rating: '★★★★★',
      desc: 'The crown jewel of Grand Horizon — a 3-room suite spanning 2,400 sq ft with bespoke art, a private pool, and 24-hour concierge service.',
      amenities: ['🛏 3 Bedrooms', '🏊 Private Pool', '🎨 Bespoke Art', '🎩 Concierge'],
      price: '₹85,000',
      size: '900 sq ft',
      occupancy: '6 Adults',
    },
    {
      image: 'services/horizon-family.jpg',
      badge: '', badgeClass: '',
      type: 'Family Suite', name: 'Horizon Family',
      rating: '★★★★★',
      desc: 'Thoughtfully designed for families, with two interconnected rooms, a play area for children, and child-friendly dining options included.',
      amenities: ['🛏 2 Rooms', '🧒 Kid-Friendly', '🎮 Play Zone', '🍳 Breakfast'],
      price: '₹22,000',
      size: '800 sq ft',
      occupancy: '5 Adults',
    },
    {
      image: 'services/romance-suite.jpg',
      badge: 'Romance', badgeClass: 'romance-badge',
      type: 'Honeymoon Suite', name: 'Romance Suite',
      rating: '★★★★★',
      desc: 'An intimate sanctuary with rose petal turn-down, a couple\'s spa bath, candlelit dinner arrangements, and breathtaking sunset views.',
      amenities: ['🛏 Canopy Bed', '🌹 Romantic Setup', '🛁 Couple\'s Bath', '🌅 Sunset View'],
      price: '₹35,000',
      size: '320 sq ft',
      occupancy: '2 Adults',
    }
  ];

  showAmenitiesModal = false;

  amenitiesList = [
    { icon: '🏊', title: 'Infinity Pool', desc: 'Rooftop pool with skyline views' },
    { icon: '💆', title: 'Luxury Spa', desc: 'Relaxing spa & wellness therapies' },
    { icon: '🍽️', title: 'Fine Dining', desc: 'Multi-cuisine gourmet restaurants' },
    { icon: '🏋️', title: 'Fitness Center', desc: '24/7 modern gym facilities' },
    { icon: '🚗', title: 'Valet Parking', desc: 'Premium valet service available' },
    { icon: '🎭', title: 'Event Hall', desc: 'Banquet & conference facilities' },
    { icon: '🛎️', title: '24/7 Concierge', desc: 'Personal assistance anytime' },
    { icon: '📶', title: 'High-Speed WiFi', desc: 'Unlimited fast internet' }
  ];

  // Listen for window scroll to toggle navbar style
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 60;
  }

  openAmenitiesModal() {
    this.showAmenitiesModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeAmenitiesModal() {
    this.showAmenitiesModal = false;
    document.body.style.overflow = '';
  }

  openRoomDetails(room: any) {
    this.selectedRoom = room;
    this.showRoomModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeRoomModal() {
    this.showRoomModal = false;
    document.body.style.overflow = '';
  }

  // Forgot password states
  showForgotModal = false;
  showOtpField = false;
  showResetPasswordModal = false;

  // Forgot data
  forgotEmail = '';
  enteredOtp = '';
  newPassword = '';
  confirmPassword = '';

  // Dummy backend simulation (replace with API)
  generatedOtp = '123456';

  // Open forgot password modal
  openForgotPassword() {
    this.showLoginModal = false;
    this.showForgotModal = true;
    this.showOtpField = false;
    this.enteredOtp = '';
    this.forgotEmail = '';
  }

  dismissAlert() {
    this.alertService.dismiss();
    this.cdr.detectChanges();
  }

  // Send OTP
  sendOtp() {
    if (!this.forgotEmail) {
      alert('Please enter email');
      return;
    }

    this.api.sendOtp(this.forgotEmail).subscribe({
      next: (res: any) => {
        // success response from backend
        this.alertService.show('success', res?.message || 'OTP sent to your email');
        this.showOtpField = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        // error from backend

        this.ngZone.run(() => {
          this.alertService.show('error', 'Email does not exist');
        });
        // this.cdr.detectChanges();

      }
    });
  }

  // Verify OTP
  verifyOtp() {
    if (!this.enteredOtp) {
      this.alertService.show('error', 'Please enter OTP');
      return;
    }

    this.api.verifyOtp(this.forgotEmail, this.enteredOtp).subscribe({
      next: (res: any) => {

        // success from backend
        setTimeout(() => {
          this.alertService.show('success', res || 'OTP verified');
        }, 0);

        this.showForgotModal = false;
        this.showResetPasswordModal = true;
      },

      error: (err) => {
        let message = 'Invalid OTP';

        if (err.error === 'OTP expired') {
          message = 'OTP expired';
        } else if (err.error === 'No OTP found') {
          message = 'No OTP found';
        }

        setTimeout(() => {
          this.alertService.show('error', message);
        }, 0);
      }
    });
  }

  // Reset Password
  resetPassword() {
    if (!this.newPassword || !this.confirmPassword) {
      this.alertService.show('error', 'Fill all fields');
      return;
    }

    this.api.resetPassword(
      this.forgotEmail,
      this.newPassword,
      this.confirmPassword
    ).subscribe({
      next: (res: any) => {

        setTimeout(() => {
          this.alertService.show('success', res || 'Password reset successful');
        }, 0);

        this.showResetPasswordModal = false;
        this.openLoginModal();
      },

      error: (err) => {
        let message = 'Something went wrong';

        if (err.error === 'Passwords do not match') {
          message = 'Passwords do not match';
        } else if (err.error === 'User not found') {
          message = 'User not found';
        }

        setTimeout(() => {
          this.alertService.show('error', message);
        }, 0);
      }
    });
  }

  handleBookNow() {
    const token = localStorage.getItem('token');

    if (token) {
      this.router.navigate(['/dashboard']);
    } else {
      this.openLoginModal();
    }
  }

  // Toggle mobile menu
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // Open login modal
  openLoginModal() {
    this.showLoginModal = true;
    this.showRegisterModal = false;
    document.body.style.overflow = 'hidden';
  }

  // Switch to register modal
  switchToRegister() {
    this.showLoginModal = false;
    this.showRegisterModal = true;
  }

  // Switch back to login modal
  switchToLogin() {
    this.showRegisterModal = false;
    this.showLoginModal = true;
    this.cdr.detectChanges();
  }

  // Close all modals
  closeModals() {
    this.showLoginModal = false;
    this.showRegisterModal = false;
    this.showForgotModal = false;
    this.showResetPasswordModal = false;

    this.showOtpField = false;
    document.body.style.overflow = '';
    this.loginData = { email: '', password: '' };
    this.registerData = { name: '', email: '', mobileno: '', password: '' };
    this.forgotEmail = '';
    this.enteredOtp = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.cdr.detectChanges();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Handle login submission
  onLogin() {
    if (!this.loginData.email || !this.loginData.password) {
      this.alertService.show('error', 'Please fill in all fields.');
      return;
    }

    this.api.doLogin(this.loginData).subscribe({
      next: (res: any) => {

        console.log("LOGIN RESPONSE:", res); // 🔍 IMPORTANT

        // ✅ Safe token storage
        if (res && res.accessToken) {
          localStorage.setItem('token', res.accessToken);
          console.log("Stored token:", res.accessToken);
        } else {
          console.error("Access token missing in response!");
          this.alertService.show('error', 'Login failed: token missing');
          return;
        }

        this.alertService.show('success', 'Welcome back!');
          this.userService.setEmail(res.result);
        this.closeModals();
        this.router.navigate(['/dashboard']);
      },

      error: (err) => {
        console.error('Login error:', err);
        const msg = err?.error?.msg || 'Login failed';
        this.alertService.show('error', msg);
      }
    });
  }

  // Handle register submission
  onRegister() {

    if (!this.registerData.name || !this.registerData.email || !this.registerData.mobileno) {
      this.alertService.show('error', 'Please fill in all fields.');
      return;
    }

    this.api.doRegister(this.registerData).subscribe({
      next: (res: any) => {

        this.alertService.show('success', res.msg);
         this.userService.setEmail(res.result);
        this.switchToLogin();
      },
      error: (err) => {
        console.log('Error block hit:', err);

        const msg = err?.error?.msg || 'Registration failed';

        this.alertService.show('error', msg);
      }
    });
  }


}
