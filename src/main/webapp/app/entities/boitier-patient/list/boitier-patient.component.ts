import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBoitierPatient } from '../boitier-patient.model';
import { BoitierPatientService } from '../service/boitier-patient.service';
import { BoitierPatientDeleteDialogComponent } from '../delete/boitier-patient-delete-dialog.component';

@Component({
  selector: 'jhi-boitier-patient',
  templateUrl: './boitier-patient.component.html',
})
export class BoitierPatientComponent implements OnInit {
  boitierPatients?: IBoitierPatient[];
  isLoading = false;

  constructor(protected boitierPatientService: BoitierPatientService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.boitierPatientService.query().subscribe(
      (res: HttpResponse<IBoitierPatient[]>) => {
        this.isLoading = false;
        this.boitierPatients = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBoitierPatient): number {
    return item.id!;
  }

  delete(boitierPatient: IBoitierPatient): void {
    const modalRef = this.modalService.open(BoitierPatientDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.boitierPatient = boitierPatient;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
