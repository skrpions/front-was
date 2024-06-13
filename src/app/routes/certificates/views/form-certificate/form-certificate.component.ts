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
import { CERTIFICATE_TYPES } from '../../../../shared/services/constants';

@Component({
  selector: 'app-form-certificate',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, SharedModule],
  templateUrl: './form-certificate.component.html',
  styleUrl: './form-certificate.component.css',
})
export class FormCertificateComponent {
  @ViewChild('inputElement', { read: ElementRef, static: false })
  readonly minDate = new Date(1970, 0, 1); // Fecha mínima: 1 de enero de 1970
  readonly maxDate = new Date(); // Fecha máxima: hoy

  inputElement!: ElementRef;
  icon_header = '';
  title_header = '';
  reactiveForm!: FormGroup;
  photoToShow = '';
  listCategories: string[] = CERTIFICATE_TYPES;
  titles: any[] = [];
  listTitles: string[] = [];

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
  }

  getAllTitles() {
    this.certificateApplication.listTitles().subscribe({
      next: (rawData: TitleEntity[]) => {
        this.titles = rawData; // Store data in TitleEntity array
        this.filteredTitles = of(this.titles); // Initialize filtered Titles

        const selectedTitle = this.reactiveForm.get('titleId')?.value;
        if (selectedTitle) {
          const title = this.titles.find((t) => t.id === selectedTitle);
          if (title) {
            this.reactiveForm.get('titleId')?.setValue(title.name); // Set selected title name
          }
        }
      },
    });
  }

  optionSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedTitle = this.titles.find(
      (title) => title.id === event.option.value
    );
    if (selectedTitle) {
      this.reactiveForm.get('titleId')?.setValue(selectedTitle.name); // Set selected title name
      this.reactiveForm.get('titleId')?.updateValueAndValidity(); // Update value and validity
      this.reactiveForm.controls['titleId'].setErrors(null); // Clear errors

      // Set the title name in the input field
      if (this.inputElement) {
        this.inputElement.nativeElement.value = selectedTitle.name;
      }
    }
  }

  onTitleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const inputValue = input.value.toLowerCase(); // Convert input value to lowercase

    this.showAddOption = !this.titles.some(
      (option) => option.name.toLowerCase() === inputValue
    );

    // Asegura que al menos la primera letra sea mayúscula
    this.newTitle = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);

    // Filtra filteredTitles basado en el valor del input
    this.filteredTitles = of(
      this.titles.filter((option) =>
        option.name.toLowerCase().includes(inputValue)
      )
    );
  }

  processResponse(rawData: TitleEntity[]) {
    rawData.forEach((title) => {
      this.listTitles.push(title.name);
    });
  }

  addTitle(newTitle: string): void {
    const newTitleObject = { id: 0, name: newTitle };
    this.certificateApplication.addTitle(newTitleObject).subscribe({
      next: (response: TitleEntity) => {
        this.utilSrv.handleSuccess('Added');
        this.getAllTitles();
        this.reactiveForm.get('titleId')?.setValue(response.name);
        this.reactiveForm.get('titleId')?.updateValueAndValidity();
      },
      error: () => {
        this.utilSrv.handleError('adding');
      },
    });
    this.showAddOption = false;
  }

  save() {
    if (this.reactiveForm.invalid) return this.reactiveForm.markAllAsTouched(); // Activate all errors

    const record: CertificateEntity = this.reactiveForm.value;

    // Find the selected TitleEntity object based on the selected title name
    const selectedTitle = this.titles.find(
      (title) => title.name === record.titleId
    );
    if (selectedTitle) {
      // Set the titleId to the selected title's ID
      record.titleId = selectedTitle.id;
    }
    record.userId = this.utilSrv.getUser().id;
    console.log('record to send: ' + JSON.stringify(record));
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
