import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { Complement } from '../../interfaces/Complement';

@Component({
  selector: 'app-new-voucher',
  standalone: true,
  imports: [
    HeaderComponent, 
    ReactiveFormsModule,
    NgxMaskDirective,
    CommonModule
  ],
  templateUrl: './new-complement.component.html',
  styleUrl: './new-complement.component.scss',
  providers: [provideNgxMask()]
})
export class NewComplementComponent implements OnInit {
  complementForm!: FormGroup;
  complementId?: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private api: ApiService,
    private toastService: ToastrService,
  ) {}

  async ngOnInit() {
    this.complementId = Number(this.route.snapshot.paramMap.get('id'));
    this.buildForms();

    if (this.complementId) {
      const voucher = await this.api.getById<Complement>(`/complementos/${this.complementId}`);

      this.complementForm.patchValue(voucher);
    } else {
      this.complementForm.get('status')?.disable();
    }
  }

  buildForms() {
    this.complementForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(5)]],
      valor: ['', [Validators.required, Validators.min(1)]],
      status: ['ATIVO', [Validators.required]],
    });
  }

  async onSubmit() {
    
    if (this.complementForm.valid) {
      const complementdata = this.complementForm.getRawValue();

      const valorBruto = this.complementForm.get('valor')?.value;
      complementdata.valor = + valorBruto
        .replace('R$ ', '')
        .replace(/\./g, '')
        .replace(',', '.');

      if (this.complementId) {

        try {
          await this.api.put(`/complementos/${this.complementId}`, complementdata);
          this.toastService.success("Complemento atualizado com sucesso!");
          this.router.navigate(['/complements/index'])
        } catch (error: any) {
          this.toastService.error(error);
        }
      } else {

        try {
          await this.api.create('/complementos', complementdata);
          this.toastService.success("Complemento salvo com sucesso!");
          this.router.navigate(['/complements/index'])
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
    this.complementForm.get('status')?.setValue(checked ? 'ATIVO' : 'INATIVO');
  }

  goBack() {
    this.router.navigate(["/complement/index"]);
  }
}
