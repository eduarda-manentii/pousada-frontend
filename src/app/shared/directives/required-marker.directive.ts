import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appRequiredMarker]',
  standalone: true
})
export class RequiredMarkerDirective {
  @Input('appRequiredMarker') isRequired: boolean = false;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.isRequired) {
      const span = document.createElement('span');
      span.textContent = ' *';
      span.classList.add('text-danger');
      span.title = 'Item obrigatório';
      this.el.nativeElement.appendChild(span);
    }
  }

}
