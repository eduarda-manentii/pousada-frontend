import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { ToastrService } from 'ngx-toastr';
import { Complement } from '../../interfaces/Complement';
import { ConfirmModalService } from '../../../../shared/services/confirm-modal.service';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-show-voucher',
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
export class ShowComplementComponent implements OnInit {
  @ViewChild(ConfirmModalComponent) confirmModal!: ConfirmModalComponent;
  complement!: Complement;
  voucherId!: string;

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
      const data = await this.api.getById<Complement>(`/complementos/${id}`);
      this.complement = data;
    }
  }

  openModal() {
    this.confirmModal.open('Tem certeza que deseja excluir este complemento?');
  }

  async onConfirmedInativation(result: boolean) {

    if (result) {
      try {
        await this.api.delete(`/complementos/${this.voucherId}`);
        this.toastService.success('Complemento inativado com sucesso');
        this.router.navigate(['/complements/index']);
      } catch (error: any) {
        this.toastService.error(error);
      }
    }
  }
}
