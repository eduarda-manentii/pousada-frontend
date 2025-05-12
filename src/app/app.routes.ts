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

export const routes: Routes = [
  { path : "login",               component: LoginComponent },
  { path : "signup",              component: SignupComponent },
  // { path : "home",               component: HomeComponent, canActivate: [AuthGuard] },
  { path : "home",                component: HomeComponent },
  { path : "reports",             component: ReportsComponent },
  { path : "customers/new",       component: NewCustomerComponent },
  { path: 'customers/new/:id',    component: NewCustomerComponent },
  { path : "customers/show/:id",  component: ShowCustomerComponent },
  { path : "customers/index",     component: IndexCustomerComponent },
  { path : "payments/show",       component: ShowPaymentComponent },
  { path : "payments/new",        component: NewPaymentComponent },
  { path : "payments/index",      component: IndexPaymentComponent },
  { path : "reservations/new",    component: NewReservationComponent },
  { path : "reservations/show",   component: ShowReservationComponent },
  { path : "reservations/index",  component: IndexReservationComponent },
  { path : "rooms/new",           component: NewRoomComponent },
  { path : "rooms/show",          component: ShowRoomComponent },
  { path : "rooms/index",         component: IndexRoomComponent },
  { path : "users/new",           component: NewUserComponent },
  { path : "users/show",          component: ShowUserComponent },
  { path : "users/index",         component: IndexUserComponent },
  { path : "vouchers/new",        component: NewVoucherComponent },
  { path : "vouchers/show",       component: ShowVoucherComponent },
  { path : "vouchers/index",      component: IndexVoucherComponent },
];
