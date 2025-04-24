import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import {  Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../services/customer.service';
import { STATES } from '../../../../shared/constants/states';
import { ToastrService } from 'ngx-toastr';
import { CepService } from '../../../../shared/services/cep.service';

@Component({
  selector: 'app-new-customer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HeaderComponent,
    NgxMaskDirective,
    CommonModule,
  ],
  templateUrl: './new-customer.component.html',
  styleUrl: './new-customer.component.scss',
  providers: [provideNgxMask()]
})
export class NewCustomerComponent {
  customerForm: FormGroup;
  states = STATES;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private toastService: ToastrService,
    private cepService: CepService,
  ) {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
      street: ['', Validators.required],
      number: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.customerForm.valid) {
      console.log(this.customerForm.value);
      this.toastService.success("Cliente cadastro com sucesso!");
    }
  }

  onSubmit2() {
    if (this.customerForm.valid) {
      const customerData = this.customerForm.getRawValue();
      this.customerService.createCustomer(customerData).subscribe({
        next: (res) => {
          this.toastService.success("Cliente cadastro com sucesso!");
          this.router.navigate(['/customers/index']);
        },
        error: (err) => {
          const message = err?.error?.message || 'Erro ao cadastrar cliente.';
          this.toastService.error(message);
        }
      });
    } else {
      this.toastService.error('Formulário inválido. Verifique os campos obrigatórios.');
    }
  }

  searchCep() {
    const cep = this.customerForm.get('zip')?.value || '';
    this.cepService.searchCep(cep).subscribe({
      next: (data) => {
        if (!data.erro) {
          this.customerForm.patchValue({
            street: data.logradouro,
            city: data.localidade,
            state: data.uf
          });
        } else {
          this.toastService.warning('CEP não encontrado.', 'Atenção');
        }
      },
      error: () => {
        this.toastService.error('Erro ao buscar o CEP.', 'Erro');
      }
    });
  }

  enableAddressFields() {
    this.customerForm.get('street')?.enable();
    this.customerForm.get('city')?.enable();
    this.customerForm.get('state')?.enable();
  }

  goBack() {
    this.router.navigate(["/customers/index"]);
  }

}
