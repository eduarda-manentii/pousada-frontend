import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { PhoneFormatPipe } from '../../../../shared/pipes/phone-format.pipe';
import { CapitalizePipe } from '../../../../shared/pipes/capitalize.pipe';

@Component({
  selector: 'app-index-customer',
  standalone: true,
  imports: [
    HeaderComponent, 
    RouterLink, 
    CommonModule,
    PhoneFormatPipe,
    CapitalizePipe
  ],
  templateUrl: './index-customer.component.html',
  styleUrl: './index-customer.component.scss'
})
export class IndexCustomerComponent implements OnInit {
  customers: any[] = [];
  currentPage = 0;
  totalPages = 0;
  pageSize = 15;

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPage(0);
  }

  loadPage(page: number) {
    const endpoint = 'http://localhost:8081/clientes';
    const params = {
      page: page.toString(),
      size: this.pageSize.toString()
    };

    this.api.get(endpoint, params).subscribe((data) => {
      this.customers = data.content.sort((a: any, b: any) => 
        a.nome.localeCompare(b.nome)
      );
      this.currentPage = data.number;
      this.totalPages = data.totalPages;
    });
  }

  nextPage() {
    if (this.currentPage + 1 < this.totalPages) {
      this.loadPage(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.loadPage(this.currentPage - 1);
    }
  }

}
