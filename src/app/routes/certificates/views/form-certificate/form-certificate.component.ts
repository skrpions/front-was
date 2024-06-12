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
import { SharedModule } from '../../../../shared/shared.module';
import { Observable, map, of, startWith } from 'rxjs';
import { CertificateApplication } from '../../application/certificate-application';
import { TitleEntity } from '../../domain/entities/title-entity';

@Component({
  selector: 'app-form-certificate',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, SharedModule],
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
  /* titles: string[] = [
    'Ingeniería de Sistemas',
    'Ingeniería Industrial',
    'Scrum Fundamentals',
    'PMP',
    'Gerencia de Proyectos',
  ]; */
  listTitles: TitleEntity[] = [];

  filteredTitles!: Observable<string[]>;
  newTitle!: string;
  showAddOption: boolean = false;

  private fb = inject(FormBuilder);
  private utilSrv = inject(UtilsService);
  private data: CertificateEntity = inject(MAT_DIALOG_DATA);
  private reference = inject(MatDialogRef);

  private readonly certificateApplication = inject(CertificateApplication);

  ngOnInit(): void {
    this.icon_header = this.data ? 'edit' : 'add';
    this.title_header = this.data ? 'Edit' : 'New';

    this.getAllTitles();
    this.initForm();
  }

  private initForm(): void {
    this.reactiveForm = this.fb.nonNullable.group({
      id: this.data?.id,
      titleId: [this.data?.titleId, [Validators.required]],
      institution: [
        this.data?.institution,
        [Validators.required, Validators.minLength(0)],
      ],
      certificateType: [this.data?.certificateType, [Validators.required]],
      certificationDate: [this.data?.certificationDate, [Validators.required]],
    });

    /* this.filteredTitles = this.reactiveForm.get('title')!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    ); */
  }

  getAllTitles() {
    this.certificateApplication.listTitles().subscribe({
      next: (rawData: TitleEntity[]) => {
        this.processResponse(rawData);
      },
    });
  }

  processResponse(rawData: TitleEntity[]) {
    console.log('rawData', rawData);

    this.listTitles = rawData;
    console.log('listTitles', this.listTitles);
  }

  /*   private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    const filtered = this.listTitles.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
    this.showAddOption =
      !this.listTitles.includes(value) && value.trim() !== '';
    this.newTitle = value;
    return filtered;
  }

  addTitle(title: string): void {
    if (title && !this.listTitles.includes(title)) {
      this.listTitles.push(title);
      this.reactiveForm.get('title')?.setValue(title);
    }
  } */

  optionSelected(event: any): void {
    this.showAddOption = false;
  }

  save() {
    if (this.reactiveForm.invalid) return this.reactiveForm.markAllAsTouched(); // Activate all errors

    const record: CertificateEntity = this.reactiveForm.value;

    record.titleId = record.titleId;
    record.userId = this.utilSrv.getUser().id;
    this.reference.close(record);
  }

  get titleIdField() {
    return this.reactiveForm.get('titleId');
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
}
