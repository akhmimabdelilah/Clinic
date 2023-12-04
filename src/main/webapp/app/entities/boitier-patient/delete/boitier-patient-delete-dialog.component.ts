import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBoitierPatient } from '../boitier-patient.model';
import { BoitierPatientService } from '../service/boitier-patient.service';

@Component({
  templateUrl: './boitier-patient-delete-dialog.component.html',
})
export class BoitierPatientDeleteDialogComponent {
  boitierPatient?: IBoitierPatient;

  constructor(protected boitierPatientService: BoitierPatientService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.boitierPatientService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
