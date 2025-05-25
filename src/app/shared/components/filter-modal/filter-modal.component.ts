import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FiltroConfig, FiltroConfigValue } from '../../interfaces/filtro-config';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-filter-modal',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule
  ],
  templateUrl: './filter-modal.component.html',
  styleUrl: './filter-modal.component.scss'
})
export class FilterModalComponent {
  @Input() config: FiltroConfig[] = [];
  @Output() filtersApplied = new EventEmitter<any>();

  filters: { [key: string]: any } = {};

  applyFilters() {

    const filtroArray: FiltroConfigValue[] = [];

    for (const campo of this.config) {
      if (campo.type === 'range' && campo.keys?.length === 2) {
        const [keyInicio, keyFim] = campo.keys;
        const valorInicio = this.filters[keyInicio];
        const valorFim = this.filters[keyFim];

        if (valorInicio !== undefined || valorFim !== undefined) {
          filtroArray.push({
            type: campo.type,
            keys: campo.keys,
            value: JSON.stringify({ de: valorInicio, ate: valorFim })
          });
        } 
      } else if (campo.key) {
        const valor = this.filters[campo.key];
        if (valor !== undefined && valor !== null && valor !== '') {
          filtroArray.push({
            type: campo.type,
            key: campo.key,
            value: valor
          });
        }
      }
    }

    this.filtersApplied.emit(filtroArray);

    const modalEl = document.getElementById('filterModal');
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal?.hide();
    }
  }

  validateDatePickerFilter(index: number, campo: any): number {
    const keys = campo.keys;

    if (!Array.isArray(keys) || keys.length !== 2) {
      console.error(`Campo range '${campo.label}' deve ter exatamente dois keys.`);
      throw new Error(`Campo range '${campo.label}' inválido.`);
    }

    if (!campo.subtype) {
      throw new Error(`Campo range '${campo.label}' deve ter um 'subtype' definido (ex: 'date', 'number').`);
    }

    return campo.keys[index];
  }
  
}
