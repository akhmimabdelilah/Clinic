import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMedecinPatient } from '../medecin-patient.model';
import { MedecinPatientService } from '../service/medecin-patient.service';

@Component({
  templateUrl: './medecin-patient-delete-dialog.component.html',
})
export class MedecinPatientDeleteDialogComponent {
  medecinPatient?: IMedecinPatient;

  constructor(protected medecinPatientService: MedecinPatientService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.medecinPatientService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
