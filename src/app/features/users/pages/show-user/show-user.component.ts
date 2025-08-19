import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { User } from '../../interfaces/users';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalService } from '../../../../shared/services/confirm-modal.service';

@Component({
  selector: 'app-show-user',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    RouterLink,
    ConfirmModalComponent
  ],
  templateUrl: './show-user.component.html',
  styleUrl: './show-user.component.scss'
})
export class ShowUserComponent {
  @ViewChild(ConfirmModalComponent) confirmModal!: ConfirmModalComponent;
  user!: User;
  userId!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private toastService: ToastrService,
    public confirmService: ConfirmModalService,
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      const data = await this.api.getById<User>(`/usuarios/${id}`);
      this.user = data;
      this.userId = id;
    }
  }

  openModal() {
    this.confirmModal.open('Tem certeza que deseja excluir este usuário?');
  }

  async onConfirmedInativation(result: boolean) {
    if (result) {
      try {
        await this.api.delete(`/usuarios/${this.userId}`);
        this.toastService.success('Usuário excluído com sucesso');
        this.router.navigate(['/users/index']);
      } catch (error: any) {
        this.toastService.error(error);
      }
    }
  }

  editUser(userId: any) {
    this.router.navigate(['/users/edit', userId]);
  }

}
