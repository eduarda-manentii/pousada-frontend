import { Component } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';

@Component({
  selector: 'app-new-voucher',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './new-voucher.component.html',
  styleUrl: './new-voucher.component.scss'
})
export class NewVoucherComponent {

}
