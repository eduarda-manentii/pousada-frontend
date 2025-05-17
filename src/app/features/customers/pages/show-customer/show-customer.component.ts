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

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.customerId = id;
      const data = await this.api.getById(`/clientes/${id}`);
      this.customer = data;
    }
  }

 excluir() {
    this.confirmModal.open('Tem certeza que deseja excluir este cliente?');
  }

  async onConfirmedDelete(result: boolean) {
    if (result) {

      try {
        await this.api.delete(`/clientes/${this.customerId}`)
        this.toastService.success('Cliente excluído com sucesso.');
        this.router.navigate(['/customers/index']);
      } catch (error: any) {
        this.toastService.error(error);
      }
    }
  }

}
