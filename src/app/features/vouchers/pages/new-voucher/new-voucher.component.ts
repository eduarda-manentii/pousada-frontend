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

  async ngOnInit() {
    this.voucherId = Number(this.route.snapshot.paramMap.get('id'));
    this.buildForms();

    if (this.voucherId) {
      const voucher = await this.api.getById<Voucher>(`/cupons/${this.voucherId}`);

      const dataPatch = {
        ...voucher,
        dataDeInicio: this.formatDateToDateInput(new Date(voucher.dataDeInicio)),
        dataDeVencimento: this.formatDateToDateInput(new Date(voucher.dataDeVencimento)),
      };

      this.voucherForm.patchValue(voucher);
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

  async onSubmit() {
    
    if (this.voucherForm.valid) {
      const voucherdata = this.voucherForm.getRawValue();

      if (this.voucherId) {

        try {
          await this.api.put(`/cupons/${this.voucherId}`, voucherdata);
          this.toastService.success("Cupom atualizado com sucesso!");
          this.router.navigate(['/vouchers/index'])
        } catch (error: any) {
          this.toastService.error(error);
        }
      } else {

        try {
          await this.api.create('/cupons', voucherdata);
          this.toastService.success("Cupom salvo com sucesso!");
          this.router.navigate(['/vouchers/index'])
        } catch (error: any) {
          this.toastService.error(error);
        }
      }
    } else {
      this.toastService.error('Formulário inválido. Verifique os campos obrigatórios.')
    }
  };

  formatDateToDateInput = (date: Date): string => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    return `${year}-${month}-${day}`;
  };

  onStatusChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.voucherForm.get('status')?.setValue(checked ? 'ATIVO' : 'INATIVO');
  }

  goBack() {
    this.router.navigate(["/vouchers/index"]);
  }
}
