import { Component, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CertificateApplication } from '../../../certificates/application/certificate-application';
import { CertificateEntity } from '../../../certificates/domain/entities/certificate-entity';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material.module';
import { ExportService } from '../../../../shared/services/export.service';
import { RegisterComponent } from '../../../auth/views/register/register.component';
import { AuthApplication } from '../../../auth/application/auth-application';
import { UtilsService } from '../../../../shared/services/utils.service';

@Component({
  selector: 'app-list-collaborators',
  standalone: true,
  imports: [CommonModule, MaterialModule, RegisterComponent],
  templateUrl: './list-collaborators.component.html',
  styleUrl: './list-collaborators.component.css',
})
export class ListCollaboratorsComponent {
  icon_header = 'badge';
  title_header = 'Certificados';

  filterValue = '';
  totalRecords = 0;
  isAdministrator: boolean = false;

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'user',
    'title',
    'institution',
    'certificationDate',
    'certificateType',
    'professionalCardIssueDate',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly authApplication = inject(AuthApplication);
  private readonly certificateApplication = inject(CertificateApplication);
  public dialog = inject(MatDialog);
  private exportSrv = inject(ExportService);
  private utilSrv = inject(UtilsService);

  ngOnInit(): void {
    this.getAllCollaborators();
  }

  getAllCollaborators() {
    this.certificateApplication.list().subscribe({
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

    // Sort data alphabetically by user name
    data.sort((a, b) => {
      const nameA = a.userId;
      const nameB = b.userId;
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    this.dataSource = new MatTableDataSource<CertificateEntity>(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.totalRecords = data.length;
  }

  openForm(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    row: any = null!
  ) {
    const reference = this.dialog.open(RegisterComponent, {
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
        //this.updateProduct(id, response);
      } else {
        // New entity
        this.addCollaborator(response);
      }
    });
  }

  private addCollaborator(response: any) {
    this.authApplication.register(response).subscribe({
      next: (response) => {
        console.log('response', response);

        this.utilSrv.handleSuccess('Added');
        this.getAllCollaborators();
      },
      error: () => {
        this.utilSrv.handleError('adding');
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filterPredicate = (data: any, filterString: string) => {
      // Verifica si data.title existe y es una cadena, de lo contrario usa una cadena vacía
      const title = typeof data.title === 'string' ? data.title : '';
      const expectedName = data.user ? data.user.name.toLowerCase() : '';

      return (
        title.toLowerCase().includes(filterString) ||
        expectedName.includes(filterString)
      );
    };

    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportToExcel() {
    const dataToExport = this.dataSource.data.map((row) => ({
      Collaborator: `${row.user.name} ${row.user.lastname}`,
      Title: row.title.name,
      Institution: row.institution,
      'Certification Date': this.formatDateString(
        new Date(row.certificationDate)
      ),
      'Certificate Type': row.certificateType,
      'Professional Card Issue Date': this.formatDateString(
        new Date(row.professionalCardIssueDate)
      ),
    }));

    this.exportSrv.exportAsExcelFile(dataToExport, 'exported_data');
  }

  formatDateString(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses son indexados desde 0
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
}
