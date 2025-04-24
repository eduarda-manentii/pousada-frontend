import { Component } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';

@Component({
  selector: 'app-show-customer',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './show-customer.component.html',
  styleUrl: './show-customer.component.scss'
})
export class ShowCustomerComponent {

}
