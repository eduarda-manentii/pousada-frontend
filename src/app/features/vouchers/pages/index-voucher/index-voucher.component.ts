import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Voucher } from '../../interfaces/Voucher';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { FilterModalComponent } from '../../../../shared/components/filter-modal/filter-modal.component';
import { FiltroConfig } from '../../../../shared/interfaces/filtro-config';

@Component({
  selector: 'app-index-voucher',
  standalone: true,
  imports: [
    HeaderComponent, 
    RouterLink, 
    CommonModule,
    FilterModalComponent
  ],
  templateUrl: './index-voucher.component.html',
  styleUrl: './index-voucher.component.scss'
})
export class IndexVoucherComponent implements OnInit {
  vouchers: Voucher[] = [];
  currentPage = 0;
  totalPages = 0;
  pageSize = 15;

  voucherFilter: FiltroConfig[] = [
    {key: 'codigo', label: 'Código', type: 'text'},
    {key: 'dataDeInicio', label: 'Período', type: 'range', subtype: 'date'},
  ]

  constructor(
    private api: ApiService,
  ) {}

  ngOnInit() {
    this.loadPage(0);
  }

  async loadPage(page: number) {
    const endpoint = '/cupons';
    const params = {
      page: page.toString(),
      size: this.pageSize.toString(),
    };

    const data = await this.api.get<Voucher>(endpoint, params);
    this.vouchers = data.content;
    this.currentPage = data.number;
    this.totalPages = data.totalPages;
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

  async applyFilters(filters: any) {
    const data = await this.api.getWithFilters<any>(
      '/cupons',
      0,
      this.pageSize,
      'id,asc',
      filters
    );
    this.vouchers = data.content.sort((a: any, b: any) =>
      a.nome.localeCompare(b.nome)
    );
    this.currentPage = data.number;
    this.totalPages = data.totalPages;
  }
}
