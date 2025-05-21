import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CapitalizePipe } from '../../../../shared/pipes/capitalize.pipe';
import { FilterModalComponent } from '../../../../shared/components/filter-modal/filter-modal.component';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { FiltroConfig } from '../../../../shared/interfaces/filtro-config';

@Component({
  selector: 'app-index-room',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterLink,
    CommonModule,
    CapitalizePipe,
    FilterModalComponent
  ],
  templateUrl: './index-room.component.html',
  styleUrl: './index-room.component.scss'
})
export class IndexRoomComponent implements OnInit {
  rooms: any[] = [];
  currentPage = 0;
  totalPages = 0;
  pageSize = 15;

  ngOnInit() {
    this.loadPage(0);
  }

  filtroQuartos: FiltroConfig[] = [
    { key: 'nome', label: 'Nome do Quarto', type: 'text' }
  ];

  constructor(
    private api: ApiService,
  ) {}

  async loadPage(page: number) {
  const endpoint = '/quartos';
  const params = {
    page: page.toString(),
    size: this.pageSize.toString()
  };

  const data = await this.api.get(endpoint, params);
    this.rooms = data.content.sort((a: any, b: any) => 
      a.nome.localeCompare(b.nome)
    );
    this.currentPage = data.number;
    this.totalPages = data.totalPages;
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

  async aplicarFiltros(filtros: any) {
    const data = await this.api.getWithFilters<any>(
      '/clientes',
      0,
      this.pageSize,
      'id,asc',
      filtros
    );
    this.rooms = data.content.sort((a: any, b: any) =>
      a.nome.localeCompare(b.nome)
    );
    this.currentPage = data.number;
    this.totalPages = data.totalPages;
  }

}
