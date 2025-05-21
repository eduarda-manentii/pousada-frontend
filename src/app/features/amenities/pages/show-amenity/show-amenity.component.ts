import { Component } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';

@Component({
  selector: 'app-show-amenity',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './show-amenity.component.html',
  styleUrl: './show-amenity.component.scss'
})
export class ShowAmenityComponent {

}
