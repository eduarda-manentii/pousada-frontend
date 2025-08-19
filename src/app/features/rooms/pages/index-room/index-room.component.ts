import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CapitalizePipe } from '../../../../shared/pipes/capitalize.pipe';
import { FilterModalComponent } from '../../../../shared/components/filter-modal/filter-modal.component';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { FiltroConfig } from '../../../../shared/interfaces/filtro-config';
import { useList } from '../../../../shared/composables/use-list';
import { ImagemQuarto } from '../../interfaces/ImagemQuarto';

@Component({
  selector: 'app-index-room',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterLink,
    CommonModule,
    FilterModalComponent,
    CapitalizePipe
  ],
  templateUrl: './index-room.component.html',
  styleUrl: './index-room.component.scss'
})
export class IndexRoomComponent implements OnInit {
  filtroQuartos: FiltroConfig[] = [
    { key: 'nome', label: 'Nome', type: 'text' }
  ];

  constructor(
    private api: ApiService
  ) {}

  private list = useList<any>('/quartos', (a, b) => a.nome.toLowerCase().localeCompare(b.nome.toLowerCase()));

  quartos = this.list.items;
  currentPage = this.list.currentPage;
  totalPages = this.list.totalPages;

  async ngOnInit() {
    await this.list.loadPage(0);

    for (const quarto of this.quartos()) {
      try {
        const data = await this.api.getImages<ImagemQuarto>(`/imagens/${quarto.id}`);
        quarto.urlImagens = data.map(img => ({ url: img.url }));
      } catch (e) {
        console.error(`Erro ao carregar imagens do quarto ${quarto.id}`, e);
        quarto.urlImagens = [];
      }
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
