import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../../../../shared/components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { ApiError } from '../../../../core/errors/api-error';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    PrimaryInputComponent,
    DefaultLoginLayoutComponent,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private toastService: ToastrService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }

  async submit() {
    const { email, senha } = this.loginForm.value;
    try {
      await this.apiService.login(email, senha);
      this.toastService.success("Login feito com sucesso!");
      this.router.navigate(['/home']);
    } catch (error) {
      if(error instanceof ApiError) {
        this.toastService.error(error.mensagem);
      }
    }
  }

  navigate() {
    this.router.navigate(["/signup"]);
  }

}
