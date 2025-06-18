import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RequiredMarkerDirective } from '../../../../shared/directives/required-marker.directive';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../interfaces/Users';

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HeaderComponent,
    ReactiveFormsModule,
    CommonModule,
    RequiredMarkerDirective
  ],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.scss'
})
export class NewUserComponent implements OnInit {

  userForm!: FormGroup;
  userId?: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private api: ApiService,
    private toastService: ToastrService,
  ) {}

  ngOnInit() {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.buildForms();

    if (this.userId) {
      this.api.getById<User>(`/usuarios/${this.userId}`).then(
        response => {
          const { senha, ...rest } = response;
          this.userForm.patchValue({ ...rest, senha: '' });
        }
      );
    }
  }

  buildForms() {
    this.userForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(1)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
    });
  }

  async onSubmit() {
    if (this.userForm.valid) {
      const userdata = this.userForm.value;

      console.log(userdata);

      if (this.userId) {

        try {
          await this.api.put(`/usuarios/${this.userId}`, userdata);
          this.toastService.success("Usuário atualizado com sucesso!");
          this.router.navigate(['/users/index'])
        } catch (error: any) {
          this.toastService.error(error);
        }
      } else {

        try {
          await this.api.create('/usuarios', userdata);
          this.toastService.success("Usuário salvo com sucesso!");
          this.router.navigate(['/users/index'])
        } catch (error: any) {
          this.toastService.error(error);
        }
      }
    } else {
      this.toastService.error('Formulário inválido. Verifique os campos obrigatórios.')
    }
  };

  goBack() {
    this.router.navigate(["/users/index"]);
  }

}
