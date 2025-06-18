import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { ConfirmModalService } from '../../../../shared/services/confirm-modal.service';
import { CapitalizePipe } from '../../../../shared/pipes/capitalize.pipe';
import { PhoneFormatPipe } from '../../../../shared/pipes/phone-format.pipe';

@Component({
  selector: 'app-show-reservation',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    RouterLink,
    CapitalizePipe,
    PhoneFormatPipe,
    ConfirmModalComponent
  ],
  templateUrl: './show-reservation.component.html',
  styleUrl: './show-reservation.component.scss'
})
export class ShowReservationComponent {
  @ViewChild(ConfirmModalComponent) confirmModal!: ConfirmModalComponent;
  reservation: any;
  reservationId?: string;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private toastService: ToastrService,
    public confirmService: ConfirmModalService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID recebido:', id);
    if (id) {
      this.reservationId = id;
      const data = await this.api.getById(`/reservas/${id}`);
      this.reservation = data;
    }
  }

  excluir() {
    this.confirmModal.open('Tem certeza que deseja excluir esta reserva?');
  }

  async onConfirmedDelete(result: boolean) {
    if (result) {
      try {
        await this.api.delete(`/reservas/${this.reservationId}`);
        this.toastService.success('Reserva excluída com sucesso.');
        this.router.navigate(['/reservations/index']);
      } catch (error: any) {
        this.toastService.error(error);
      }
    }
  }

  editReservation(id: number) {
    this.router.navigate(['/reservations/edit', id]);
  }

}
