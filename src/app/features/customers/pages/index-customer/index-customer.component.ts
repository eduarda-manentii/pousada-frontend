import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PhoneFormatPipe } from '../../../../shared/pipes/phone-format.pipe';
import { CapitalizePipe } from '../../../../shared/pipes/capitalize.pipe';
import { FilterModalComponent } from '../../../../shared/components/filter-modal/filter-modal.component';
import { FiltroConfig } from '../../../../shared/interfaces/filtro-config';
import { useList } from '../../../../shared/composables/use-list';
import { ExportCsvComponent } from '../../../../shared/components/export-csv/export-csv.component';

@Component({
  selector: 'app-index-customer',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterLink,
    CommonModule,
    PhoneFormatPipe,
    CapitalizePipe,
    FilterModalComponent,
    ExportCsvComponent
  ],
  templateUrl: './index-customer.component.html',
  styleUrl: './index-customer.component.scss'
})
export class IndexCustomerComponent implements OnInit {
  filtroClientes: FiltroConfig[] = [
    { key: 'nome', label: 'Nome', type: 'text' }
  ];

  private list = useList<any>('/clientes', (a, b) => a.nome.localeCompare(b.nome));

  customers = this.list.items;
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

  customerParaCSV() {
    return this.customers().map(c => ({
      id: c.id,
      nome: c.nome,
      cpf: c.cpf,
      email: c.email,
      celular: c.celular,
      sexo: c.sexo,
      dataDeNascimento: c.dataDeNascimento,
      endereco: c.endereco
        ? `${c.endereco.rua}, ${c.endereco.numero} - ${c.endereco.cidade}/${c.endereco.estado}`
        : ''
    }));
  }

}
