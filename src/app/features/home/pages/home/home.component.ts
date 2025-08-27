import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { useList } from '../../../../shared/composables/use-list';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { Cliente } from '../../../customers/interfaces/cliente';
import { Quarto } from '../../../rooms/interfaces/quarto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, HeaderComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  locacoesDoDia: any[] = [];
  private list = useList<any>('/reservas', (a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.list.loadPage(0).then(() => {
      this.filtrarLocacoesDoDia();
    });
  }

  private filtrarLocacoesDoDia() {
    const hoje = new Date();
    hoje.setHours(0,0,0,0);

    this.locacoesDoDia = this.list.items().filter(reserva => {
      const checkIn = new Date(reserva.checkIn);
      checkIn.setHours(0,0,0,0);
      return checkIn.getTime() === hoje.getTime();
    });
  }

}
