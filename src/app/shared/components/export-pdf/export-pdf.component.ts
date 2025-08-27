import { Component, Input } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-export-pdf',
  standalone: true,
  imports: [],
  templateUrl: './export-pdf.component.html',
  styleUrl: './export-pdf.component.scss'
})
export class ExportPdfComponent {
  @Input() fileName: string = 'export.pdf';
  @Input() headers: string[] = [];
  @Input() data: any[] = [];

  exportarPDF(event: Event) {
    event.preventDefault();
    const doc = new jsPDF();
    doc.text(this.fileName.replace('.pdf', ''), 14, 10);
    autoTable(doc, {
      head: [this.headers],
      body: this.data
    });
    doc.save(this.fileName);
  }

}
