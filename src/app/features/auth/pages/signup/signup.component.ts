import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../../../../shared/components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../../shared/services/backend-api.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    PrimaryInputComponent,
    DefaultLoginLayoutComponent,
    ReactiveFormsModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  singupForm!: FormGroup;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private toastService: ToastrService
  ) {
    this.singupForm = new FormGroup({
      nome: new FormControl('', [Validators.required, Validators.minLength(4)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }

  async submit() {
    try {
      await this.apiService.signup(
        this.singupForm.value.nome,
        this.singupForm.value.email,
        this.singupForm.value.senha
      );

      this.toastService.success("Login feito com sucesso!");
      this.router.navigate(['/home']);
    } catch (error) {
      this.toastService.error("Não foi possível efetuar o login.");
    }
  }

  navigate() {
    this.router.navigate(["/login"]);
  }

}
