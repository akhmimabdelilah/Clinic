import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBoitierCapteur } from '../boitier-capteur.model';
import { BoitierCapteurService } from '../service/boitier-capteur.service';

@Component({
  templateUrl: './boitier-capteur-delete-dialog.component.html',
})
export class BoitierCapteurDeleteDialogComponent {
  boitierCapteur?: IBoitierCapteur;

  constructor(protected boitierCapteurService: BoitierCapteurService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.boitierCapteurService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
