import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { useList } from '../../../../shared/composables/use-list';
import { FiltroConfig, FiltroConfigValue } from '../../../../shared/interfaces/filtro-config';
import { FilterModalComponent } from '../../../../shared/components/filter-modal/filter-modal.component';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { Cliente } from '../../../customers/interfaces/cliente';
import { Quarto } from '../../../rooms/interfaces/quarto';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG  } from 'ngx-echarts';
import { CommonModule } from '@angular/common';
import * as echarts from 'echarts';

@Component({
  selector: 'app-reservations-report',
  standalone: true,
  imports: [
    HeaderComponent,
    FilterModalComponent,
    NgxEchartsModule,
    CommonModule
  ],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useValue: { echarts }
    }
  ],
  templateUrl: './reservations-report.component.html',
  styleUrl: './reservations-report.component.scss'
})
export class ReservationsReportComponent implements OnInit {

  constructor(private api: ApiService) {}

  showChart = false;
  chartOptions: any = {};
  quartoSelecionadoNome: string | null = null;
  statusDaReservaSelecionado: string | null = null;
  resumoStatus: Record<string, number> = {};

  filtroRelatorio: FiltroConfig[] = [
    { key: 'quarto', label: 'Quarto', type: 'select', options: [] },
    { key: 'cliente', label: 'Cliente', type: 'select', options: [] },
    { key: 'statusDaReserva', label: 'Status', type: 'select', options: [] },
    { keys: ['checkIn', 'checkOut'], label: 'Período', type: 'range', subtype: 'date'}
  ];

  private list = useList<any>('/reservas', (a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());
  private todasReservasOriginais: any[] = [];

  ngOnInit(): void {
    this.list.loadPage(0).then(() => {
      this.todasReservasOriginais = this.list.items();
    });
    this.loadSelectOptions();
  }

  async loadSelectOptions() {
    try {
      const quartosPage = await this.api.get<Quarto>('/quartos');
      const clientesPage = await this.api.get<Cliente>('/clientes');

      const quartoOptions = quartosPage.content.map(q => ({ label: q.nome, value: q.id }));
      const clienteOptions = clientesPage.content.map(c => ({ label: c.nome, value: c.id }));

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

    const filtroQuarto = filtros.find((f: any) => f.key === 'quarto')?.value;
    const filtroStatus = filtros.find((f: any) => f.key === 'statusDaReserva')?.value;

    if (filtroQuarto) {
      this.gerarGraficoPorStatus(filtroQuarto);
    } else if (filtroStatus) {
      this.gerarGraficoPorStatusSemQuarto(filtroStatus);
    } else {
      this.showChart = false;
    }
  }

  gerarGraficoPorStatus(quartoId: number | string) {
    const id = typeof quartoId === 'string' ? parseInt(quartoId) : quartoId;
    const reservasDoQuarto = this.todasReservasOriginais.filter(r => r.quarto?.id === id);

    const statusPossiveis = ['ABERTA', 'FECHADA', 'CANCELADA', 'CONCLUIDA'];
    const statusContagem: Record<string, number> = {};
    statusPossiveis.forEach(s => statusContagem[s] = 0);

    reservasDoQuarto.forEach(r => {
      statusContagem[r.statusDaReserva] = (statusContagem[r.statusDaReserva] || 0) + 1;
    });
    this.resumoStatus = { ...statusContagem };

    this.chartOptions = {
      title: { text: 'Reservas por quarto selecionado', left: 'center' },
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left' },
      series: [{
        name: 'Reservas',
        type: 'pie',
        radius: '50%',
        data: Object.entries(statusContagem).map(([status, count]) => ({ value: count, name: status })),
        emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' } }
      }]
    };
    this.showChart = true;
  }

  gerarGraficoPorStatusSemQuarto(statusFiltro: string) {
    const todasReservasArray = this.todasReservasOriginais;
    if (!todasReservasArray || todasReservasArray.length === 0) {
      this.showChart = false;
      return;
    }
    const quartosMap: Record<string, number> = {};

    todasReservasArray.forEach(r => {
      const quartoNome = r.quarto?.nome || 'Sem Quarto';
      if (statusFiltro && r.statusDaReserva !== statusFiltro) return;

      quartosMap[quartoNome] = (quartosMap[quartoNome] || 0) + 1;
    });

    const nomesQuartos = Object.keys(quartosMap);
    const contagens = Object.values(quartosMap);
    this.chartOptions = {
      title: { text: `Reservas ${statusFiltro}`, left: 'center' },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: nomesQuartos,
        name: 'Quartos'
      },
      yAxis: {
        type: 'value',
        name: 'Quantidade'
      },
      series: [
        {
          data: contagens,
          type: 'bar',
          color: '#007bff'
        }
      ]
    };
    this.showChart = true;
  }

}
