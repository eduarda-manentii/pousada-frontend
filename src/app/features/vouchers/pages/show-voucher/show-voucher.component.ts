import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { ToastrService } from 'ngx-toastr';
import { Voucher } from '../../interfaces/Voucher';
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
  templateUrl: './show-voucher.component.html',
  styleUrl: './show-voucher.component.scss'
})
export class ShowVoucherComponent implements OnInit {
  @ViewChild(ConfirmModalComponent) confirmModal!: ConfirmModalComponent;
  voucher!: Voucher;
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
      const data = await this.api.getById<Voucher>(`/cupons/${id}`);
      this.voucher = data;
      this.voucherId = id;
    }
  }

  openModal() {
    this.confirmModal.open('Tem certeza que deseja excluir este cupom?');
  }

  async onConfirmedInativation(result: boolean) {

    if (result) {
      try {
        console.log(`/cupons/${this.voucherId}`);
        await this.api.delete(`/cupons/${this.voucherId}`);
        this.toastService.success('Cupom inativado com sucesso');
        this.router.navigate(['/vouchers/index']);
      } catch (error: any) {
        this.toastService.error(error);
      }
    }
  }
}
