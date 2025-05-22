import { Component } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CapitalizePipe } from '../../../../shared/pipes/capitalize.pipe';
import { FilterModalComponent } from '../../../../shared/components/filter-modal/filter-modal.component';
import { FiltroConfig } from '../../../../shared/interfaces/filtro-config';
import { useList } from '../../../../shared/composables/use-list';

@Component({
  selector: 'app-index-amenity',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterLink,
    CommonModule,
    CapitalizePipe,
    FilterModalComponent
  ],
  templateUrl: './index-amenity.component.html',
  styleUrl: './index-amenity.component.scss'
})
export class IndexAmenityComponent {
  filtroAmenidades: FiltroConfig[] = [
      { key: 'nome', label: 'Nome da Amenidade', type: 'text' }
  ];

  private list = useList<any>('/amenidades', (a, b) => a.nome.localeCompare(b.nome));

  amenities = this.list.items;
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
