import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { Voucher } from '../../interfaces/Voucher';
import { RequiredMarkerDirective } from '../../../../shared/directives/required-marker.directive';

@Component({
  selector: 'app-new-voucher',
  standalone: true,
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    CommonModule,
    RequiredMarkerDirective
  ],
  templateUrl: './new-voucher.component.html',
  styleUrl: './new-voucher.component.scss'
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
    this.buildForms();

    if (this.voucherId) {
      this.api.getById<Voucher>(`/cupons/${this.voucherId}`).then(
        response => {
          const dataPatch = {
            ...response,
            dataDeInicio: this.formatDateToDateInput(new Date(response.dataDeInicio)),
            dataDeVencimento: this.formatDateToDateInput(new Date(response.dataDeVencimento)),
          };
          this.voucherForm.patchValue(dataPatch);
        }
      );
    }
  }

  buildForms() {
    this.voucherForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      nome: ['', [Validators.required, Validators.minLength(1)]],
      dataDeInicio: ['', [Validators.required, Validators.minLength(5)]],
      dataDeVencimento: ['', [Validators.required]],
      porcentagemDeDesconto: [0, [Validators.required]],
      quantidadeMaximaDeUso: [0, [Validators.required]],
    });
  }

  async onSubmit() {
    if (this.voucherForm.valid) {
      const voucherdata = this.voucherForm.value;
      if (this.voucherId) {
        try {
          voucherdata.id = this.voucherId;
          await this.api.put(`/cupons`, voucherdata);
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

  goBack() {
    this.router.navigate(["/vouchers/index"]);
  }
}
