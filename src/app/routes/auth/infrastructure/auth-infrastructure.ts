import { Observable } from 'rxjs';
import { AuthEntity } from '../domain/entities/auth-entity';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { UserEntity } from '../domain/entities/user-entity';

@Injectable()
export class AuthInfrastructure {
  private http = inject(HttpClient);

  login(auth: AuthEntity): Observable<any> {
    return this.http.post<any>(`${environment.apiPath}users/login`, auth);
  }

  register(collaborator: UserEntity): Observable<any> {
    return this.http.post<any>(`${environment.apiPath}users`, collaborator);
  }
}
