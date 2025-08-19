import { Component } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { useList } from '../../../../shared/composables/use-list';
import { FiltroConfig } from '../../../../shared/interfaces/filtro-config';
import { FilterModalComponent } from '../../../../shared/components/filter-modal/filter-modal.component';

@Component({
  selector: 'app-reservations-report',
  standalone: true,
  imports: [
    HeaderComponent,
    FilterModalComponent
  ],
  templateUrl: './reservations-report.component.html',
  styleUrl: './reservations-report.component.scss'
})
export class ReservationsReportComponent {
  filtroRelatorio: FiltroConfig[] = [
    { key: 'nome', label: 'Nome do Quarto', type: 'text' },
    { key: 'status', label: 'Status', type: 'select' },
    { keys: ['checkIn', 'checkOut'], label: 'Período', type: 'range', subtype: 'date'},
  ];
  private list = useList<any>('/reservas', (a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());

  aplicarFiltros(filtros: any) {
    this.list.applyFilters(filtros);
  }

}
