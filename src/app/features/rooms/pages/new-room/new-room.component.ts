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
  amenidadesDisponiveis: any[] = [];

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

    this.api.get('/amenidades').then((data: any) => {
      this.amenidadesDisponiveis = data.content;
    });
  }

  buildForm() {
    this.roomForm = this.fb.group({
      nome: ['', Validators.required],
      fotos: [[], Validators.required],
      qtdCamaCasal: [0, [Validators.required, Validators.min(0)]],
      qtdCamaSolteiro: [0, [Validators.required, Validators.min(0)]],
      capacidade: [1, [Validators.required, Validators.min(1)]],
      observacao: [''],
      valorDiaria: [0, [Validators.required, Validators.min(0)]],
      amenidades: [[]]
    });
  }

  onFileChange(event: any) {
    const files = Array.from(event.target.files);
    this.roomForm.patchValue({ fotos: files });
  }

  isAmenidadeSelecionada(amenidade: any): boolean {
    return this.roomForm.value.amenidades?.some((a: any) => a.id === amenidade.id);
  }

  toggleAmenidade(amenidade: any) {
    const selecionadas: any[] = this.roomForm.value.amenidades || [];

    const index = selecionadas.findIndex((a) => a.id === amenidade.id);
    if (index >= 0) {
      selecionadas.splice(index, 1);
    } else {
      selecionadas.push({ id: amenidade.id });
    }
    this.roomForm.patchValue({ amenidades: selecionadas });
  }

  async onSubmit() {
    if (this.roomForm.valid) {
      try {
        const data = this.roomForm.value;
        if (this.roomId) {
          await this.api.put('/quartos', data);
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
