import { Component } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-index-customer',
  standalone: true,
  imports: [HeaderComponent, RouterLink],
  templateUrl: './index-customer.component.html',
  styleUrl: './index-customer.component.scss'
})
export class IndexCustomerComponent {

}
