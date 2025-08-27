import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { useList } from '../../../../shared/composables/use-list';
import { FiltroConfig } from '../../../../shared/interfaces/filtro-config';
import { FilterModalComponent } from '../../../../shared/components/filter-modal/filter-modal.component';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { Cliente } from '../../../customers/interfaces/cliente';
import { Quarto } from '../../../rooms/interfaces/Quarto';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { CommonModule } from '@angular/common';
import * as echarts from 'echarts';

@Component({
  selector: 'app-financial-report',
  standalone: true,
  imports: [
    HeaderComponent,
    FilterModalComponent,
    NgxEchartsModule,
    CommonModule
  ],
  providers: [
    { provide: NGX_ECHARTS_CONFIG, useValue: { echarts } }
  ],
  templateUrl: './financial-report.component.html',
  styleUrl: './financial-report.component.scss'
})
export class FinancialReportComponent implements OnInit {

  showChart = false;
  chartOptions: any = {};
  resumoValores: Record<string, number> = {};

  filtroRelatorio: FiltroConfig[] = [
    { key: 'quarto', label: 'Quarto', type: 'select', options: [] },
    { key: 'cliente', label: 'Cliente', type: 'select', options: [] },
    { key: 'statusDaReserva', label: 'Status', type: 'select', options: [] },
    { keys: ['checkIn', 'checkOut'], label: 'Período', type: 'range', subtype: 'date' }
  ];

  private list = useList<any>('/reservas', (a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());
  private todasReservasOriginais: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.list.loadPage(0).then(() => {
      this.todasReservasOriginais = this.list.items();
    });
    this.loadSelectOptions();
  }

  async loadSelectOptions() {
    try {
      const [quartosPage, clientesPage] = await Promise.all([
        this.api.get<Quarto>('/quartos'),
        this.api.get<Cliente>('/clientes')
      ]);

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

    const reservasFiltradas = this.filtrarReservas(filtros);
    if (!reservasFiltradas.length) {
      this.showChart = false;
      return;
    }

    const filtroCliente = filtros.find((f: any) => f.key === 'cliente')?.value;
    const filtroQuarto = filtros.find((f: any) => f.key === 'quarto')?.value;
    const filtroStatus = filtros.find((f: any) => f.key === 'statusDaReserva')?.value;

    if (filtroCliente) {
      this.gerarGraficoFinanceiro(reservasFiltradas, 'Faturamento do Cliente');
    } else if (filtroQuarto) {
      this.gerarGraficoFinanceiro(reservasFiltradas, 'Faturamento por Quarto');
    } else if (filtroStatus) {
      this.gerarGraficoFinanceiro(reservasFiltradas, `Faturamento ${filtroStatus}`);
    } else {
      this.gerarGraficoFinanceiro(reservasFiltradas, 'Faturamento por Status');
    }
  }

  private filtrarReservas(filtros: any): any[] {
    const filtroPeriodo = filtros.find((f: any) => f.type === 'range' && f.keys?.includes('checkIn'))?.value;
    if (!filtroPeriodo) return [];

    let periodo: { de: string; ate: string };
    try {
      periodo = typeof filtroPeriodo === 'string' ? JSON.parse(filtroPeriodo) : filtroPeriodo;
    } catch {
      return [];
    }

    const dataInicio = new Date(periodo.de);
    const dataFim = new Date(periodo.ate);

    return this.todasReservasOriginais.filter(r => {
      const checkIn = new Date(r.checkIn);
      const checkOut = new Date(r.checkOut);
      if (checkIn > dataFim || checkOut < dataInicio) return false;

      const filtroQuarto = filtros.find((f: any) => f.key === 'quarto')?.value;
      const filtroCliente = filtros.find((f: any) => f.key === 'cliente')?.value;
      const filtroStatus = filtros.find((f: any) => f.key === 'statusDaReserva')?.value;

      if (filtroQuarto && r.quarto?.id !== filtroQuarto) return false;
      if (filtroCliente && r.cliente?.id !== filtroCliente) return false;
      if (filtroStatus && r.statusDaReserva !== filtroStatus) return false;

      return true;
    });
  }

  private gerarGraficoFinanceiro(reservas: any[], titulo: string) {
    if (!reservas || reservas.length === 0) {
      this.showChart = false;
      return;
    }
    const agrupamento: Record<string, number> = {};

    reservas.forEach(r => {
      const chave = r.cliente?.nome || r.quarto?.nome || r.statusDaReserva || 'Sem Info';
      const valorTotal = (r.valorDaReserva || 0) + (r.complementos?.reduce((acc: number, c: any) => acc + c.valor, 0) || 0);
      agrupamento[chave] = (agrupamento[chave] || 0) + valorTotal;
    });

    const nomes = Object.keys(agrupamento);
    const valores = Object.values(agrupamento);

    this.resumoValores = { ...agrupamento };

    this.chartOptions = {
      title: { text: titulo, left: 'center' },
      tooltip: { trigger: 'item', formatter: '{b}: R$ {c}' },
      xAxis: { type: 'category', data: nomes, name: 'Categoria' },
      yAxis: { type: 'value', name: 'Valor (R$)' },
      series: [{
        data: valores,
        type: 'bar',
        color: '#28a745'
      }]
    };

    this.showChart = true;
  }
}
