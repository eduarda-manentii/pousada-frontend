import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { FilterModalComponent } from '../../../../shared/components/filter-modal/filter-modal.component';
import { FiltroConfig } from '../../../../shared/interfaces/filtro-config';
import { Complement } from '../../interfaces/Complement';

@Component({
  selector: 'app-index-complement',
  standalone: true,
  imports: [
    HeaderComponent, 
    RouterLink, 
    CommonModule,
    FilterModalComponent
  ],
  templateUrl: './index-complement.component.html',
  styleUrl: './index-complement.component.scss'
})
export class IndexComplementComponent implements OnInit {
  complements: Complement[] = [];
  currentPage = 0;
  totalPages = 0;
  pageSize = 15;

  complementFilter: FiltroConfig[] = [
    {key: 'nome', label: 'Nome', type: 'text'},
  ];

  constructor(
    private api: ApiService,
  ) {}

  ngOnInit() {
    this.loadPage(0);
  }

  async loadPage(page: number) {
    const endpoint = '/complementos';
    const params = {
      page: page.toString(),
      size: this.pageSize.toString(),
    };

    const data = await this.api.get<Complement>(endpoint, params);
    this.complements = data.content;
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
      '/complementos',
      0,
      this.pageSize,
      'id,asc',
      filters
    );
    this.complements = data.content.sort((a: any, b: any) =>
      a.nome.localeCompare(b.nome)
    );
    this.currentPage = data.number;
    this.totalPages = data.totalPages;
  }
}
