import { Observable } from 'rxjs';
import { AuthEntity } from '../entities/auth-entity';
import { TokenEntity } from '../entities/token-entity';
import { UserEntity } from '../entities/user-entity';

export interface AuthRepository {
  register(data: UserEntity): Observable<any>;
  login(auth: AuthEntity): Observable<TokenEntity>;
}
