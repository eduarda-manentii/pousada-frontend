import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { STATES } from '../../../../shared/constants/states';
import { ToastrService } from 'ngx-toastr';
import { CepService } from '../../../../shared/services/cep.service';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { Cliente } from '../../interfaces/cliente';
import { CpfValidatorService } from '../../../../shared/services/cpf-validator.service';
import { RequiredMarkerDirective } from '../../../../shared/directives/required-marker.directive';

@Component({
  selector: 'app-new-customer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HeaderComponent,
    NgxMaskDirective,
    CommonModule,
    RequiredMarkerDirective
  ],
  templateUrl: './new-customer.component.html',
  styleUrl: './new-customer.component.scss',
  providers: [provideNgxMask()]
})
export class NewCustomerComponent implements OnInit {
  customerForm!: FormGroup;
  locationForm!: FormGroup;
  states = STATES;
  customerId?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private api: ApiService,
    private toastService: ToastrService,
    private cepService: CepService
  ) {}

  async ngOnInit() {
    this.customerId = Number(this.route.snapshot.paramMap.get('id'));
    this.buildForms();

    if (this.customerId) {
      const customer = await this.api.getById<Cliente>('/clientes/' + this.customerId);
      this.customerForm.patchValue(customer);
          this.locationForm.patchValue(customer.endereco);
    }
  }

  buildForms() {
    this.customerForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(5)]],
      celular: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dataDeNascimento: ['', Validators.required],
      sexo: ['', Validators.required],
      cpf: ['', [Validators.required, CpfValidatorService.validar]]
    });

    this.locationForm = this.fb.group({
      id: [null],
      rua: ['', Validators.required],
      numero: [''],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      cep: ['', Validators.required],
      bairro: ['', Validators.required],
      complemento: ['']
    });
  }

  async onSubmit() {
    if (this.customerForm.valid && this.locationForm.valid) {
      const locationData = this.locationForm.getRawValue();
      if (this.customerId) {
        try {
          const customerData = {
            id: this.customerId,
            ...this.customerForm.getRawValue(),
            endereco: { id: locationData.id }
          };
          await this.api.put(`/clientes`, customerData);
          this.toastService.success("Cliente atualizado com sucesso!");
          this.router.navigate(['/customers/index'])
        } catch (error: any) {
          this.toastService.error(error);
        }
      } else {
        try {
          const location = await this.api.create('/enderecos', locationData);
          const locationId = location.id;
          const newCustomerData = {
            ...this.customerForm.getRawValue(),
            endereco: { id: locationId }
          };
          await this.api.create('/clientes', newCustomerData);
          this.toastService.success("Cliente salvo com sucesso!");
          this.router.navigate(['/customers/index']);
        } catch (error: any) {
          this.toastService.error(error);
        }
      }
    } else {
      const cpfControl = this.customerForm.get('cpf');
      if (cpfControl?.hasError('cpfInvalido')) {
        this.toastService.error('CPF inválido. Verifique o número digitado.');
      } else {
        this.toastService.error('Formulário inválido. Verifique os campos obrigatórios.');
      }
    }
  }

  searchCep() {
    const cep = this.locationForm.get('cep')?.value || '';
    this.cepService.searchCep(cep).subscribe({
      next: (data) => {
        if (!data.erro) {
          this.locationForm.patchValue({
            rua: data.logradouro,
            cidade: data.localidade,
            estado: data.uf,
            bairro: data.bairro
          });
        } else {
          this.toastService.warning('CEP não encontrado.');
        }
      },
      error: () => {
        this.toastService.error('Erro ao buscar o CEP.');
      }
    });
  }

  goBack() {
    this.router.navigate(["/customers/index"]);
  }

}
