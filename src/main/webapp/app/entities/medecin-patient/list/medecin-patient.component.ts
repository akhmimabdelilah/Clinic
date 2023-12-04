import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMedecinPatient } from '../medecin-patient.model';
import { MedecinPatientService } from '../service/medecin-patient.service';
import { MedecinPatientDeleteDialogComponent } from '../delete/medecin-patient-delete-dialog.component';

@Component({
  selector: 'jhi-medecin-patient',
  templateUrl: './medecin-patient.component.html',
})
export class MedecinPatientComponent implements OnInit {
  medecinPatients?: IMedecinPatient[];
  isLoading = false;

  constructor(protected medecinPatientService: MedecinPatientService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.medecinPatientService.query().subscribe(
      (res: HttpResponse<IMedecinPatient[]>) => {
        this.isLoading = false;
        this.medecinPatients = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IMedecinPatient): number {
    return item.id!;
  }

  delete(medecinPatient: IMedecinPatient): void {
    const modalRef = this.modalService.open(MedecinPatientDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.medecinPatient = medecinPatient;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
