import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../components/header/header.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import {  Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor(private router: Router, private fb: FormBuilder) {
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

  states = [
    { abbreviation: 'AC', name: 'Acre' },
    { abbreviation: 'AL', name: 'Alagoas' },
    { abbreviation: 'AP', name: 'Amapá' },
    { abbreviation: 'AM', name: 'Amazonas' },
    { abbreviation: 'BA', name: 'Bahia' },
    { abbreviation: 'CE', name: 'Ceará' },
    { abbreviation: 'DF', name: 'Distrito Federal' },
    { abbreviation: 'ES', name: 'Espírito Santo' },
    { abbreviation: 'GO', name: 'Goiás' },
    { abbreviation: 'MA', name: 'Maranhão' },
    { abbreviation: 'MT', name: 'Mato Grosso' },
    { abbreviation: 'MS', name: 'Mato Grosso do Sul' },
    { abbreviation: 'MG', name: 'Minas Gerais' },
    { abbreviation: 'PA', name: 'Pará' },
    { abbreviation: 'PB', name: 'Paraíba' },
    { abbreviation: 'PR', name: 'Paraná' },
    { abbreviation: 'PE', name: 'Pernambuco' },
    { abbreviation: 'PI', name: 'Piauí' },
    { abbreviation: 'RJ', name: 'Rio de Janeiro' },
    { abbreviation: 'RN', name: 'Rio Grande do Norte' },
    { abbreviation: 'RS', name: 'Rio Grande do Sul' },
    { abbreviation: 'RO', name: 'Rondônia' },
    { abbreviation: 'RR', name: 'Roraima' },
    { abbreviation: 'SC', name: 'Santa Catarina' },
    { abbreviation: 'SP', name: 'São Paulo' },
    { abbreviation: 'SE', name: 'Sergipe' },
    { abbreviation: 'TO', name: 'Tocantins' },
  ];

  onSubmit() {
    if (this.customerForm.valid) {
      console.log(this.customerForm.value);
    }
  }

  goBack() {
    this.router.navigate(["/customers/index"]);
  }

  searchCep() {
    const cep = this.customerForm.get('zip')?.value?.replace(/\D/g, '');
    if (cep?.length === 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
          if (!data.erro) {
            this.customerForm.patchValue({
              street: data.logradouro,
              city: data.localidade,
              state: data.uf
            });
            this.customerForm.get('street')?.disable();
            this.customerForm.get('city')?.disable();
            this.customerForm.get('state')?.disable();
          } else {
            this.enableAddressFields();
          }
        })
        .catch(() => {
          console.error('Erro ao buscar CEP');
        });
    }
  }

  enableAddressFields() {
    this.customerForm.get('street')?.enable();
    this.customerForm.get('city')?.enable();
    this.customerForm.get('state')?.enable();
  }

}
