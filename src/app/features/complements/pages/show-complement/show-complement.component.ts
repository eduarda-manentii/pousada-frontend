import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalService } from '../../../../shared/services/confirm-modal.service';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { Complement } from '../../interfaces/complement';

@Component({
  selector: 'app-show-complement',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    RouterLink,
    ConfirmModalComponent
  ],
  templateUrl: './show-complement.component.html',
  styleUrl: './show-complement.component.scss'
})
export class ShowComplementComponent {
  @ViewChild(ConfirmModalComponent) confirmModal!: ConfirmModalComponent;
  complement!: Complement;
  complementId?: string;

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
      this.complementId = id;
      const data = await this.api.getById<Complement>(`/complementos/${id}`);
      this.complement = data;
    }
  }

  excluir() {
    this.confirmModal.open('Tem certeza que deseja excluir este complemento?');
  }

  async onConfirmedDelete(result: boolean) {
    if (result) {
      try {
        await this.api.delete(`/complementos/${this.complementId}`);
        this.toastService.success('Complemento excluído com sucesso.');
        this.router.navigate(['/complements/index']);
      } catch (error: any) {
        this.toastService.error(error);
      }
    }
  }

  editComplement(complementId: number) {
    this.router.navigate(['/complements/edit', complementId]);
  }

}
