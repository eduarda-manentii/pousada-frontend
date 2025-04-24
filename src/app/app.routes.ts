import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { UserComponent } from './pages/user/user.component';
import { AuthGuard } from './services/auth-guard.service';
import { HomeComponent } from './pages/home/home.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { NewCustomerComponent } from './pages/customers/new-customer/new-customer.component';
import { ShowCustomerComponent } from './pages/customers/show-customer/show-customer.component';
import { IndexCustomerComponent } from './pages/customers/index-customer/index-customer.component';
import { NewPaymentComponent } from './pages/payments/new-payment/new-payment.component';
import { ShowPaymentComponent } from './pages/payments/show-payment/show-payment.component';
import { IndexPaymentComponent } from './pages/payments/index-payment/index-payment.component';
import { NewReservationComponent } from './pages/reservations/new-reservation/new-reservation.component';
import { ShowReservationComponent } from './pages/reservations/show-reservation/show-reservation.component';
import { IndexReservationComponent } from './pages/reservations/index-reservation/index-reservation.component';
import { NewRoomComponent } from './pages/rooms/new-room/new-room.component';
import { ShowRoomComponent } from './pages/rooms/show-room/show-room.component';
import { IndexRoomComponent } from './pages/rooms/index-room/index-room.component';
import { NewUserComponent } from './pages/users/new-user/new-user.component';
import { ShowUserComponent } from './pages/users/show-user/show-user.component';
import { IndexUserComponent } from './pages/users/index-user/index-user.component';
import { NewVoucherComponent } from './pages/vourchers/new-voucher/new-voucher.component';
import { ShowVoucherComponent } from './pages/vourchers/show-voucher/show-voucher.component';
import { IndexVoucherComponent } from './pages/vourchers/index-voucher/index-voucher.component';

export const routes: Routes = [
  { path : "login",              component: LoginComponent },
  { path : "signup",             component: SignupComponent },
  { path : "user",               component: UserComponent, canActivate: [AuthGuard] },
  { path : "home",               component: HomeComponent },
  { path : "reports",            component: ReportsComponent },
  { path : "customers/new",      component: NewCustomerComponent },
  { path : "customers/show",     component: ShowCustomerComponent },
  { path : "customers/index",    component: IndexCustomerComponent },
  { path : "payments/show",      component: ShowPaymentComponent },
  { path : "payments/new",       component: NewPaymentComponent },
  { path : "payments/index",     component: IndexPaymentComponent },
  { path : "reservations/new",   component: NewReservationComponent },
  { path : "reservations/show",  component: ShowReservationComponent },
  { path : "reservations/index", component: IndexReservationComponent },
  { path : "romms/new",          component: NewRoomComponent },
  { path : "romms/show",         component: ShowRoomComponent },
  { path : "romms/index",        component: IndexRoomComponent },
  { path : "users/new",          component: NewUserComponent },
  { path : "users/show",         component: ShowUserComponent },
  { path : "users/index",        component: IndexUserComponent },
  { path : "vouchers/new",       component: NewVoucherComponent },
  { path : "vouchers/show",      component: ShowVoucherComponent },
  { path : "vouchers/index",     component: IndexVoucherComponent },
];
