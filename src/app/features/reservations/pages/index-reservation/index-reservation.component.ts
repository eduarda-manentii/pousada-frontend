import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterModalComponent } from '../../../../shared/components/filter-modal/filter-modal.component';
import { FiltroConfig } from '../../../../shared/interfaces/filtro-config';
import { useList } from '../../../../shared/composables/use-list';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { Cliente } from '../../../customers/interfaces/cliente';
import { Quarto } from '../../../rooms/interfaces/quarto';

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
    try {
      const quartosPage = await this.api.get<Quarto>('/quartos');
      const clientesPage = await this.api.get<Cliente>('/clientes');

      const quartoOptions = quartosPage.content.map(q => ({
        label: q.nome,
        value: q.id
      }));

      const clienteOptions = clientesPage.content.map(c => ({
        label: c.nome,
        value: c.id
      }));

      this.filtroReservas = this.filtroReservas.map(f => {
        if (f.key === 'quarto') return { ...f, options: quartoOptions };
        if (f.key === 'cliente') return { ...f, options: clienteOptions };
        return f;
      });

    } catch (err) {
      console.error('Erro ao carregar opções de filtros', err);
    }
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
