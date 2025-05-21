import { Component } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';

@Component({
  selector: 'app-new-amenity',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './new-amenity.component.html',
  styleUrl: './new-amenity.component.scss'
})
export class NewAmenityComponent {

}
