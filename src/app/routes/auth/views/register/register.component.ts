import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../../../shared/material.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserEntity } from '../../domain/entities/user-entity';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, FormsModule, SharedModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  icon_header = '';
  title_header = '';
  reactiveForm!: FormGroup;
  photoToShow = '';
  listCategories: string[] = [
  "electronics",
  "jewelery",
  "men's clothing",
  "women's clothing"];

  private fb = inject(FormBuilder);
  private data: UserEntity = inject(MAT_DIALOG_DATA);
  private reference = inject(MatDialogRef);

  //private readonly categoryApplication = inject(CategoryApplication);

  ngOnInit(): void {

    this.icon_header = this.data ? 'edit' : 'add';
    this.title_header = this.data ? 'Edit' : 'New';

    this.initForm();
  }

  private initForm(): void {
    this.reactiveForm = this.fb.nonNullable.group({
      id: this.data?.id,
      username: [this.data?.username, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      name: [this.data?.name, [Validators.required, Validators.minLength(0), Validators.maxLength(20)]],
      lastname: [this.data?.lastname, [Validators.required, Validators.minLength(0), Validators.maxLength(20)]],
      boss: [this.data?.boss, [Validators.required, Validators.minLength(0), Validators.maxLength(120)]],
    });
  }

  save() {
    if (this.reactiveForm.invalid) return this.reactiveForm.markAllAsTouched(); // Activate all errors

    const record: UserEntity = this.reactiveForm.value;

    // Convertir name y lastname a camelCase
    record.name = this.toProperCase(record.name);
    record.lastname = this.toProperCase(record.lastname);
    record.boss = this.toProperCase(record.boss);

    record.password = this.reactiveForm.get('username')?.value;
    this.reference.close(record);
  }

  // Método auxiliar para convertir a camelCase
  private toProperCase(str: string): string {
    return str.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  get usernameField() {
    return this.reactiveForm.get('username');
  }

  get nameField() {
    return this.reactiveForm.get('name');
  }

  get lastnameField() {
    return this.reactiveForm.get('lastname');
  }

  get bossField() {
    return this.reactiveForm.get('boss');
  }
}
