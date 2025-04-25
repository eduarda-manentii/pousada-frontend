import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { RouterLink } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index-customer',
  standalone: true,
  imports: [HeaderComponent, RouterLink, CommonModule],
  templateUrl: './index-customer.component.html',
  styleUrl: './index-customer.component.scss'
})
export class IndexCustomerComponent implements OnInit {
  customers: any[] = [];

  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    this.customerService.getCustomers().subscribe((data) => {
      this.customers = data;
    });
  }
}
