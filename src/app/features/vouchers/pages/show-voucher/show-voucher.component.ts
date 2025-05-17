import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { ToastrService } from 'ngx-toastr';
import { Voucher } from '../../interfaces/Voucher';

@Component({
  selector: 'app-show-voucher',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterLink],
  templateUrl: './show-voucher.component.html',
  styleUrl: './show-voucher.component.scss'
})
export class ShowVoucherComponent implements OnInit {
  voucher: any;
  voucherId!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private toastService: ToastrService,
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      const data = await this.api.getById<Voucher>(`/cupons/${id}`);
      this.voucher = data;
    }
  }

  async inativar() {
    const confirmado = window.confirm('Tem certeza que deseja inativar este cupom ?');

    if (confirmado) {
      try {
        await this.api.delete(`/cupons/${this.voucherId}`);
        this.toastService.success('Cupom inativado com sucesso');
        this.router.navigate(['/cupons/index']);
      } catch (error: any) {
        this.toastService.error(error);
      }
    }
  }
}
