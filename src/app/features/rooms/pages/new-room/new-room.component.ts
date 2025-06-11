import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { RequiredMarkerDirective } from '../../../../shared/directives/required-marker.directive';
import { ImagemQuarto } from '../../interfaces/ImagemQuarto';

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

  ngOnInit() {
    this.roomId = Number(this.route.snapshot.paramMap.get('id'));
    this.buildForm();

    if (this.roomId) {
      this.api.getById('/quartos/' + this.roomId).then(async (room: any) => {
        this.roomForm.patchValue(room);
        const data = await this.api.getImages<ImagemQuarto>(`/imagens/${room.id}`);
        const existingImages = data;

        const currentFiles = this.roomForm.value.fotos || [];
        this.roomForm.patchValue({ fotos: [...currentFiles, ...existingImages] });
      });
    }

    this.api.get('/amenidades').then((data: any) => {
      this.amenidadesDisponiveis = data.content;
    });
  }

  buildForm() {
    this.roomForm = this.fb.group({
      nome: ['', Validators.required],
      fotos: [undefined],
      qtdCamaCasal: [0, [Validators.required, Validators.min(0)]],
      qtdCamaSolteiro: [0, [Validators.required, Validators.min(0)]],
      capacidade: [1, [Validators.required, Validators.min(1)]],
      observacao: [''],
      valorDiaria: [0, [Validators.required, Validators.min(0)]],
      amenidades: [[]]
    });
  }

  onFileChange(event: any) {
    const files = Array.from(event.target.files) as File[];

    const currentFiles = this.roomForm.value.fotos || [];
    const updatedFiles = [...currentFiles, ...files];

    this.roomForm.patchValue({ fotos: updatedFiles });
  }

  getImagePreview(file: File | ImagemQuarto | string): string {
    if (typeof file === 'string') return file;
    if (file instanceof File) return URL.createObjectURL(file);
    return file.url;
  }

  removeImage(index: number) {
    const currentFiles = [...this.roomForm.value.fotos];
    const fileToRemove = currentFiles[index];

    if (fileToRemove instanceof File || typeof fileToRemove === 'string') {
      currentFiles.splice(index, 1);
      this.roomForm.patchValue({ fotos: currentFiles });
    } else if (fileToRemove?.id && fileToRemove?.fileId && fileToRemove?.url) {
      this.delete(fileToRemove, index);
    }
  }

  async delete(imagem: { id: number; fileId: string; url: string }, index: number) {
    try {
      await this.api.deleteImage('/imagens', {
        id: imagem.id,
        fileId: imagem.fileId,
        url: imagem.url
      });

      const currentFiles = [...this.roomForm.value.fotos];
      currentFiles.splice(index, 1);
      this.roomForm.patchValue({ fotos: currentFiles });

      this.toastService.success('Imagem removida com sucesso!');
    } catch (error) {
      this.toastService.error('Erro ao remover a imagem.');
    }
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
          data.id = this.roomId; 
          await this.api.put('/quartos', data).then(
            response => {
              this.onSaveImage(response.id, data.fotos);
            }
          );
          this.toastService.success('Quarto atualizado com sucesso!');
        } else {
          await this.api.create('/quartos', data).then(
            response => {
              this.onSaveImage(response.id, data.fotos);
            }
          );
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

  async onSaveImage(roomId: number, fotos: any) {
    const files = fotos.filter((f: any) => f instanceof File);

    if (files.length > 0) {
      const formData = new FormData();

      for (const file of files) {
        formData.append('imagens', file);
      }

      formData.append('idQuarto', roomId.toString());

      await this.api.saveImage(`/imagens/room`, formData);
    }
  }

  goBack() {
    this.router.navigate(['/rooms/index']);
  }
  
}
