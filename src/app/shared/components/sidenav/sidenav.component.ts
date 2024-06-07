import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';
import { MaterialModule } from '../../material.module';
import { RouterModule, Router } from '@angular/router';
//import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  private media = inject(MediaMatcher);
  private router = inject(Router);
  //private authSrv = inject(AuthService);

  username = 'Nestor Martínez';
  mobileQuery!: MediaQueryList; // Responsive media query
  menuNav = [
    { name: 'Inicio', route: 'home', icon: 'dashboard' },
    { name: 'Certificados', route: 'certificates', icon: 'folder_special' },
    //{ name: 'Collaborators', route: 'colaborators', icon: 'people' },
  ];

  ngOnInit(): void {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    //this.username = this.keyCloakSrv.getUsername();
  }

  logout(): void {
    //this.authSrv.logout();
  }
}
