import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';
import { MaterialModule } from '../../material.module';
import { RouterModule, Router } from '@angular/router';
import { UtilsService } from '../../services/utils.service';
import { Token } from '@angular/compiler';
import { TokenResponse } from '../../../routes/auth/domain/entities/token-entity';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  private media = inject(MediaMatcher);
  private utilSrv = inject(UtilsService);
  private authSrv = inject(AuthService);

  user!: TokenResponse;
  userHasAccess = this.user?.username === '52148809';

  mobileQuery!: MediaQueryList; // Responsive media query
  menuNav = [
    //{ name: 'Home', route: 'home', icon: 'dashboard' },
    { name: 'Certificates', route: 'home', icon: 'badge' },
  ];
  menuNavAdmin = [
    //{ name: 'Home', route: 'home', icon: 'dashboard' },
    { name: 'Certificates', route: 'home', icon: 'badge' },
    { name: 'Collaborators', route: 'collaborators', icon: 'people' },
  ];

  ngOnInit(): void {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this.user = this.utilSrv.getUser();
  }

  logout(): void {
    this.authSrv.logout();
  }
}
