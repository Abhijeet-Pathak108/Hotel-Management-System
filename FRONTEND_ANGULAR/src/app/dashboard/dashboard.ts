
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Alert as AlertService } from '../services/alert';
import { Api } from '../services/api';
import { NgZone } from '@angular/core';
import { User } from '../services/user';
import { identifierName } from '@angular/compiler';
import Swal from 'sweetalert2';

declare var Razorpay: any;

export interface Guest {
  name: string;
  age: number | null;
  gender: string;
  idType: string;
  idNumber: string;
  nationality: string;
}

export interface BookingData {
  checkIn: string;
  checkOut: string;
  nights: number;
  guestCount: number;
  guests: Guest[];
  specialRequest: string;
  roomTotal: number;
  extraGuestCharge: number;
  taxes: number;
  serviceFee: number;
  grandTotal: number;
  paymentMethod: string;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  upiId: string;
}

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
  userName = '';
  userEmail = '';
  mobile = '';
  dateOfBirth = '';
  nationality = '';

  isDarkTheme = true;

  rooms: any[] = [];

  showBookingModal = false;
  selectedRoom: any = null;
  bookingStep: number = 1;

  totalBookings = 0;
  totalUpcomingBookings = 0;
  totalCompletedBookings = 0;
  totalnights = 0;


  bookingData: BookingData = this.getEmptyBookingData();

  constructor(private cdr: ChangeDetectorRef, private router: Router,
    private titleService: Title, public alertService: AlertService,
    private api: Api, private ngZone: NgZone,
    private userService: User
  ) { }





  getEmptyBookingData(): BookingData {
    return {
      checkIn: '', checkOut: '', nights: 0,
      guestCount: 1,
      guests: [this.emptyGuest()],
      specialRequest: '',
      roomTotal: 0, extraGuestCharge: 0,
      taxes: 0, serviceFee: 0, grandTotal: 0,
      paymentMethod: 'card',
      cardName: '', cardNumber: '',
      cardExpiry: '', cardCvv: '',
      upiId: ''
    };
  }

  emptyGuest(): Guest {
    return { name: '', age: null, gender: '', idType: '', idNumber: '', nationality: 'Indian' };
  }

  openBookingModal(room: any) {
    this.selectedRoom = room;
    this.bookingStep = 1;
    this.bookingData = this.getEmptyBookingData();
    this.showBookingModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeBookingModal() {
    this.showBookingModal = false;
    document.body.style.overflow = '';
  }

  saveProfileChanges(form: any) {
    const profileData = {
      name: this.userName,
      email: this.userEmail,
      mobile: this.mobile,
      dateOfBirth: this.dateOfBirth,
      nationality: this.nationality,
      roomType: this.selectedRoom || '',

      // Add other profile fields as needed
    };
    if (!form.valid) {
      this.alertService.show('error', 'Please fill all required fields correctly.');
      return;
    }

    this.api.updateProfile(profileData).subscribe({
      next: (res) => {
        this.alertService.show('success', 'Profile updated successfully!');
      },
      error: (err) => {
        console.error(err);
        this.alertService.show('error', 'Failed to update profile.');
      }
    });
  }

  getProfileData() {
    this.api.getUserData(this.userEmail).subscribe({
      next: (res) => {
        console.log("User Data:", res);

        // Example binding
        this.userName = res.username;
        this.userEmail = res.userEmail;
        this.mobile = res.mobile;
        this.dateOfBirth = res.dateOfBirth;
        this.nationality = res.nationality;
        this.selectedRoom = res.roomType;

        this.cdr.detectChanges(); // Ensure UI updates with new data

      },
      error: (err) => {
        console.error(err);
        this.alertService.show('error', 'User not found');
      }
    });
  }

  dismissAlert() {
    this.alertService.dismiss();
    this.cdr.detectChanges();
  }

  getGuestOptions(): number[] {
    const max = this.selectedRoom?.capacity || 4;
    return Array.from({ length: max }, (_, i) => i + 1);
  }

  onGuestCountChange() {
    const count = Number(this.bookingData.guestCount);
    const current = this.bookingData.guests.length;

    if (count > current) {
      // Add missing guest rows
      for (let i = current; i < count; i++) {
        this.bookingData.guests.push(this.emptyGuest());
      }
    } else {
      // Remove extra guest rows
      this.bookingData.guests = this.bookingData.guests.slice(0, count);
    }
    this.calculateTotal();
  }

  calculateTotal(): number {
    const { checkIn, checkOut } = this.bookingData;
    if (!checkIn || !checkOut) return 0;

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const nights = Math.max(0, Math.floor((outDate.getTime() - inDate.getTime()) / 86400000));

    const pricePerNight = this.selectedRoom?.priceValue || 0;
    const extraGuests = Math.max(0, Number(this.bookingData.guestCount) - 1);
    const extraCharge = extraGuests * 1500 * nights;   // ₹1,500 per extra guest per night
    const roomTotal = pricePerNight * nights;
    const subtotal = roomTotal + extraCharge;
    const taxes = Math.round(subtotal * 0.18);   // 18% GST
    const serviceFee = Math.round(subtotal * 0.02);   // 2% service fee
    const grandTotal = subtotal + taxes + serviceFee;

    this.bookingData = {
      ...this.bookingData,
      nights,
      roomTotal,
      extraGuestCharge: extraCharge,
      taxes,
      serviceFee,
      grandTotal
    };

    return grandTotal;
  }

  nextStep() {
    if (this.bookingStep === 1) {
      if (!this.bookingData.checkIn || !this.bookingData.checkOut) {
        this.alertService.show('error', 'Please select check-in and check-out dates.');
        return;
      }
      if (this.bookingData.nights <= 0) {
        this.alertService.show('error', 'Check-out must be after check-in.');
        return;
      }
    }

    if (this.bookingStep === 2) {
      const invalid = this.bookingData.guests.some(
        g => !g.name || !g.idType || !g.idNumber
      );
      if (invalid) {
        this.alertService.show('error', 'Please fill name, ID type and ID number for all guests.');
        return;
      }
    }

    this.bookingStep++;
    this.cdr.detectChanges();
  }

  prevStep() {
    this.bookingStep--;
    this.cdr.detectChanges();
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  // buildPayload(response: any) {
  //   return {
  //     room: {
  //       id: this.selectedRoom?.id,
  //       name: this.selectedRoom?.name,
  //       type: this.selectedRoom?.type,
  //       pricePerNight: this.selectedRoom?.price
  //     },

  //     stay: {
  //       checkIn: this.bookingData.checkIn,
  //       checkOut: this.bookingData.checkOut,
  //       nights: this.bookingData.nights
  //     },

  //     guests: this.bookingData.guests.map((g: any, index: number) => ({
  //       name: g.name,
  //       age: g.age,
  //       gender: g.gender,
  //       idType: g.idType,
  //       idNumber: g.idNumber,
  //       nationality: g.nationality,
  //       isPrimary: index === 0
  //     })),

  //     pricing: {
  //       roomTotal: this.bookingData.roomTotal,
  //       taxes: this.bookingData.taxes,
  //       extraGuestCharge: this.bookingData.extraGuestCharge,
  //       serviceFee: this.bookingData.serviceFee,
  //       grandTotal: this.bookingData.grandTotal
  //     },

  //     // payment: {
  // paymentId: response.razorpay_payment_id,
  // orderId: response.razorpay_order_id,
  // signature: response.razorpay_signature,
  // method: this.bookingData.paymentMethod
  //     // },

  //     specialRequest: this.bookingData.specialRequest
  //   };
  // }

  buildPayload(response: any, isVerified: boolean) {
    const cleanPrice = (val: any) =>
      val ? parseFloat(String(val).replace(/[₹,]/g, '')) : 0;

    return {
      roomId: this.selectedRoom?.id,
      roomType: this.selectedRoom?.type,
      pricePerNight: cleanPrice(this.selectedRoom?.price),

      checkIn: this.bookingData.checkIn,
      checkOut: this.bookingData.checkOut,
      nights: this.bookingData.nights,
      guestCount: this.bookingData.guestCount,

      userEmail: this.userService.getEmail(),  // Assuming email is used as user ID

      // ✅ All currency fields cleaned
      roomTotal: cleanPrice(this.bookingData.roomTotal),
      extraGuestCharge: cleanPrice(this.bookingData.extraGuestCharge),
      taxes: cleanPrice(this.bookingData.taxes),
      serviceFee: cleanPrice(this.bookingData.serviceFee),
      grandTotal: cleanPrice(this.bookingData.grandTotal),

      specialRequest: this.bookingData.specialRequest,
      status: isVerified ? 'CONFIRMED' : 'PENDING',
      sendEmail: this.settingsNotif[0].on,

      paymentId: response.razorpay_payment_id,
      orderId: response.razorpay_order_id,
      signature: response.razorpay_signature,
      method: this.bookingData.paymentMethod,

      guests: this.bookingData.guests.map((g: any, index: number) => ({
        name: g.name,
        age: g.age,
        gender: g.gender,
        idType: g.idType,
        idNumber: g.idNumber,
        nationality: g.nationality,
        isPrimary: index === 0
      }))
    };
  }

  confirmBooking() {
    if (!this.bookingData.paymentMethod) {
      this.alertService.show('error', 'Please select a payment method.');
      return;
    }

    // 🔥 IMPORTANT: backend already multiplies by 100
    const amount = this.calculateTotal();
    if (amount <= 0) {
      this.alertService.show('error', 'Invalid booking total.');
      return;
    }

    this.api.createBooking(amount).subscribe({
      next: (order: any) => {

        const options = {
          key: 'rzp_test_SXUnIdBFJwsrx6',
          amount: order.amount,
          currency: 'INR',
          name: 'Grand Horizon Hotel',
          description: 'Room Booking',
          order_id: order.id,

          // ✅ ONLY ONE HANDLER
          handler: (response: any) => {

            console.log('Payment Success', response);

            this.api.verifyPayment(response).subscribe({
              next: (res: any) => {

                console.log("VERIFY RESPONSE:", res);

                if (res.success) {

                  // debugger;
                  const bookingPayload = this.buildPayload(response, res.success);

                  this.api.saveBooking(bookingPayload).subscribe({
                    next: () => {
                      this.alertService.show('success', 'Booking confirmed! 🎉');
                    },
                    error: () => {
                      this.alertService.show('error', 'Booking save failed!');
                    }
                  });

                  this.ngZone.run(() => {
                    this.showBookingModal = false;



                    this.cdr.detectChanges(); // 🔥 FORCE UI UPDATE

                    // this.alertService.show('success', 'Booking confirmed! 🎉');
                  });

                } else {
                  this.alertService.show('error', 'Payment verification failed!');
                }
              },

              error: (err) => {
                console.error("VERIFY ERROR:", err);
                this.alertService.show('error', 'Payment verification error!');
              }
            });
          },

          theme: {
            color: '#3399cc'
          }
        };

        const rzp = new Razorpay(options);
        rzp.open();
      },

      error: (err) => {
        console.error(err);
        this.alertService.show('error', 'Failed to initiate payment.');
      }
    });
  }

  completedBookings: any[] = [];
  upcomingBookings: any[] = [];
  allBookings: any[] = [];
  ongoingBookings: any[] = [];
  
  getUpcomingBooking() {

    
    const email = this.userService.getEmail();
    // this.upcomingBookings = []; 
    
    this.api.upcomingBookings(email).subscribe({
      next: (res: any) => {
        console.log("upcoming  bookings:", res);
        this.completedBookings = []; 
        this.allBookings = [];
        this.totalUpcomingBookings = res.result?.length || 0;
        // store data for UI
        this.upcomingBookings = res.result.map((b: any) => ({
          image: this.roomImages[b.room?.trim()] || 'https://via.placeholder.com/100',

          room: b.room,

          dates: b.dates, // already formatted from backend

          guests: `${b.guests} Guest${b.guests > 1 ? 's' : ''}`,

          nights: b.nights,

          price: `₹${b.price.toLocaleString()}`,

          status: b.status
        }));

        this.cdr.detectChanges(); // ensure UI updates with new data

        // Example: extract room types

      },

      error: (err) => {
        console.error("Error fetching completed bookings:", err);
        this.alertService.show('error', 'Failed to fetch completed bookings');
      }
    });
  }

  getAllBooking() {
     const email = this.userService.getEmail();
    this.completedBookings = []; // Clear previous data before fetching new data
    

    this.api.allBookings(email).subscribe({
      next: (res: any) => {
        // console.log("Completed bookings:", res);

        this.totalBookings = res.result?.length || 0;

        this.upcomingBookings = [];
        this.completedBookings = [];

        // store data for UI
        this.allBookings = res.result.map((b: any) => ({
          image: this.roomImages[b.room?.trim()] || 'https://via.placeholder.com/100',

          room: b.room,

          dates: b.dates, // already formatted from backend

          guests: `${b.guests} Guest${b.guests > 1 ? 's' : ''}`,

          nights: b.nights,

          price: `₹${b.price.toLocaleString()}`,

          status: b.status
        }));

        this.cdr.detectChanges(); // ensure UI updates with new data

        // Example: extract room types

      },

      error: (err) => {
        console.error("Error fetching completed bookings:", err);
        this.alertService.show('error', 'Failed to fetch bookings');
      }
    });
  }

  getCompletedBooking() {

    const email = this.userService.getEmail();
    this.completedBookings = []; // Clear previous data before fetching new data
    

    this.api.completeBooking(email).subscribe({
      next: (res: any) => {
        // console.log("Completed bookings:", res);

        this.upcomingBookings = [];
        this.allBookings = [];
        this.totalCompletedBookings = res.result?.length || 0;

        // store data for UI
        this.completedBookings = res.result.map((b: any) => ({
          image: this.roomImages[b.room?.trim()] || 'https://via.placeholder.com/100',

          room: b.room,

          dates: b.dates, // already formatted from backend

          guests: `${b.guests} Guest${b.guests > 1 ? 's' : ''}`,

          nights: b.nights,
          

          price: `₹${b.price.toLocaleString()}`,

          status: b.status
        }
        
      ));

         


        this.cdr.detectChanges(); // ensure UI updates with new data

        this.totalnights = this.completedBookings.reduce((sum, b) => sum + b.nights, 0);

        // Example: extract room types

      },

      error: (err) => {
        console.error("Error fetching completed bookings:", err);
        this.alertService.show('error', 'Failed to fetch completed bookings');
      }
    });
  }

  getOngoingBooking() {

    const email = this.userService.getEmail();
    this.ongoingBookings = []; // Clear previous data before fetching new data
    

    this.api.ongoingBookings(email).subscribe({
      next: (res: any) => {
        // console.log("Completed bookings:", res);

        this.upcomingBookings = [];
        this.allBookings = [];
        this.completedBookings = [];
        

        // store data for UI
        this.ongoingBookings = res.result.map((b: any) => ({
          image: this.roomImages[b.room?.trim()] || 'https://via.placeholder.com/100',

          room: b.room,

          dates: b.dates, // already formatted from backend

          guests: `${b.guests} Guest${b.guests > 1 ? 's' : ''}`,

          nights: b.nights,
          

          price: `₹${b.price.toLocaleString()}`,

          status: b.status
        }));      
        this.cdr.detectChanges(); // ensure UI updates with new data

        

        // Example: extract room types

      },

      error: (err) => {
        console.error("Error fetching ongoing bookings:", err);
        this.alertService.show('error', 'Failed to fetch ongoing bookings');
      }
    });
  }


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

  activeFilter: string = 'ALL';

  // allBookings = [...this.upcomingBookings, ...this.completedBookings];

  setFilter(filter: string) {

  this.activeFilter = filter;

  if (filter === 'COMPLETED') {
    this.getCompletedBooking();
  }

  if (filter === 'UPCOMING') {
    this.getUpcomingBooking();
  }

  if (filter === 'ALL') {
    this.getAllBooking();
  }

  if (filter === 'ONGOING') {
    this.getOngoingBooking();
  }

}

  roomImages:any = {
    'Classic Room': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
    'Deluxe Room': 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80',
    'Executive Suite': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
    'Presidential Suite': 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=600&q=80',
    'Family Suite': 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80',
    'Honeymoon Suite': 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80'
  };

  initRooms() {
    this.rooms = [
      {
        id: 1,
        image: 'services/classic-room.jpg',
        type: 'Classic Room', name: 'Horizon Classic',
        rating: '4.9', price: '₹8,500', priceValue: 8500,
        capacity: 2,                           // ← max guests
        desc: 'Plush king-size bedding with city-view windows and modern amenities.',
        tags: ['🛏 King Bed', '📶 WiFi', '🌆 City View']
      },
      {
        id: 2,
        image: 'services/delux-room.jpg',
        type: 'Deluxe Room', name: 'Grand Deluxe',
        rating: '5.0', price: '₹14,000', priceValue: 14000,
        capacity: 2,
        desc: 'Panoramic skyline views with a private lounge and premium minibar.',
        tags: ['🛏 King Bed', '🌅 Skyline', '🛁 Jacuzzi']
      },
      {
        id: 3,
        image: 'services/executive-suite.jpg',
        type: 'Executive Suite', name: 'Executive Suite',
        rating: '5.0', price: '₹28,000', priceValue: 28000,
        capacity: 3,
        desc: 'Full-floor suite with dedicated butler and private dining terrace.',
        tags: ['🛏 Twin Beds', '🍽 Dining', '🎩 Butler']
      },
      {
        id: 4,
        image: 'services/presedential-suite.jpg',
        type: 'Presidential Suite', name: 'Presidential Suite',
        rating: '5.0', price: '₹85,000', priceValue: 85000,
        capacity: 6,
        desc: '3-room suite with private pool, bespoke art and 24/7 concierge.',
        tags: ['🛏 3 Beds', '🏊 Pool', '🎨 Art']
      },
      {
        id: 5,
        image: 'services/horizon-family.jpg',
        type: 'Family Suite', name: 'Horizon Family',
        rating: '4.8', price: '₹22,000', priceValue: 22000,
        capacity: 5,
        desc: "Two interconnected rooms with a children's play area and breakfast included.",
        tags: ['🛏 2 Rooms', '🧒 Kids', '🍳 Breakfast']
      },
      {
        id: 6,
        image: 'services/romance-suite.jpg',
        type: 'Honeymoon Suite', name: 'Romance Suite',
        rating: '5.0', price: '₹35,000', priceValue: 35000,
        capacity: 2,
        desc: "Canopy bed, couple's spa bath, rose petal turndown and sunset views.",
        tags: ['🕯 Canopy Bed', '🛁 Couple Bath', '🌅 Sunset']
      }
    ];
  }

  // ── Services ──────────────────────────────────────────────
  // services = [
  //   {
  //     icon: '🍽️', name: 'Room Service',
  //     desc: '24/7 in-room dining from our award-winning Le Ciel kitchen.',
  //     // action: 'Order Now'
  //     action: 'View Details'
  //   },
  //   {
  //     icon: '💆', name: 'Spa & Wellness',
  //     desc: 'Book a rejuvenating treatment at The Horizon Spa.',
  //     // action: 'Book Appointment'
  //     action: 'View Details'
  //   },
  //   {
  //     icon: '🏊', name: 'Rooftop Pool',
  //     desc: 'Reserve your private cabana at our infinity rooftop pool.',
  //     // action: 'Reserve Cabana'
  //     action: 'View Details'
  //   },
  //   {
  //     icon: '🚗', name: 'Airport Transfer',
  //     desc: 'Chauffeur-driven luxury vehicle to and from the airport.',
  //     // action: 'Schedule Pickup'
  //     action: 'View Details'
  //   },
  //   {
  //     icon: '🎭', name: 'Event Planning',
  //     desc: 'Our concierge team handles every detail of your special event.',
  //     // action: 'Request Planning'
  //     action: 'View Details'
  //   },
  //   {
  //     icon: '🏋️', name: 'Fitness Studio',
  //     desc: 'State-of-the-art equipment with personal trainer on request.',
  //     // action: 'Book Session'
  //     action: 'View Details'
  //   },
  //   {
  //     icon: '🍷', name: 'Fine Dining',
  //     desc: 'Reserve a table at Le Ciel with curated tasting menus.',
  //     // action: 'Reserve Table'
  //     action: 'View Details'
  //   },
  //   {
  //     icon: '🎩', name: 'Butler Service',
  //     desc: 'Dedicated butler available around the clock for all your needs.',
  //     // action: 'Request Butler'
  //     action: 'View Details'
  //   },
  //   {
  //     icon: '🌿', name: 'Laundry & Valet',
  //     desc: 'Same-day laundry, pressing and wardrobe management.',
  //     // action: 'Request Pickup'
  //     action: 'View Details'
  //   }
  // ];

  services = [
  {
    id: 1,
    image: 'services/service-1.jpg',
    name: 'Room Service',
    desc: '24/7 in-room dining from our award-winning Le Ciel kitchen.',
    action: 'View Details'
  },
  {
    id: 2,
    image: 'services/service-2.jpg',
    name: 'Spa & Wellness',
    desc: 'Book a rejuvenating treatment at The Horizon Spa.',
    action: 'View Details'
  },
  // {
  //   image: 'https://images.unsplash.com/photo-1501117716987-c8e1ecb21091',
  //   name: 'Rooftop Pool',
  //   desc: 'Reserve your private cabana at our infinity rooftop pool.',
  //   action: 'View Details'
  // },
  {
  id: 3,
  image: 'services/service-3.jpeg',
  name: 'Rooftop Pool',
  desc: 'Reserve your private cabana at our infinity rooftop pool.',
  action: 'View Details'
},
{
  id: 4,
  image: 'services/service-4.jpeg',
  name: 'Fitness Studio',
  desc: 'State-of-the-art equipment with personal trainer on request.',
  action: 'View Details'
},
  {
    id: 5,
    image: 'services/service-5.jpg',
    name: 'Airport Transfer',
    desc: 'Chauffeur-driven luxury vehicle to and from the airport.',
    action: 'View Details'
  },
  {
      id: 6,
    image: 'services/service-6.jpg',
    name: 'Event Planning',
    desc: 'Our concierge team handles every detail of your special event.',
    action: 'View Details'
  },
  // {
  //   image: 'https://images.unsplash.com/photo-1558611848-73f7eb4001ab',
  //   name: 'Fitness Studio',
  //   desc: 'State-of-the-art equipment with personal trainer on request.',
  //   action: 'View Details'
  // },
  {
      id: 7,
    image: 'services/service-7.jpg',
    name: 'Fine Dining',
    desc: 'Reserve a table at HORIZON with curated tasting menus.',
    action: 'View Details'
  },
  {
      id: 8,
    image: 'services/service-8.jpg',
    name: 'Butler Service',
    desc: 'Dedicated butler available around the clock for all your needs.',
    action: 'View Details'
  },
  {
      id: 9,
    image: 'services/service-9.jpg',
    name: 'Laundry & Valet',
    desc: 'Same-day laundry, pressing and wardrobe management.',
    action: 'View Details'
  }
];

servicesModal = [
    {
    id: 1,
    image: 'services/service-1.jpg',
    name: 'Room Service',
    desc: '24/7 in-room dining from our award-winning Le Ciel kitchen.',
    action: 'View Details',
     details: [
      '24/7 in-room dining service',
      'Multi-cuisine menu from Le Ciel kitchen',
      'Custom meal requests available',
      'Fast delivery within 30 minutes'
    ]
  },
  {
    id: 2,
    image: 'services/service-2.jpg',
    name: 'Spa & Wellness',
    desc: 'Book a rejuvenating treatment at The Horizon Spa.',
    action: 'View Details',
      details: [
      'Luxury spa therapies & massages',
      'Certified wellness experts',
      'Steam, sauna & relaxation rooms',
      'Couple spa packages available'
    ]
  },
  {
    id: 3,
    image: 'services/service-3.jpeg',
    name: 'Rooftop Pool',
    desc: 'Reserve your private cabana at our infinity rooftop pool.',
    action: 'View Details',
    details: [
      'Infinity pool with skyline view',
      'Private cabanas available',
      'Open from 6 AM to 10 PM',
      'Poolside food & drinks service'
    ]
  },
  {
    id: 4,
    image: 'services/service-4.jpeg',
    name: 'Fitness Studio',
    desc: 'State-of-the-art equipment with personal trainer on request.',
    action: 'View Details',
    details: [
      'Modern gym equipment',
      'Certified personal trainers',
      'Yoga & cardio sessions',
      'Open 24/7 for guests'
    ]
  },
   {
    id: 5,
    image: 'services/service-5.jpg',
    name: 'Airport Transfer',
    desc: 'Chauffeur-driven luxury vehicle to and from the airport.',
    action: 'View Details',
      details: [
      'Luxury airport transfer service',
      'Chauffeur-driven vehicles',
      'Available 24/7 on request',
      'Meet & greet service at airport'
    ]
  },
  {
      id: 6,
    image: 'services/service-6.jpg',
    name: 'Event Planning',
    desc: 'Our concierge team handles every detail of your special event.',
    action: 'View Details',
     details: [
      'Wedding & event planning services',
      'Customized themes & decorations',
      'Dedicated concierge support',
      'End-to-end event management'
    ]
  },
   {
      id: 7,
    image: 'services/service-7.jpg',
    name: 'Fine Dining',
    desc: 'Reserve a table at HORIZON with curated tasting menus.',
    action: 'View Details',
      details: [
      'Fine dining at HORIZON restaurant',
      'Chef-curated tasting menus',
      'Premium wine & beverage selection',
      'Romantic & private dining setup'
    ]
  },
  {
      id: 8,
    image: 'services/service-8.jpg',
    name: 'Butler Service',
    desc: 'Dedicated butler available around the clock for all your needs.',
    action: 'View Details',
     details: [
      'Personal butler available 24/7',
      'Assistance with all guest needs',
      'Luxury personalized service',
      'Priority handling of requests'
    ]
  },
  {
      id: 9,
    image: 'services/service-9.jpg',
    name: 'Laundry & Valet',
    desc: 'Same-day laundry, pressing and wardrobe management.',
    action: 'View Details',
     details: [
      'Same-day laundry service',
      'Professional ironing & pressing',
      'Garment care & wardrobe management',
      'Doorstep pickup & delivery'
    ]
  }
];

selectedService: any = null;
isModalOpen = false;

openModal(service: any) {
  const modalData = this.servicesModal.find(m => m.id === service.id);

  this.selectedService = {
    ...service,
    details: modalData?.details || []
  };

  this.isModalOpen = true;
}

closeModal() {
  this.isModalOpen = false;
}

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
    { label: 'Booking Confirmations', desc: 'Receive confirmation emails for all bookings', on: true }
    // { label: 'Promotional Offers', desc: 'Get notified about exclusive deals and packages', on: true },
    // { label: 'Stay Reminders', desc: 'Receive reminders 24 hours before check-in', on: true },
    // { label: 'Loyalty Points Updates', desc: 'Notifications when you earn or redeem points', on: false },
    // { label: 'SMS Notifications', desc: 'Receive important updates via SMS', on: false }
  ];

  saveSettings() {
  localStorage.setItem('settingsNotif', JSON.stringify(this.settingsNotif));
}

  ngOnInit(): void {
    const saved = localStorage.getItem('gh-theme') || 'dark';
    this.isDarkTheme = saved === 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    this.initRooms();
    this.titleService.setTitle('Grand Horizon - User Dashboard');
    this.userEmail = this.userService.getEmail();
    this.alertService.dismiss();
    this.getUpcomingBooking();
    this.getCompletedBooking();
    this.getProfileData();
     this.setGreeting();

    const togglesaved = localStorage.getItem('settingsNotif');

  if (togglesaved) {
    this.settingsNotif = JSON.parse(togglesaved);
  }
    
    // this.getProfileData();
  }

  // ── Methods ───────────────────────────────────────────────
  // setSection(section: string) {
  //   this.activeSection = section;
  //   this.cdr.detectChanges(); // Ensure view updates when section changes
  // }
  setSection(section: string) {
    console.log("section clicked");

    this.activeSection = section;
    this.cdr.detectChanges(); // Ensure view updates when section changes

    if (section === 'profile') {
      console.log("Api called");

      this.getProfileData();
    }

    if (section === 'bookings') {
      this.getAllBooking();
    }
    if (section === 'dashboard') {
      this.getUpcomingBooking();
      this.cdr.detectChanges();
  }
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

  // getTimeOfDay(): string {
  //   const h = new Date().getHours();
  //   if (h < 12) return 'Morning';
  //   if (h < 17) return 'Afternoon';
  //   return 'Evening';
  // }

  greeting: string = '';

 setGreeting() {
  const h = new Date().getHours();

  if (h >= 5 && h < 12) {
    this.greeting = 'Good Morning';
  } else if (h >= 12 && h < 17) {
    this.greeting = 'Good Afternoon';
  } else if (h >= 17 && h < 21) {
    this.greeting = 'Good Evening';
  } else {
    this.greeting = '';
  }
}

deleteAccount() {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This action cannot be undone. Your account will be permanently deleted.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Delete My Account',
    cancelButtonText: 'No, Keep My Account',
    reverseButtons: true,
    customClass: {
      popup: 'swal-custom-popup',
      confirmButton: 'swal-confirm-btn',
      cancelButton: 'swal-cancel-btn',
      title: 'swal-title',
      htmlContainer: 'swal-text'
    },
    buttonsStyling: false
  }).then((result) => {
    if (result.isConfirmed) {
      this.userEmail = this.userService.getEmail(); // Ensure we have the latest email
      this.api.deleteAccount(this.userEmail).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Account Deleted',
            text: 'Your account has been deleted successfully.',
            timer: 2000,
            showConfirmButton: false,
            customClass: {
              popup: 'swal-custom-popup'
            }
          });
          this.logout();
        },
        error: (err) => {
          console.error("Account deletion error:", err);
          Swal.fire({
            icon: 'error',
            title: 'Deletion Failed',
            text: 'There was an error deleting your account. Please try again later.',
            customClass: {
              popup: 'swal-custom-popup'
            }
          });
        }
      });
    }
  });
}

  // logout() {
  //   localStorage.removeItem('token');   // ← clear token
  //   this.userService.clearEmail();     // ← clear user email
  //   this.router.navigate(['/']);        // ← back to landing
  // }

logout() {

  Swal.fire({
    title: 'Are you sure?',
    text: 'You will be logged out!',
    icon: 'warning',

    showCancelButton: true,
    confirmButtonText: 'Yes, Logout',
    cancelButtonText: 'No',
    reverseButtons: true,

    customClass: {
      popup: 'swal-custom-popup',
      confirmButton: 'swal-confirm-btn',
      cancelButton: 'swal-cancel-btn',
      title: 'swal-title',
      htmlContainer: 'swal-text'
    },

    buttonsStyling: false   // 🔥 IMPORTANT to apply custom CSS
  }).then((result) => {

    if (result.isConfirmed) {
      localStorage.removeItem('token');
      this.userService.clearEmail();
      this.router.navigate(['/']);

      Swal.fire({
        icon: 'success',
        title: 'Logged out successfully',
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: 'swal-custom-popup'
        }
      });
    }

  });
}
}
