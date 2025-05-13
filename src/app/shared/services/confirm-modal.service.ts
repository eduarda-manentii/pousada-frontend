import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmModalService {

  private confirmationSubject = new Subject<boolean>();
  confirmation$ = this.confirmationSubject.asObservable();

  requestConfirmation(message: string = 'Tem certeza que deseja continuar?') {
    const modal = document.querySelector('app-confirm-modal') as any;
    modal?.open(message);

    return new Promise<boolean>((resolve) => {
      this.confirmation$.subscribe((result) => resolve(result));
    });
  }

  respond(result: boolean) {
    this.confirmationSubject.next(result);
  }

}
