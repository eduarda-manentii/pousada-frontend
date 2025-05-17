import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { Voucher } from '../../interfaces/Voucher';

@Component({
  selector: 'app-new-voucher',
  standalone: true,
  imports: [
    HeaderComponent, 
    ReactiveFormsModule,
    NgxMaskDirective,
    CommonModule
  ],
  templateUrl: './new-voucher.component.html',
  styleUrl: './new-voucher.component.scss',
  providers: [provideNgxMask()]
})
export class NewVoucherComponent implements OnInit {
  voucherForm!: FormGroup;
  voucherId?: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private api: ApiService,
    private toastService: ToastrService,
  ) {}

  ngOnInit() {
    this.voucherId = Number(this.route.snapshot.paramMap.get('id'));
    this.buildForms()

    if (this.voucherId) {
      this.api.getById<Voucher>(`http://localhost:8081/cupons/${this.voucherId}`).subscribe({
        next: (voucher) => {
          this.voucherForm.patchValue(voucher);
        }
      });
    } else {
      this.voucherForm.get('status')?.disable();
    }
  }

  buildForms() {
    this.voucherForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      nome: ['', [Validators.required, Validators.minLength(5)]],
      dataDeInicio: ['', [Validators.required, Validators.minLength(5)]],
      dataDeVencimento: ['', [Validators.required]],
      porcentagemDeDesconto: ['', [Validators.required]],
      quantidadeMaximaDeUso: ['', [Validators.required]],
      status: ['ATIVO', [Validators.required]],
    });
  }

  onSubmit() {
    
    if (this.voucherForm.valid) {
      const voucherdata = this.voucherForm.getRawValue();

      if (this.voucherId) {
        console.log(this.voucherId);

        this.api.put(`http://localhost:8081/cupons/${this.voucherId}`, voucherdata).subscribe({
          next: (response) => {
            this.toastService.success("Cupom atualizado com sucesso!");
            this.router.navigate(['/vouchers/index'])
          },
          error: (error) => {
            const message = error.error.message ?? 'Erro ao alterar o cupom.';
            this.toastService.error(message);
          }
        })
      } else {
        console.log(voucherdata);
        this.api.create(`http://localhost:8081/cupons`, voucherdata).subscribe({
          next: (response) => {
            this.toastService.success("Cupom salvo com sucesso!");
            this.voucherForm.reset();
          },
          error: (error) => {
            const message = error.error.message ?? 'Erro ao salvar o cupom.';
            this.toastService.error(message);
          }
        })
      }
    } else {
      this.toastService.error('Formulário inválido. Verifique os campos obrigatórios.')
    }
  };

  onStatusChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.voucherForm.get('status')?.setValue(checked ? 'ATIVO' : 'INATIVO');
  }

  goBack() {
    this.router.navigate(["/cupons/index"]);
  }
}
