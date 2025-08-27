import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterModalComponent } from '../../../../shared/components/filter-modal/filter-modal.component';
import { FiltroConfig } from '../../../../shared/interfaces/filtro-config';
import { useList } from '../../../../shared/composables/use-list';
import { ExportCsvComponent } from '../../../../shared/components/export-csv/export-csv.component';
import { ExportPdfComponent } from '../../../../shared/components/export-pdf/export-pdf.component';
import { User } from '../../interfaces/users';

@Component({
  selector: 'app-index-user',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterLink,
    CommonModule,
    FilterModalComponent,
    ExportCsvComponent,
    ExportPdfComponent
  ],
  templateUrl: './index-user.component.html',
  styleUrl: './index-user.component.scss'
})
export class IndexUserComponent implements OnInit{

  userFilter: FiltroConfig[] = [
    {key: 'nome', label: 'Nome', type: 'text'},
    {key: 'email', label: 'Email', type: 'text'},
  ];

  private list = useList<User>('/usuarios', (a, b) => a.nome.toLowerCase().localeCompare(b.nome.toLowerCase()));

  users = this.list.items;
  currentPage = this.list.currentPage;
  totalPages = this.list.totalPages;

  ngOnInit() {
    this.list.loadPage(0);
  }

  applyFilters(filters: any) {
    this.list.applyFilters(filters);
  }

  nextPage() {
    this.list.nextPage();
  }

  previousPage() {
    this.list.previousPage();
  }

  usuariosParaCSV() {
    return this.users().map(u => ({
      nome: u.nome,
      email: u.email
    }));
  }

  usuariosParaPDF() {
    return this.users().map(u => [
      u.id,
      u.nome,
      u.email
    ]);
  }

}
