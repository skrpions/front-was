import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SidenavComponent } from '../../shared/components/sidenav/sidenav.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, SidenavComponent, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {}
