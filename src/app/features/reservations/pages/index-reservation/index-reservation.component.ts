import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterModalComponent } from '../../../../shared/components/filter-modal/filter-modal.component';
import { FiltroConfig } from '../../../../shared/interfaces/filtro-config';
import { useList } from '../../../../shared/composables/use-list';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { Cliente } from '../../../customers/interfaces/cliente';
import { Quarto } from '../../../rooms/interfaces/Quarto';

@Component({
  selector: 'app-index-reservation',
  standalone: true,
    imports: [
    HeaderComponent,
    RouterLink,
    CommonModule,
    FilterModalComponent
  ],
  templateUrl: './index-reservation.component.html',
  styleUrl: './index-reservation.component.scss'
})
export class IndexReservationComponent implements OnInit {
  
  constructor(
    private api: ApiService
  ) {}

  filtroReservas: FiltroConfig[] = [
    { key: 'quarto', label: 'Quarto', type: 'select', options: [] },
    { key: 'cliente', label: 'Cliente', type: 'select', options: [] },
    { keys: ['checkIn', 'checkOut'], label: 'Período', type: 'range', subtype: 'date'},
  ];

  private list = useList<any>('/reservas', (a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());

  reservas = this.list.items;
  currentPage = this.list.currentPage;
  totalPages = this.list.totalPages;

  ngOnInit() {
    this.list.loadPage(0);
    this.loadSelectOptions();
  }

  async loadSelectOptions() {

  }

  aplicarFiltros(filtros: any) {
    this.list.applyFilters(filtros);
  }

  nextPage() {
    this.list.nextPage();
  }

  previousPage() {
    this.list.previousPage();
  }

}
