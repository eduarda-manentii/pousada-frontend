import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-export-csv',
  standalone: true,
  imports: [],
  templateUrl: './export-csv.component.html',
  styleUrl: './export-csv.component.scss'
})
export class ExportCsvComponent {
  @Input() data: any[] = [];
  @Input() filename: string = 'export.csv';

  exportarCSV() {
    if (!this.data || this.data.length === 0) {
      console.warn('Nenhum dado para exportar.');
      return;
    }

    const csvHeaders = Object.keys(this.data[0]);
    const csvRows = [
      csvHeaders.join(','),
      ...this.data.map(row =>
        csvHeaders.map(field => {
          const valor = row[field] ?? '';
          return `"${String(valor).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\r\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', this.filename);
    link.click();
    URL.revokeObjectURL(url);
  }

}
