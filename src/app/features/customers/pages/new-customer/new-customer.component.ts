import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../services/customer.service';
import { STATES } from '../../../../shared/constants/states';
import { ToastrService } from 'ngx-toastr';
import { CepService } from '../../../../shared/services/cep.service';
import { LocationService } from '../../services/location.service';

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
  locationForm: FormGroup;
  states = STATES;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private toastService: ToastrService,
    private cepService: CepService,
    private locationService: LocationService,
  ) {
    this.customerForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(5)]],
      celular: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dataDeNascimento: ['', Validators.required],
      sexo: ['', Validators.required],
      cpf: ['', [Validators.required]]
    });

    this.locationForm = this.fb.group({
      rua: ['', Validators.required],
      numero: [''],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      cep: ['', Validators.required],
      bairro: ['', Validators.required]
    })
  } 

  onSubmit() {
    if (this.customerForm.valid && this.locationForm.valid) {
      const locationData = this.locationForm.getRawValue();
      this.locationService.createLocation(locationData).subscribe({
        next: (locationResponse) => {
          const locationId = locationResponse.id;

          const customerData = {
            ...this.customerForm.getRawValue(),
            endereco: { id: locationId }
          }
          console.log('Enviando cliente:', customerData);
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
        }
      });
    } else {
      this.toastService.error('Formulário inválido. Verifique os campos obrigatórios.');
    }
  }

  searchCep() {
    const cep = this.locationForm.get('cep')?.value || '';
    this.cepService.searchCep(cep).subscribe({
      next: (data) => {
        if (!data.erro) {
          this.customerForm.patchValue({
            rua: data.logradouro,
            cidade: data.localidade,
            estado: data.uf,
            bairro: data.bairro
          });
          this.disableAddressFields();
        } else {
          this.toastService.warning('CEP não encontrado.', 'Atenção');
          this.enableAddressFields();
        }
      },
      error: () => {
        this.toastService.error('Erro ao buscar o CEP.', 'Erro');
      }
    });
  }

  disableAddressFields() {
    this.customerForm.get('rua')?.disable();
    this.customerForm.get('cidade')?.disable();
    this.customerForm.get('estado')?.disable();
    this.customerForm.get('bairro')?.disable();
  }

  enableAddressFields() {
    this.customerForm.get('rua')?.enable();
    this.customerForm.get('cidade')?.enable();
    this.customerForm.get('estado')?.enable();
    this.customerForm.get('bairro')?.enable();
  }

  goBack() {
    this.router.navigate(["/customers/index"]);
  }

}
