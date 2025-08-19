import { Component } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-index-report',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterLink
  ],
  templateUrl: './index-report.component.html',
  styleUrl: './index-report.component.scss'
})
export class IndexReportComponent {

}
