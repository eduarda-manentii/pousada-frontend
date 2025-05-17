import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Voucher } from '../../interfaces/Voucher';
import { ApiService } from '../../../../shared/services/backend-api.service';

@Component({
  selector: 'app-index-voucher',
  standalone: true,
  imports: [HeaderComponent, RouterLink, CommonModule],
  templateUrl: './index-voucher.component.html',
  styleUrl: './index-voucher.component.scss'
})
export class IndexVoucherComponent implements OnInit {
  vouchers: any[] = [];
  currentPage = 0;
  totalPages = 0;
  pageSize = 15;

  constructor(
    private router: Router,
    private api: ApiService,
  ) {}

  ngOnInit() {
    this.loadPage(0);
  }

  loadPage(page: number) {
    const endpoint = 'http://localhost:8081/cupons';
    const params = {
      page: page.toString(),
      size: this.pageSize.toString(),
    };

    this.api.get(endpoint, params).subscribe((data) => {
      this.vouchers = data.content;
      this.currentPage = data.number;
      this.totalPages = data.totalPages
    })
  }

  nextPage() {
    if (this.currentPage + 1 < this.totalPages) {
      this.loadPage(this.currentPage + 1)
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.loadPage(this.currentPage - 1)
    }
  }
}
