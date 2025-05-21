import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { RequiredMarkerDirective } from '../../../../shared/directives/required-marker.directive';

@Component({
  selector: 'app-new-room',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HeaderComponent,
    CommonModule,
    RequiredMarkerDirective
  ],
  templateUrl: './new-room.component.html',
  styleUrl: './new-room.component.scss'
})
export class NewRoomComponent implements OnInit {
  roomForm!: FormGroup;
  roomId?: number;

  amenidadesDisponiveis = [
    'Ar Condicionado',
    'WiFi',
    'TV',
    'Cozinha',
    'Toalhas'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private api: ApiService,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.roomId = Number(this.route.snapshot.paramMap.get('id'));
    this.buildForm();

    if (this.roomId) {
      this.api.getById('/quartos/' + this.roomId).then((room: any) => {
        this.roomForm.patchValue(room);
      });
    }
  }

  buildForm() {
    this.roomForm = this.fb.group({
      nome: ['', Validators.required],
      fotos: [[], Validators.required],
      quantidadeCamasCasal: [0, [Validators.required, Validators.min(0)]],
      quantidadeCamasSolteiro: [0, [Validators.required, Validators.min(0)]],
      capacidadeMaxima: [1, [Validators.required, Validators.min(1)]],
      maisInformacoes: [''],
      valorDiaria: [0, [Validators.required, Validators.min(0)]],
      amenidades: [[]]
    });
  }

  onFileChange(event: any) {
    const files = Array.from(event.target.files);
    this.roomForm.patchValue({ fotos: files });
  }

  toggleAmenidade(amenidade: string) {
    const selecionadas = this.roomForm.value.amenidades || [];
    if (selecionadas.includes(amenidade)) {
      this.roomForm.patchValue({
        amenidades: selecionadas.filter((a: string) => a !== amenidade)
      });
    } else {
      this.roomForm.patchValue({
        amenidades: [...selecionadas, amenidade]
      });
    }
  }

  async onSubmit() {
    if (this.roomForm.valid) {
      try {
        const data = this.roomForm.value;
        if (this.roomId) {
          await this.api.put(`/quartos/${this.roomId}`, data);
          this.toastService.success('Quarto atualizado com sucesso!');
        } else {
          await this.api.create('/quartos', data);
          this.toastService.success('Quarto cadastrado com sucesso!');
        }

        this.router.navigate(['/rooms/index']);
      } catch (error: any) {
        this.toastService.error('Erro ao salvar o quarto.');
      }
    } else {
      this.toastService.error('Preencha todos os campos obrigatórios.');
    }
  }

  goBack() {
    this.router.navigate(['/rooms/index']);
  }
  
}
