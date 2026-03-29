import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { LandingPage } from './landing-page/landing-page';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {path: '', component: LandingPage},
    {path: 'dashboard', component: Dashboard, canActivate: [authGuard]} // Add AuthGuard here when implemented
];
