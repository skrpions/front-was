import { Observable } from 'rxjs';
import { AuthEntity } from '../entities/auth-entity';
import { TokenEntity } from '../entities/token-entity';

export interface AuthRepository {
  //register(data: RegisterEntity): Observable<any>;
  login(auth: AuthEntity): Observable<TokenEntity>;
}
