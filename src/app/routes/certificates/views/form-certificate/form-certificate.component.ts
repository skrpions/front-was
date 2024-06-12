import { Component, ElementRef, ViewChild, inject } from '@angular/core';
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
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-form-certificate',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, SharedModule],
  templateUrl: './form-certificate.component.html',
  styleUrl: './form-certificate.component.css',
})
export class FormCertificateComponent {
  @ViewChild('inputElement', { read: ElementRef, static: false })
  inputElement!: ElementRef;
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

  filteredTitles!: Observable<TitleEntity[]>;
  newTitle: string = '';
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

    this.filteredTitles = this.reactiveForm.controls[
      'titleId'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  getAllTitles() {
    this.certificateApplication.listTitles().subscribe({
      next: (rawData: TitleEntity[]) => {
        this.processResponse(rawData);
        const selectedTitle = this.reactiveForm.get('titleId')?.value;
        if (selectedTitle) {
          const title = this.listTitles.find((t) => t.id === selectedTitle);
          if (title) {
            this.reactiveForm.get('titleId')?.setValue(title.id);
          }
        }
      },
    });
  }

  processResponse(rawData: TitleEntity[]) {
    console.log('rawData', rawData);

    this.listTitles = rawData.sort((a, b) => {
      const aId = a?.id || 0; // Asignar 0 si a.id es nulo o undefined
      const bId = b?.id || 0; // Asignar 0 si b.id es nulo o undefined
      return aId - bId;
    });

    console.log('listTitles', this.listTitles);
  }

  private _filter(value: string): TitleEntity[] {
    const filterValue = parseInt(value, 10); // Convierte a número

    this.showAddOption = !this.listTitles.some(
      (option) => option.id === filterValue
    );

    this.newTitle =
      this.listTitles.find((option) => option.id === filterValue)?.name || '';
    return this.listTitles.filter((option) => option.id !== filterValue);
  }

  optionSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedTitle = this.listTitles.find(
      (title) => title.id === event.option.value
    );
    if (selectedTitle) {
      this.reactiveForm.get('titleId')?.setValue(selectedTitle.name);
      this.reactiveForm.get('titleId')?.updateValueAndValidity();
      this.reactiveForm.controls['titleId'].setErrors(null);

      // Establecer el nombre del título en el campo de entrada
      if (this.inputElement) {
        this.inputElement.nativeElement.value = selectedTitle.name;
      }
    }
  }

  addTitle(newTitle: string): void {
    const newTitleObject = { id: 0, name: newTitle };
    this.certificateApplication.addTitle(newTitleObject).subscribe({
      next: (response: TitleEntity) => {
        this.utilSrv.handleSuccess('Added');
        this.getAllTitles(); // Actualizar la lista de títulos
        this.reactiveForm.get('titleId')?.setValue(response.name); // Setear el id del nuevo título
        this.reactiveForm.get('titleId')?.updateValueAndValidity(); // Actualizar el valor y la validez
      },
      error: () => {
        this.utilSrv.handleError('adding');
      },
    });
    this.showAddOption = false;
  }

  onTitleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.newTitle = input.value;
  }

  save() {
    if (this.reactiveForm.invalid) return this.reactiveForm.markAllAsTouched(); // Activate all errors

    const record: CertificateEntity = this.reactiveForm.value;
    console.log('record: ' + JSON.stringify(record));

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
