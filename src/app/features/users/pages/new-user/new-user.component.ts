import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { RequiredMarkerDirective } from '../../../../shared/directives/required-marker.directive';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../interfaces/Users';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
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
  roles: string[] = ['Administrador', 'Funcionário', 'Gerente'];
  filteredRoles: string[] = [];

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
          this.userForm.patchValue(response);
        } 
      );
    }
  }

  buildForms() {
    this.userForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(1)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
      roles: ['', [Validators.required]]
    });
  }

  onRoleInput() {
    const value = this.userForm.get('roles')?.value?.toLowerCase() || '';

    if (value) {
      this.filteredRoles = this.roles.filter(role => 
        role.toLowerCase().includes(value)
      );
    }
  }

  selectRole(role: string) {
    this.userForm.get('roles')?.setValue(role);
    this.filteredRoles = [];
  }

  openRoleModal() {
    console.log('Abrir modal de criação de role...');
    // Aqui você chamará a modal futuramente
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
