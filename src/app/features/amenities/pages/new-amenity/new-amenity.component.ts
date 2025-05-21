import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../../shared/services/backend-api.service';
import { RequiredMarkerDirective } from '../../../../shared/directives/required-marker.directive';
import { iconOptions } from '../../interfaces/icon-options';

@Component({
  selector: 'app-new-amenity',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HeaderComponent,
    CommonModule,
    RequiredMarkerDirective
  ],
  templateUrl: './new-amenity.component.html',
  styleUrl: './new-amenity.component.scss'
})
export class NewAmenityComponent implements OnInit {
  amenityForm!: FormGroup;
  amenityId?: number;
  iconOptions = iconOptions;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private api: ApiService,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.amenityId = Number(this.route.snapshot.paramMap.get('id'));
    this.buildForm();

    if (this.amenityId) {
      this.api.getById('/amenities/' + this.amenityId).then((amenity: any) => {
        this.amenityForm.patchValue(amenity);
      });
    }
  }

  buildForm() {
    this.amenityForm = this.fb.group({
      nome: ['', Validators.required],
      icon: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.amenityForm.valid) {
      try {
        const data = this.amenityForm.value;

        if (this.amenityId) {
          await this.api.put(`/amenities/${this.amenityId}`, data);
          this.toastService.success('Amenidade atualizada com sucesso!');
        } else {
          await this.api.create('/amenities', data);
          this.toastService.success('Amenidade criada com sucesso!');
        }

        this.router.navigate(['/amenities/index']);
      } catch (err: any) {
        this.toastService.error('Erro ao salvar a amenidade.');
      }
    } else {
      this.toastService.error('Preencha todos os campos obrigatórios.');
    }
  }

  goBack() {
    this.router.navigate(['/amenities/index']);
  }

}
