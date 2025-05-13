import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent {

  message = 'Tem certeza que deseja continuar?';
  @Output() confirmed = new EventEmitter<boolean>();

  open(message: string = this.message) {
    this.message = message;
    const modalElement = document.getElementById('confirmModal');
    if (modalElement) new bootstrap.Modal(modalElement).show();
  }

  confirm(result: boolean) {
    this.confirmed.emit(result);
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmModal')!);
    modal?.hide();
  }

}


