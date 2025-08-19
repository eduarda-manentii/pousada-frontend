import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { SignupComponent } from './features/auth/pages/signup/signup.component';
import { AuthGuard } from './core/services/auth-guard.service';
import { HomeComponent } from './features/home/pages/home/home.component';
import { ReportsComponent } from './shared/pages/reports/reports.component';
import { NewCustomerComponent } from './features/customers/pages/new-customer/new-customer.component';
import { ShowCustomerComponent } from './features/customers/pages/show-customer/show-customer.component';
import { IndexCustomerComponent } from './features/customers/pages/index-customer/index-customer.component';
import { NewReservationComponent } from './features/reservations/pages/new-reservation/new-reservation.component';
import { ShowReservationComponent } from './features/reservations/pages/show-reservation/show-reservation.component';
import { IndexReservationComponent } from './features/reservations/pages/index-reservation/index-reservation.component';
import { NewRoomComponent } from './features/rooms/pages/new-room/new-room.component';
import { ShowRoomComponent } from './features/rooms/pages/show-room/show-room.component';
import { IndexRoomComponent } from './features/rooms/pages/index-room/index-room.component';
import { NewUserComponent } from './features/users/pages/new-user/new-user.component';
import { ShowUserComponent } from './features/users/pages/show-user/show-user.component';
import { IndexUserComponent } from './features/users/pages/index-user/index-user.component';
import { NewVoucherComponent } from './features/vouchers/pages/new-voucher/new-voucher.component';
import { ShowVoucherComponent } from './features/vouchers/pages/show-voucher/show-voucher.component';
import { IndexVoucherComponent } from './features/vouchers/pages/index-voucher/index-voucher.component';
import { IndexAmenityComponent } from './features/amenities/pages/index-amenity/index-amenity.component';
import { ShowAmenityComponent } from './features/amenities/pages/show-amenity/show-amenity.component';
import { NewAmenityComponent } from './features/amenities/pages/new-amenity/new-amenity.component';
import { NewComplementComponent } from './features/complements/pages/new-complement/new-complement.component';
import { ShowComplementComponent } from './features/complements/pages/show-complement/show-complement.component';
import { IndexComplementComponent } from './features/complements/pages/index-complement/index-complement.component';
import { IndexReportComponent } from './features/reports/pages/index-report/index-report.component';
import { ReservationsReportComponent } from './features/reports/pages/reservations-report/reservations-report.component';

export const routes: Routes = [
  { path: '',                        redirectTo: 'login', pathMatch: 'full' },
  { path : "login",                  component: LoginComponent },
  { path : "signup",                 component: SignupComponent },
  { path : "home",                   component: HomeComponent, canActivate: [AuthGuard] },
  { path : "reports",                component: ReportsComponent, canActivate: [AuthGuard] },
  { path : "customers/new",          component: NewCustomerComponent, canActivate: [AuthGuard] },
  { path:  "customers/new/:id",      component: NewCustomerComponent, canActivate: [AuthGuard] },
  { path : "customers/show/:id",     component: ShowCustomerComponent, canActivate: [AuthGuard] },
  { path : "customers/edit/:id",     component: NewCustomerComponent, canActivate: [AuthGuard] },
  { path : "customers/index",        component: IndexCustomerComponent, canActivate: [AuthGuard] },
  { path : "reservations/new",       component: NewReservationComponent, canActivate: [AuthGuard] },
  { path : "reservations/new/:id",   component: NewReservationComponent, canActivate: [AuthGuard] },
  { path : "reservations/edit/:id",  component: NewReservationComponent, canActivate: [AuthGuard] },
  { path : "reservations/show/:id",  component: ShowReservationComponent, canActivate: [AuthGuard] },
  { path : "reservations/index",     component: IndexReservationComponent, canActivate: [AuthGuard] },
  { path : "rooms/new",              component: NewRoomComponent, canActivate: [AuthGuard] },
  { path : "rooms/new/:id",          component: NewRoomComponent, canActivate: [AuthGuard] },
  { path : "rooms/edit/:id",         component: NewRoomComponent, canActivate: [AuthGuard] },
  { path : "rooms/show/:id",         component: ShowRoomComponent, canActivate: [AuthGuard] },
  { path : "rooms/index",            component: IndexRoomComponent, canActivate: [AuthGuard] },
  { path : "users/new",              component: NewUserComponent, canActivate: [AuthGuard] },
  { path : "users/new/:id",          component: NewUserComponent, canActivate: [AuthGuard] },
  { path : "users/edit/:id",         component: NewUserComponent, canActivate: [AuthGuard] },
  { path : "users/show/:id",         component: ShowUserComponent, canActivate: [AuthGuard] },
  { path : "users/index",            component: IndexUserComponent, canActivate: [AuthGuard] },
  { path : "vouchers/new",           component: NewVoucherComponent, canActivate: [AuthGuard] },
  { path : "vouchers/new/:id",       component: NewVoucherComponent, canActivate: [AuthGuard] },
  { path : "vouchers/edit/:id",      component: NewVoucherComponent, canActivate: [AuthGuard] },
  { path : "vouchers/show/:id",      component: ShowVoucherComponent, canActivate: [AuthGuard] },
  { path : "vouchers/index",         component: IndexVoucherComponent, canActivate: [AuthGuard] },
  { path : "amenities/new/:id",      component: NewAmenityComponent, canActivate: [AuthGuard] },
  { path : "amenities/edit/:id",     component: NewAmenityComponent, canActivate: [AuthGuard] },
  { path : "amenities/new",          component: NewAmenityComponent, canActivate: [AuthGuard] },
  { path : "amenities/show/:id",     component: ShowAmenityComponent, canActivate: [AuthGuard] },
  { path : "amenities/index",        component: IndexAmenityComponent, canActivate: [AuthGuard] },
  { path : "complements/new",        component: NewComplementComponent, canActivate: [AuthGuard] },
  { path : "complements/new/:id",    component: NewComplementComponent, canActivate: [AuthGuard] },
  { path : "complements/edit/:id",   component: NewComplementComponent, canActivate: [AuthGuard] },
  { path : "complements/show/:id",   component: ShowComplementComponent, canActivate: [AuthGuard] },
  { path : "complements/index",      component: IndexComplementComponent, canActivate: [AuthGuard] },
  { path : "reports/index",          component: IndexReportComponent, canActivate: [AuthGuard] },
  { path : "reports/reservations",   component: ReservationsReportComponent, canActivate: [AuthGuard] },
];
