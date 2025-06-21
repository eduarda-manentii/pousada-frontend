import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { Complement } from '../../interfaces/Complement';
import { RequiredMarkerDirective } from '../../../../shared/directives/required-marker.directive';

@Component({
  selector: 'app-new-complement',
  standalone: true,
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    NgxMaskDirective,
    CommonModule,
    RequiredMarkerDirective
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

  ngOnInit() {
    this.complementId = Number(this.route.snapshot.paramMap.get('id'));
    this.buildForms();

    if (this.complementId) {
      this.api.getById<Complement>(`/complementos/${this.complementId}`).then(
        response => {
          this.complementForm.patchValue(response);
        }
      );
    }
  }

  buildForms() {
    this.complementForm = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      valor: [null, [Validators.required, Validators.min(0.01)]],
      descricao: ['', [Validators.required]],
    });
  }

  async onSubmit() {
    if (this.complementForm.valid) {
      const complementdata = this.complementForm.value;
      if (this.complementId) {
        try {
          console.log("Complemento a ser salvo");
          console.log(complementdata);
          complementdata.id = this.complementId;
          await this.api.put(`/complementos`, complementdata);
          this.toastService.success("Complemento atualizado com sucesso!");
          this.router.navigate(['/complements/index'])
        } catch (error: any) {
          this.toastService.error(error);
        }
      } else {
        try {
          console.log("Complemento a ser salvo");
          console.log(complementdata);
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

  goBack() {
    this.router.navigate(["/complements/index"]);
  }
}
