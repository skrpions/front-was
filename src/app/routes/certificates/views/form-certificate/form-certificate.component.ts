import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CertificateEntity } from '../../domain/entities/certificate-entity';
import { MaterialModule } from '../../../../shared/material.module';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../../../shared/services/utils.service';

@Component({
  selector: 'app-form-certificate',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './form-certificate.component.html',
  styleUrl: './form-certificate.component.css',
})
export class FormCertificateComponent {
  icon_header = '';
  title_header = '';
  reactiveForm!: FormGroup;
  photoToShow = '';
  listCategories: string[] = [
    'Pregrado',
    'Posgrado',
    'Certificación',
    'Maestría',
    'Doctorado',
    'Diplomado',
    'Curso',
  ];

  private fb = inject(FormBuilder);
  private utilSrv = inject(UtilsService);
  private data: CertificateEntity = inject(MAT_DIALOG_DATA);
  private reference = inject(MatDialogRef);

  //private readonly categoryApplication = inject(CategoryApplication);

  ngOnInit(): void {
    this.icon_header = this.data ? 'edit' : 'add';
    this.title_header = this.data ? 'Edit' : 'New';

    this.getAllCategories();
    this.initForm();
  }

  private initForm(): void {
    this.reactiveForm = this.fb.nonNullable.group({
      id: this.data?.id,
      title: [this.data?.title, [Validators.required, Validators.minLength(2)]],
      institution: [
        this.data?.institution,
        [Validators.required, Validators.minLength(0)],
      ],
      certificateType: [this.data?.certificateType, [Validators.required]],
      certificationDate: [this.data?.certificationDate, [Validators.required]],
    });

    this.reactiveForm.valueChanges.subscribe(() => {
      console.log(this.reactiveForm.value);
    });
  }

  get titleField() {
    return this.reactiveForm.get('title');
  }

  get institutionField() {
    return this.reactiveForm.get('institution');
  }

  get certificationDateField() {
    return this.reactiveForm.get('certificationDate');
  }

  get certificateTypeField() {
    return this.reactiveForm.get('certificateType');
  }

  getAllCategories() {
    /* this.categoryApplication.list().subscribe({
      next: (rawData: any) => {
        this.processResponse(rawData);
      },
    }); */
  }

  processResponse(rawData: any) {
    if (rawData.metadata[0].code === '200') {
      this.listCategories = rawData.categoryResponse.category;
    }
  }

  save() {
    if (this.reactiveForm.invalid) return this.reactiveForm.markAllAsTouched(); // Activate all errors

    const record: CertificateEntity = this.reactiveForm.value;
    record.userId = this.utilSrv.getUser().id;
    console.log('Saving certificate: ' + JSON.stringify(record));

    //record.image = 'https://latit.co/wp-content/uploads/2021/05/1050707-1.jpg';

    this.reference.close(record);
  }
}
