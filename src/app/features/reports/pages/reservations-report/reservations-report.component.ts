import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { useList } from '../../../../shared/composables/use-list';
import { FiltroConfig } from '../../../../shared/interfaces/filtro-config';
import { FilterModalComponent } from '../../../../shared/components/filter-modal/filter-modal.component';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { Cliente } from '../../../customers/interfaces/cliente';
import { Quarto } from '../../../rooms/interfaces/quarto';

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
export class ReservationsReportComponent implements OnInit {

  constructor(
    private api: ApiService
  ) {}

  filtroRelatorio: FiltroConfig[] = [
    { key: 'quarto', label: 'Quarto', type: 'select', options: [] },
    { key: 'cliente', label: 'Cliente', type: 'select', options: [] },
    { key: 'statusDaReserva', label: 'Status', type: 'select', options: [] },
    { keys: ['checkIn', 'checkOut'], label: 'Período', type: 'range', subtype: 'date'}
  ];

  private list = useList<any>('/reservas', (a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());

  ngOnInit(): void {
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
      
      const statusOptions = [
        { label: 'Aberta', value: 'ABERTA' },
        { label: 'Fechada', value: 'FECHADA' },
        { label: 'Cancelada', value: 'CANCELADA' },
        { label: 'Concluida', value: 'CONCLUIDA' }
      ];

      this.filtroRelatorio = this.filtroRelatorio.map(f => {
        if (f.key === 'quarto') return { ...f, options: quartoOptions };
        if (f.key === 'cliente') return { ...f, options: clienteOptions };
        if (f.key === 'statusDaReserva') return { ...f, options: statusOptions };
        return f;
      });

    } catch (err) {
      console.error('Erro ao carregar opções de filtros', err);
    }
  }

  aplicarFiltros(filtros: any) {
    this.list.applyFilters(filtros);
  }

}
