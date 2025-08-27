import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterModalComponent } from '../../../../shared/components/filter-modal/filter-modal.component';
import { FiltroConfig } from '../../../../shared/interfaces/filtro-config';
import { useList } from '../../../../shared/composables/use-list';
import { ExportCsvComponent } from '../../../../shared/components/export-csv/export-csv.component';
import { ExportPdfComponent } from '../../../../shared/components/export-pdf/export-pdf.component';
import { Voucher } from '../../interfaces/voucher';

@Component({
  selector: 'app-index-voucher',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterLink,
    CommonModule,
    FilterModalComponent,
    ExportCsvComponent,
    ExportPdfComponent
  ],
  templateUrl: './index-voucher.component.html',
  styleUrl: './index-voucher.component.scss'
})
export class IndexVoucherComponent implements OnInit {
  voucherFilter: FiltroConfig[] = [
    {key: 'codigo', label: 'Código', type: 'text'},
    {keys: ['dataDeInicio', 'dataDeVencimento'], label: 'Período', type: 'range', subtype: 'date'},
  ];

  private list = useList<Voucher>('/cupons', (a, b) => a.nome.localeCompare(b.nome));

  vouchers = this.list.items;
  currentPage = this.list.currentPage;
  totalPages = this.list.totalPages;

  ngOnInit() {
    this.list.loadPage(0);
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

  cupomParaPDF() {
    return this.vouchers().map(v => [
      v.id,
      v.nome,
      v.dataDeInicio,
      v.dataDeVencimento,
      v.porcentagemDeDesconto,
      v.quantidadeMaximaDeUso
    ]);
  }

}
