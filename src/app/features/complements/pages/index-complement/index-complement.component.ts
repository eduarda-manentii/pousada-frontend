import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { FilterModalComponent } from '../../../../shared/components/filter-modal/filter-modal.component';
import { FiltroConfig } from '../../../../shared/interfaces/filtro-config';
import { Complement } from '../../interfaces/Complement';
import { useList } from '../../../../shared/composables/use-list';

@Component({
  selector: 'app-index-complement',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterLink,
    CommonModule,
    FilterModalComponent
  ],
  templateUrl: './index-complement.component.html',
  styleUrl: './index-complement.component.scss'
})
export class IndexComplementComponent implements OnInit {
  complementFilter: FiltroConfig[] = [
    {key: 'nome', label: 'Nome', type: 'text'},
  ];

  constructor(
    private api: ApiService,
  ) {}

  private list = useList<any>('/complementos', (a, b) => a.nome.toLowerCase().localeCompare(b.nome.toLowerCase()));

  complementos = this.list.items;
  currentPage = this.list.currentPage;
  totalPages = this.list.totalPages;

  ngOnInit() {
    this.list.loadPage(0);
  }

  applyFilters(filtros: any) {
    this.list.applyFilters(filtros);
  }

  nextPage() {
    this.list.nextPage();
  }

  previousPage() {
    this.list.previousPage();
  }

}
