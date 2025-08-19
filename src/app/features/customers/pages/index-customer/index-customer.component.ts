import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { PhoneFormatPipe } from '../../../../shared/pipes/phone-format.pipe';
import { CapitalizePipe } from '../../../../shared/pipes/capitalize.pipe';
import { FilterModalComponent } from '../../../../shared/components/filter-modal/filter-modal.component';
import { FiltroConfig } from '../../../../shared/interfaces/filtro-config';
import { useList } from '../../../../shared/composables/use-list';

@Component({
  selector: 'app-index-customer',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterLink,
    CommonModule,
    PhoneFormatPipe,
    CapitalizePipe,
    FilterModalComponent
  ],
  templateUrl: './index-customer.component.html',
  styleUrl: './index-customer.component.scss'
})
export class IndexCustomerComponent implements OnInit {
  filtroClientes: FiltroConfig[] = [
    { key: 'nome', label: 'Nome', type: 'text' }
  ];

  private list = useList<any>('/clientes', (a, b) => a.nome.localeCompare(b.nome));

  items = this.list.items;
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

}
