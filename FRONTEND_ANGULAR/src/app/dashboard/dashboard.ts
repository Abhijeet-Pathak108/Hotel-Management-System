
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router'; 
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  activeSection = 'dashboard';
  sidebarCollapsed = false;
  today = new Date();

  // Replace these with data from your AuthService / API
  userName = 'Arjun Sharma';
  userEmail = 'arjun.sharma@email.com';

  isDarkTheme = true;

  rooms:any[] = [];

  constructor(private cdr: ChangeDetectorRef, private router: Router,
              private titleService: Title
  ) {}

  

toggleTheme() {
 this.isDarkTheme = !this.isDarkTheme;
  const theme = this.isDarkTheme ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('gh-theme', theme); 
}

  // ── Bookings ──────────────────────────────────────────────
  bookings = [
    {
      icon: '🛏️', room: 'Grand Deluxe Suite',
      dates: 'Dec 24 – Dec 28, 2025', guests: '2 Guests',
      nights: 4, price: '₹56,000', status: 'Confirmed'
    },
    {
      icon: '👑', room: 'Presidential Suite',
      dates: 'Jan 10 – Jan 14, 2026', guests: '1 Guest',
      nights: 4, price: '₹1,40,000', status: 'Pending'
    },
    {
      icon: '🌹', room: 'Romance Suite',
      dates: 'Oct 14 – Oct 17, 2025', guests: '2 Guests',
      nights: 3, price: '₹1,05,000', status: 'Completed'
    },
    {
      icon: '🏠', room: 'Horizon Family Suite',
      dates: 'Aug 5 – Aug 9, 2025', guests: '4 Guests',
      nights: 4, price: '₹88,000', status: 'Completed'
    }
  ];

  // ── Rooms ─────────────────────────────────────────────────
  // rooms = [
  //   {
  //     icon: '🏨', type: 'Classic Room', name: 'Horizon Classic',
  //     rating: '4.9', price: '₹8,500',
  //     desc: 'Plush king-size bedding with city-view windows and modern amenities.',
  //     tags: ['🛏 King Bed', '📶 WiFi', '🌆 City View']
  //   },
  //   {
  //     icon: '🛏️', type: 'Deluxe Room', name: 'Grand Deluxe',
  //     rating: '5.0', price: '₹14,000',
  //     desc: 'Panoramic skyline views with a private lounge and premium minibar.',
  //     tags: ['🛏 King Bed', '🌅 Skyline', '🛁 Jacuzzi']
  //   },
  //   {
  //     icon: '🌆', type: 'Executive Suite', name: 'Executive Suite',
  //     rating: '5.0', price: '₹28,000',
  //     desc: 'Full-floor suite with dedicated butler and private dining terrace.',
  //     tags: ['🛏 Twin Beds', '🍽 Dining', '🎩 Butler']
  //   },
  //   {
  //     icon: '👑', type: 'Presidential Suite', name: 'Presidential Suite',
  //     rating: '5.0', price: '₹85,000',
  //     desc: '3-room suite with private pool, bespoke art, and 24/7 concierge.',
  //     tags: ['🛏 3 Beds', '🏊 Pool', '🎨 Art']
  //   },
  //   {
  //     icon: '🏠', type: 'Family Suite', name: 'Horizon Family',
  //     rating: '4.8', price: '₹22,000',
  //     desc: 'Two interconnected rooms with a children\'s play area and breakfast included.',
  //     tags: ['🛏 2 Rooms', '🧒 Kids', '🍳 Breakfast']
  //   },
  //   {
  //     icon: '🌹', type: 'Honeymoon Suite', name: 'Romance Suite',
  //     rating: '5.0', price: '₹35,000',
  //     desc: 'Canopy bed, couple\'s spa bath, rose petal turndown and sunset views.',
  //     tags: ['🕯 Canopy Bed', '🛁 Couple Bath', '🌅 Sunset']
  //   }
  // ];

  initRooms() {
  this.rooms = [
  {
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
    type: 'Classic Room', name: 'Horizon Classic',
    rating: '4.9', price: '₹8,500',
    desc: 'Plush king-size bedding with city-view windows and modern amenities.',
    tags: ['🛏 King Bed', '📶 WiFi', '🌆 City View']
  },
  {
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80',
    type: 'Deluxe Room', name: 'Grand Deluxe',
    rating: '5.0', price: '₹14,000',
    desc: 'Panoramic skyline views with a private lounge and premium minibar.',
    tags: ['🛏 King Bed', '🌅 Skyline', '🛁 Jacuzzi']
  },
  {
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
    type: 'Executive Suite', name: 'Executive Suite',
    rating: '5.0', price: '₹28,000',
    desc: 'Full-floor suite with dedicated butler and private dining terrace.',
    tags: ['🛏 Twin Beds', '🍽 Dining', '🎩 Butler']
  },
  {
    image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=600&q=80',
    type: 'Presidential Suite', name: 'Presidential Suite',
    rating: '5.0', price: '₹85,000',
    desc: '3-room suite with private pool, bespoke art, and 24/7 concierge.',
    tags: ['🛏 3 Beds', '🏊 Pool', '🎨 Art']
  },
  {
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80',
    type: 'Family Suite', name: 'Horizon Family',
    rating: '4.8', price: '₹22,000',
    desc: 'Two interconnected rooms with a children\'s play area and breakfast included.',
    tags: ['🛏 2 Rooms', '🧒 Kids', '🍳 Breakfast']
  },
  {
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80',
    type: 'Honeymoon Suite', name: 'Romance Suite',
    rating: '5.0', price: '₹35,000',
    desc: 'Canopy bed, couple\'s spa bath, rose petal turndown and sunset views.',
    tags: ['🕯 Canopy Bed', '🛁 Couple Bath', '🌅 Sunset']
  }
];
}

  // ── Services ──────────────────────────────────────────────
  services = [
    {
      icon: '🍽️', name: 'Room Service',
      desc: '24/7 in-room dining from our award-winning Le Ciel kitchen.',
      action: 'Order Now'
    },
    {
      icon: '💆', name: 'Spa & Wellness',
      desc: 'Book a rejuvenating treatment at The Horizon Spa.',
      action: 'Book Appointment'
    },
    {
      icon: '🏊', name: 'Rooftop Pool',
      desc: 'Reserve your private cabana at our infinity rooftop pool.',
      action: 'Reserve Cabana'
    },
    {
      icon: '🚗', name: 'Airport Transfer',
      desc: 'Chauffeur-driven luxury vehicle to and from the airport.',
      action: 'Schedule Pickup'
    },
    {
      icon: '🎭', name: 'Event Planning',
      desc: 'Our concierge team handles every detail of your special event.',
      action: 'Request Planning'
    },
    {
      icon: '🏋️', name: 'Fitness Studio',
      desc: 'State-of-the-art equipment with personal trainer on request.',
      action: 'Book Session'
    },
    {
      icon: '🍷', name: 'Fine Dining',
      desc: 'Reserve a table at Le Ciel with curated tasting menus.',
      action: 'Reserve Table'
    },
    {
      icon: '🎩', name: 'Butler Service',
      desc: 'Dedicated butler available around the clock for all your needs.',
      action: 'Request Butler'
    },
    {
      icon: '🌿', name: 'Laundry & Valet',
      desc: 'Same-day laundry, pressing and wardrobe management.',
      action: 'Request Pickup'
    }
  ];

  // ── Stay History ──────────────────────────────────────────
  stayHistory = [
    { icon: '🌹', room: 'Romance Suite', dates: 'Oct 14–17, 2025', price: '₹1,05,000', nights: 3 },
    { icon: '🏠', room: 'Horizon Family Suite', dates: 'Aug 5–9, 2025', price: '₹88,000', nights: 4 },
    { icon: '🛏️', room: 'Grand Deluxe Suite', dates: 'Jun 1–4, 2025', price: '₹56,000', nights: 3 },
    { icon: '🌆', room: 'Executive Suite', dates: 'Mar 20–23, 2025', price: '₹84,000', nights: 3 },
    { icon: '🏨', room: 'Horizon Classic', dates: 'Jan 2–4, 2025', price: '₹17,000', nights: 2 }
  ];

  // ── Settings ──────────────────────────────────────────────
  settingsNotif = [
    { label: 'Booking Confirmations', desc: 'Receive confirmation emails for all bookings', on: true },
    { label: 'Promotional Offers', desc: 'Get notified about exclusive deals and packages', on: true },
    { label: 'Stay Reminders', desc: 'Receive reminders 24 hours before check-in', on: true },
    { label: 'Loyalty Points Updates', desc: 'Notifications when you earn or redeem points', on: false },
    { label: 'SMS Notifications', desc: 'Receive important updates via SMS', on: false }
  ];

  ngOnInit(): void {
    const saved = localStorage.getItem('gh-theme') || 'dark';
  this.isDarkTheme = saved === 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  this.initRooms();
  this.titleService.setTitle('Grand Horizon - User Dashboard');
  }

  // ── Methods ───────────────────────────────────────────────
  setSection(section: string) {
    this.activeSection = section;
    this.cdr.detectChanges(); // Ensure view updates when section changes
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  getUserInitials(): string {
    return this.userName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getSectionTitle(): string {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      bookings: 'My Bookings',
      rooms: 'Browse Rooms',
      services: 'Hotel Services',
      history: 'Stay History',
      profile: 'My Profile',
      settings: 'Settings'
    };
    return titles[this.activeSection] || 'Dashboard';
  }

  getTimeOfDay(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Morning';
    if (h < 17) return 'Afternoon';
    return 'Evening';
  }

 logout() {
  localStorage.removeItem('token');   // ← clear token
  this.router.navigate(['/']);        // ← back to landing
}
}
