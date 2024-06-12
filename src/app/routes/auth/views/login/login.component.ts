import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../../../shared/material.module';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApplication } from '../../application/auth-application';
import { SharedModule } from '../../../../shared/shared.module';
import { INPUT_VALIDATORS } from '../../../../shared/services/constants';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    SharedModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  reactiveForm!: FormGroup;
  errorSession: boolean = false;
  custom_validators = INPUT_VALIDATORS;

  fb = inject(FormBuilder);
  router = inject(Router);

  private readonly authApplication = inject(AuthApplication);

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.reactiveForm = this.fb.nonNullable.group({
      username: [
        '52148809',
        [
          Validators.required,
          Validators.maxLength(this.custom_validators.maxLength.username),
        ],
      ],
      password: [''],
    });
  }

  get usernameField() {
    return this.reactiveForm.get('username')!;
  }

  /* get passwordField() {
    return this.reactiveForm.get('password')!;
  } */

  send(): void {
    //this.isLoading = true;
    if (this.reactiveForm.invalid) return this.reactiveForm.markAllAsTouched(); // Activo todos los errores en el formGuest

    const credentials = this.reactiveForm.value;
    credentials.password = this.usernameField.value; // Por ahora la contraseña será el mismo username

    this.authApplication.login(credentials);

    /* if (this.authApplication.isUserLogged) {
      this.isLoading = false;
    } */
  }
}
