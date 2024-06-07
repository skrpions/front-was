import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CertificateApplication } from '../../application/certificate-application'; // Adjusted import
import { CertificateEntity } from '../../domain/entities/certificate-entity'; // Adjusted import
import { FormCertificateComponent } from '../form-certificate/form-certificate.component'; // Adjusted import
import { UtilsService } from '../../../../shared/services/utils.service';

@Component({
  selector: 'app-list-certificates', // Adjusted selector
  standalone: true,
  imports: [CommonModule, MaterialModule], // Removed NgOptimizedImage import
  templateUrl: './list-certificates.component.html', // Adjusted template URL
  styleUrl: './list-certificates.component.scss', // Adjusted style URL
})
export class ListCertificatesComponent {
  icon_header = 'badge'; // Adjusted icon
  title_header = 'Certificates'; // Adjusted title
  //messages!: Messages;

  filterValue = '';
  totalRecords = 0;
  isAdministrator: boolean = false;

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'id',
    'title',
    'institution',
    'graduationDate',
    'certificateType',
    'actions',
  ]; // Adjusted displayed columns

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly certificateApplication = inject(CertificateApplication); // Adjusted injection
  public dialog = inject(MatDialog);
  private utilSrv = inject(UtilsService);
  //public toastr = inject(ToastrService);

  ngOnInit(): void {
    this.getAll();
    //this.isAdministrator = this.utilSrv.isAdministrator();
  }

  getAll() {
    this.certificateApplication.list().subscribe({
      // Adjusted method call
      next: (rawData: any) => {
        this.processResponse(rawData);
      },
    });
  }

  processResponse(rawData: any) {
    if (!rawData) return;

    const data: CertificateEntity[] = [];

    console.log('rawData', rawData);

    let listCertificates = rawData;

    listCertificates.forEach((certificate: CertificateEntity) => {
      data.push(certificate);
    });

    this.dataSource = new MatTableDataSource<CertificateEntity>(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.totalRecords = data.length;
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openForm(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    row: any = null!
  ) {
    const reference = this.dialog.open(FormCertificateComponent, {
      // Adjusted component reference
      data: row,
      width: '750px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    reference.afterClosed().subscribe((response) => {
      if (!response) return;

      const id: number = response.id;
      delete response.id;

      if (id) {
        // Update entity
        this.updateCertificate(id, response); // Adjusted method call
      } else {
        // New entity
        this.addCertificate(response); // Adjusted method call
      }
    });
  }

  private updateCertificate(id: any, response: any) {
    this.certificateApplication.update(id, response).subscribe({
      // Adjusted method call
      next: (reponse) => {
        console.log('✅ ', response);
        this.utilSrv.handleSuccess('Updated');
        this.getAll();
      },
      error: () => {
        this.utilSrv.handleError('updating');
      },
    });
  }

  private addCertificate(response: any) {
    this.certificateApplication.add(response).subscribe({
      // Adjusted method call
      next: (response) => {
        this.utilSrv.handleSuccess('Added');
        this.getAll();
      },
      error: () => {
        this.utilSrv.handleError('adding');
      },
    });
  }

  delete(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    row: any = null!
  ) {
    /*  const reference = this.dialog.open(ConfirmComponent, {
      data: row,
      width: '350px',
      enterAnimationDuration,
      exitAnimationDuration
    });

    reference.afterClosed().subscribe(response => {

      if (!response) return;

      this.certificateApplication.delete(row.id).subscribe({ // Adjusted method call
        next: () => {

          this.utilSrv.handleSuccess('Deleted');
          this.getAll();
        },
      });

    }); */
  }
}
