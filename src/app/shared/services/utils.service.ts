import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private toastr = inject(ToastrService);

  handleSuccess(action: string) {
    this.toastr.success(action, 'Ok!');
  }

  handleError(action: string) {
    this.toastr.error(action, 'Opss!');
  }
}
