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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    NgOptimizedImage,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  reactiveForm!: FormGroup;
  errorSession: boolean = false;

  fb = inject(FormBuilder);
  router = inject(Router);

  private readonly authApplication = inject(AuthApplication);

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.reactiveForm = this.fb.nonNullable.group({
      username: ['mor_2314', [Validators.required]],
      password: [
        '83r5^_',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(12),
        ],
      ],
    });
  }

  get usernameField() {
    return this.reactiveForm.get('username')!;
  }

  get passwordField() {
    return this.reactiveForm.get('password')!;
  }

  send(): void {
    if (this.reactiveForm.invalid) return this.reactiveForm.markAllAsTouched(); // Activo todos los errores en el formGuest

    const credentials = this.reactiveForm.value;
    console.log('✅ ', credentials);

    this.authApplication.login(credentials);
  }
}
