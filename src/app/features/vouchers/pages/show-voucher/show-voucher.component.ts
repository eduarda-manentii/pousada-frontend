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

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.api.getById<Voucher>(`http://localhost:8081/clientes/${id}`).subscribe((data) => {
        this.voucher = data;
      })
    }
  }

  inativar() {
    const confirmado = window.confirm('Tem certeza que deseja inativar este cupom ?');

    if (confirmado) {
      this.api.delete(`http://localhost:8081/clientes/${this.voucherId}`).subscribe({
        next: () => {
          this.toastService.success('Cupom inativado com sucesso');
          this.router.navigate(['/cupons/index']);
        },

        error: (error) => {
          const message = error.error.message || 'Erro ao inativar o cupom.';
          this.toastService.error(message);
        }
      })
    }
  }
}
