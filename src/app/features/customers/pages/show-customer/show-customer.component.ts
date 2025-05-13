import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { PhoneFormatPipe } from '../../../../shared/pipes/phone-format.pipe';
import { CapitalizePipe } from '../../../../shared/pipes/capitalize.pipe';
import { ConfirmModalService } from '../../../../shared/services/confirm-modal.service';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-show-customer',
  standalone: true,
  imports: 
  [
    HeaderComponent, 
    CommonModule, 
    RouterLink,
    PhoneFormatPipe,
    CapitalizePipe,
    ConfirmModalComponent
  ],
  templateUrl: './show-customer.component.html',
  styleUrl: './show-customer.component.scss'
})
export class ShowCustomerComponent {
  @ViewChild(ConfirmModalComponent) confirmModal!: ConfirmModalComponent;
  customer: any;
  customerId?: string;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private toastService: ToastrService,
    public confirmService: ConfirmModalService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.customerId = id;
      this.api.get(`http://localhost:8081/clientes/${id}`).subscribe((data) => {
        this.customer = data;
      });
    }
  }

 excluir() {
    this.confirmModal.open('Tem certeza que deseja excluir este cliente?');
  }

  onConfirmedDelete(result: boolean) {
    if (result) {
      this.api.delete(`http://localhost:8081/clientes/${this.customerId}`).subscribe({
        next: () => {
          this.toastService.success('Cliente excluído com sucesso.');
          this.router.navigate(['/customers/index']);
        },
        error: () => {
          this.toastService.error('Erro ao excluir cliente.');
        }
      });
    }
  }

}
