import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { SignupComponent } from './features/auth/pages/signup/signup.component';
import { AuthGuard } from './core/services/auth-guard.service';
import { HomeComponent } from './features/home/pages/home/home.component';
import { ReportsComponent } from './shared/pages/reports/reports.component';
import { NewCustomerComponent } from './features/customers/pages/new-customer/new-customer.component';
import { ShowCustomerComponent } from './features/customers/pages/show-customer/show-customer.component';
import { IndexCustomerComponent } from './features/customers/pages/index-customer/index-customer.component';
import { NewPaymentComponent } from './features/payments/pages/new-payment/new-payment.component';
import { ShowPaymentComponent } from './features/payments/pages/show-payment/show-payment.component';
import { IndexPaymentComponent } from './features/payments/pages/index-payment/index-payment.component';
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

export const routes: Routes = [
  { path : "login",                  component: LoginComponent },
  { path : "signup",                 component: SignupComponent },
  { path : "home",                   component: HomeComponent },
  { path : "reports",                component: ReportsComponent },
  { path : "customers/new",          component: NewCustomerComponent },
  { path:  "customers/new/:id",       component: NewCustomerComponent },
  { path : "customers/show/:id",     component: ShowCustomerComponent },
  { path : "customers/edit/:id",     component: NewCustomerComponent },
  { path : "customers/index",        component: IndexCustomerComponent },
  { path : "payments/show",          component: ShowPaymentComponent },
  { path : "payments/new",           component: NewPaymentComponent },
  { path : "payments/edit/:id",      component: NewPaymentComponent },
  { path : "payments/index",         component: IndexPaymentComponent },
  { path : "reservations/new",       component: NewReservationComponent },
  { path : "reservations/new/:id",   component: NewReservationComponent },
  { path : "reservations/edit/:id",  component: NewReservationComponent },
  { path : "reservations/show/:id",  component: ShowReservationComponent },
  { path : "reservations/index",     component: IndexReservationComponent },
  { path : "rooms/new",              component: NewRoomComponent },
  { path : "rooms/new/:id",          component: NewRoomComponent },
  { path : "rooms/edit/:id",         component: NewRoomComponent },
  { path : "rooms/show/:id",         component: ShowRoomComponent },
  { path : "rooms/index",            component: IndexRoomComponent },
  { path : "users/new",              component: NewUserComponent },
  { path : "users/new/:id",          component: NewUserComponent },
  { path : "users/edit/:id",         component: NewUserComponent },
  { path : "users/show/:id",         component: ShowUserComponent },
  { path : "users/index",            component: IndexUserComponent },
  { path : "vouchers/new",           component: NewVoucherComponent },
  { path : "vouchers/new/:id",       component: NewVoucherComponent },
  { path : "vouchers/edit/:id",      component: NewVoucherComponent },
  { path : "vouchers/show/:id",      component: ShowVoucherComponent },
  { path : "vouchers/index",         component: IndexVoucherComponent },
  { path : "amenities/new/:id",      component: NewAmenityComponent },
  { path : "amenities/edit/:id",     component: NewAmenityComponent },
  { path : "amenities/new",          component: NewAmenityComponent },
  { path : "amenities/show/:id",     component: ShowAmenityComponent },
  { path : "amenities/index",        component: IndexAmenityComponent },
  { path : "complements/new",        component: NewComplementComponent },
  { path : "complements/new/:id",    component: NewComplementComponent },
  { path : "complements/edit/:id",   component: NewComplementComponent },
  { path : "complements/show/:id",   component: ShowComplementComponent },
  { path : "complements/index",      component: IndexComplementComponent },
];
