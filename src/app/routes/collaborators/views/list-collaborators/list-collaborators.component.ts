import { Component, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CertificateApplication } from '../../../certificates/application/certificate-application';
import { CertificateEntity } from '../../../certificates/domain/entities/certificate-entity';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-list-collaborators',
  standalone: true,
  imports: [CommonModule, MaterialModule],
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
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly certificateApplication = inject(CertificateApplication);
  public dialog = inject(MatDialog);

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

    this.dataSource = new MatTableDataSource<CertificateEntity>(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.totalRecords = data.length;
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
}
