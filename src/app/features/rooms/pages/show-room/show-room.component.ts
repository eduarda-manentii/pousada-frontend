import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalService } from '../../../../shared/services/confirm-modal.service';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-show-room',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HeaderComponent,
    ConfirmModalComponent
  ],
  templateUrl: './show-room.component.html',
  styleUrl: './show-room.component.scss'
})
export class ShowRoomComponent {
  @ViewChild(ConfirmModalComponent) confirmModal!: ConfirmModalComponent;
  room: any;
  roomId?: string;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private toastService: ToastrService,
    public confirmService: ConfirmModalService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.roomId = id;
      const data = await this.api.getById(`/quartos/${id}`);
      this.room = data;
    }
  }

  excluir() {
    this.confirmModal.open('Tem certeza que deseja excluir este quarto?');
  }

  async onConfirmedDelete(result: boolean) {
    if (result) {
      try {
        await this.api.delete(`/quartos/${this.roomId}`);
        this.toastService.success('Quarto excluído com sucesso.');
        this.router.navigate(['/rooms/index']);
      } catch (error: any) {
        this.toastService.error(error);
      }
    }
  }
}
