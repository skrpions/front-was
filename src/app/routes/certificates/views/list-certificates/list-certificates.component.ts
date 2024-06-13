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
import { ConfirmComponent } from '../../../../shared/components/confirm/confirm.component';

@Component({
  selector: 'app-list-certificates',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './list-certificates.component.html',
  styleUrl: './list-certificates.component.scss',
})
export class ListCertificatesComponent {
  icon_header = 'badge';
  title_header = 'Certificados';

  filterValue = '';
  totalRecords = 0;
  isAdministrator: boolean = false;

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'title',
    'institution',
    'certificationDate',
    'certificateType',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly certificateApplication = inject(CertificateApplication);
  public dialog = inject(MatDialog);
  private utilSrv = inject(UtilsService);

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    const userId = this.utilSrv.getUser().id;
    this.certificateApplication.listCertificatesById(userId).subscribe({
      next: (rawData: any) => {
        this.processResponse(rawData);
      },
    });
  }

  processResponse(rawData: any) {
    if (!rawData) return;

    const data: CertificateEntity[] = [];
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
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filterPredicate = (data: any, filterString: string) => {
      const lowerCaseFilterString = filterString.trim().toLowerCase();
      const titleName = data.title ? data.title.name.toLowerCase() : '';
      return titleName.includes(lowerCaseFilterString);
    };

    this.dataSource.filter = filterValue;

    // Reinicia la paginación si está presente
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
        this.updateCertificate(id, response);
      } else {
        // New entity
        this.addCertificate(response);
      }
    });
  }

  private updateCertificate(id: any, response: any) {
    this.certificateApplication.update(id, response).subscribe({
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
    console.log('response', response);

    this.certificateApplication.add(response).subscribe({
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
    const reference = this.dialog.open(ConfirmComponent, {
      data: row,
      width: '350px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    reference.afterClosed().subscribe((response) => {
      if (!response) return;

      this.certificateApplication.delete(row.id).subscribe({
        next: () => {
          this.utilSrv.handleSuccess('Deleted');
          this.getAll();
        },
      });
    });
  }
}
