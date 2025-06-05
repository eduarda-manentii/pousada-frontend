import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalService } from '../../../../shared/services/confirm-modal.service';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-show-amenity',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    RouterLink,
    ConfirmModalComponent
  ],
  templateUrl: './show-amenity.component.html',
  styleUrl: './show-amenity.component.scss'
})
export class ShowAmenityComponent {
  @ViewChild(ConfirmModalComponent) confirmModal!: ConfirmModalComponent;
  amenity: any;
  amenityId?: string;

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
      this.amenityId = id;
      const data = await this.api.getById(`/amenidades/${id}`);
      this.amenity = data;
    }
  }

  excluir() {
    this.confirmModal.open('Tem certeza que deseja excluir esta amenidade?');
  }

  async onConfirmedDelete(result: boolean) {
    if (result) {
      try {
        await this.api.delete(`/amenidades/${this.amenityId}`);
        this.toastService.success('Amenidade excluída com sucesso.');
        this.router.navigate(['/amenities/index']);
      } catch (error: any) {
        this.toastService.error(error);
      }
    }
  }

  editCustomer(customerId: number) {
    this.router.navigate(['/customers/edit', customerId]);
  }

}