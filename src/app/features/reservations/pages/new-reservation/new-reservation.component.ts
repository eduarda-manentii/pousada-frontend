import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { RequiredMarkerDirective } from '../../../../shared/directives/required-marker.directive';

@Component({
  selector: 'app-new-reservation',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    RequiredMarkerDirective,
    ReactiveFormsModule
  ],
  templateUrl: './new-reservation.component.html',
  styleUrl: './new-reservation.component.scss'
})
export class NewReservationComponent implements OnInit {
  reservationForm!: FormGroup;
  quartos: any[] = [];
  clientes: any[] = [];
  complementos: any[] = [];
  statusOptions = ['ABERTA', 'FECHADA', 'CANCELADA', 'CONCLUIDA'];
  valorTotal: number = 0;
  selectedComplementos: any[] = [];
  selectedQuarto: any;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEditing = !!id;

    this.reservationForm = this.fb.group({
      quarto: ['', Validators.required],
      cliente: ['', Validators.required],
      checkIn: ['', Validators.required],
      checkOut: ['', Validators.required],
      statusDaReserva: [{ value: 'ABERTA', disabled: !this.isEditing }, Validators.required],
      observacao: [''],
      complementos: [[]]
    });

    this.api.get('/quartos').then((res: any) => this.quartos = res.content);
    this.api.get('/clientes').then((res: any) => this.clientes = res.content);
    this.api.get('/complementos').then((res: any) => this.complementos = res.content);

    if (this.isEditing) {
      this.api.get(`/reservas/${id}`).then((res: any) => {
        this.reservationForm.patchValue({
          quarto: res.quarto.id,
          cliente: res.cliente.id,
          checkIn: res.checkIn,
          checkOut: res.checkOut,
          statusDaReserva: res.statusDaReserva,
          observacao: res.observacao,
          complementos: res.complementos.map((c: any) => c.id)
        });

        this.selectedComplementos = res.complementos;
        this.selectedQuarto = this.quartos.find(q => q.id === res.quarto.id);
        this.calcularValorTotal();
      });
    }
  }

  onRoomChange() {
    const selectedId = this.reservationForm.value.quarto;
    this.selectedQuarto = this.quartos.find(q => q.id === Number(selectedId));
    this.calcularValorTotal();
  }

  onComplementoChange(event: any, complemento: any) {
    if (event.target.checked) {
      this.selectedComplementos.push(complemento);
    } else {
      this.selectedComplementos = this.selectedComplementos.filter(c => c.id !== complemento.id);
    }

    this.reservationForm.patchValue({ complementos: this.selectedComplementos.map(c => ({ id: c.id })) });
    this.calcularValorTotal();
  }

  calcularValorTotal() {
    const { checkIn, checkOut } = this.reservationForm.value;
    if (checkIn && checkOut && this.selectedQuarto) {
      const entrada = new Date(checkIn);
      const saida = new Date(checkOut);
      const dias = Math.ceil((saida.getTime() - entrada.getTime()) / (1000 * 60 * 60 * 24));
      const diaria = this.selectedQuarto.valorDiaria;
      const valorComplementos = this.selectedComplementos.reduce((soma, c) => soma + c.valor, 0);
      this.valorTotal = dias > 0 ? dias * diaria + valorComplementos : 0;
    }
  }

  async onSubmit() {
    if (this.reservationForm.valid) {
      try {
        const form = this.reservationForm.getRawValue();
        const data = {
          quartoId: Number(form.quarto) ,
          clienteId: Number(form.cliente) ,
          checkIn: new Date(form.checkIn).toISOString(),
          checkOut: new Date(form.checkOut).toISOString(),
          statusDaReserva: form.statusDaReserva,
          observacao: form.observacao,
          complementos: this.selectedComplementos.map(c => ({ id: c.id })),
          valorDaReserva: this.valorTotal
        };
        await this.api.create('/reservas', data);
        this.toast.success('Reserva salva com sucesso!');
        this.router.navigate(['/reservations/index']);
      } catch (err) {
        this.toast.error('Erro ao salvar reserva.');
      }
    } else {
      this.toast.error('Preencha todos os campos obrigatórios.');
    }
  }

  goBack() {
    this.router.navigate(['/reservations/index']);
  }

}
