import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMesure } from '../mesure.model';
import { MesureService } from '../service/mesure.service';

@Component({
  templateUrl: './mesure-delete-dialog.component.html',
})
export class MesureDeleteDialogComponent {
  mesure?: IMesure;

  constructor(protected mesureService: MesureService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.mesureService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
