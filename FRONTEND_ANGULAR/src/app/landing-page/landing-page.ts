import { Component,OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Api } from '../services/api';
import { ChangeDetectorRef } from '@angular/core';
import { Alert as AlertService } from '../services/alert';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

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
              private alertService: AlertService,
              private router: Router,
              private titleService: Title
  ) {}

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
  }

  rooms = [
  {
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    badge: 'Most Popular', badgeClass: '',
    type: 'Classic Room', name: 'Horizon Classic',
    rating: '★★★★★',
    desc: 'A serene retreat featuring plush king-size bedding, city-view windows, and hand-selected furnishings with modern amenities.',
    amenities: ['🛏 King Bed', '📶 Free WiFi', '🌆 City View', '❄️ AC'],
    price: '₹8,500'
  },
  {
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80',
    badge: 'Featured', badgeClass: 'gold-badge',
    type: 'Deluxe Room', name: 'Grand Deluxe',
    rating: '★★★★★',
    desc: 'Expansive interiors with panoramic skyline views, a private lounge area, premium minibar, and signature Grand Horizon turndown service.',
    amenities: ['🛏 King Bed', '🌅 Skyline View', '🛁 Jacuzzi', '🥂 Minibar'],
    price: '₹14,000'
  },
  {
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
    badge: '', badgeClass: '',
    type: 'Executive Suite', name: 'Executive Suite',
    rating: '★★★★★',
    desc: 'A full-floor suite with a dedicated butler, private dining area, and an exclusive terrace overlooking the city\'s glittering horizon.',
    amenities: ['🛏 Twin Beds', '🍽 Private Dining', '🧖 Butler', '🌃 Terrace'],
    price: '₹28,000'
  },
  {
    image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&q=80',
    badge: 'Ultra Luxury', badgeClass: 'prestige-badge',
    type: 'Presidential Suite', name: 'Presidential Suite',
    rating: '★★★★★',
    desc: 'The crown jewel of Grand Horizon — a 3-room suite spanning 2,400 sq ft with bespoke art, a private pool, and 24-hour concierge service.',
    amenities: ['🛏 3 Bedrooms', '🏊 Private Pool', '🎨 Bespoke Art', '🎩 Concierge'],
    price: '₹85,000'
  },
  {
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80',
    badge: '', badgeClass: '',
    type: 'Family Suite', name: 'Horizon Family',
    rating: '★★★★★',
    desc: 'Thoughtfully designed for families, with two interconnected rooms, a play area for children, and child-friendly dining options included.',
    amenities: ['🛏 2 Rooms', '🧒 Kid-Friendly', '🎮 Play Zone', '🍳 Breakfast'],
    price: '₹22,000'
  },
  {
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80',
    badge: 'Romance', badgeClass: 'romance-badge',
    type: 'Honeymoon Suite', name: 'Romance Suite',
    rating: '★★★★★',
    desc: 'An intimate sanctuary with rose petal turn-down, a couple\'s spa bath, candlelit dinner arrangements, and breathtaking sunset views.',
    amenities: ['🛏 Canopy Bed', '🌹 Romantic Setup', '🛁 Couple\'s Bath', '🌅 Sunset View'],
    price: '₹35,000'
  }
];

  // Listen for window scroll to toggle navbar style
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 60;
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
    document.body.style.overflow = '';
    this.loginData = { email: '', password: '' };
    this.registerData = { name: '', email: '', mobileno: '', password: '' };
    this.cdr.detectChanges(); 
  }

  togglePassword(){
    this.showPassword = !this.showPassword;
  }

  // Handle login submission
  onLogin() {
    if (!this.loginData.email || !this.loginData.password) {
       this.alertService.show('error', 'Please fill in all fields.');
    return;
    }
  this.api.doLogin(this.loginData).subscribe({
    next: (res:any) => {
        // alert('Login successful! Welcome back to Grand Horizon.');
        localStorage.setItem('token', res.token);  // ← store token
      this.alertService.show('success', 'Welcome back!');
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
