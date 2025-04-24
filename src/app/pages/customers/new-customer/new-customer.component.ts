import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../components/header/header.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-new-customer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HeaderComponent,
    NgxMaskDirective
  ],
  templateUrl: './new-customer.component.html',
  styleUrl: './new-customer.component.scss',
  providers: [provideNgxMask()]
})
export class NewCustomerComponent {
  customerForm: FormGroup;

  constructor( private router: Router, private fb: FormBuilder) {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.customerForm.valid) {
      console.log(this.customerForm.value);
    }
  }

  goBack() {
    this.router.navigate(["/customers/index"]);
  }

}
