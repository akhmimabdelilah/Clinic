import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { MedecinPatientComponent } from './list/medecin-patient.component';
import { MedecinPatientDetailComponent } from './detail/medecin-patient-detail.component';
import { MedecinPatientUpdateComponent } from './update/medecin-patient-update.component';
import { MedecinPatientDeleteDialogComponent } from './delete/medecin-patient-delete-dialog.component';
import { MedecinPatientRoutingModule } from './route/medecin-patient-routing.module';

@NgModule({
  imports: [SharedModule, MedecinPatientRoutingModule],
  declarations: [
    MedecinPatientComponent,
    MedecinPatientDetailComponent,
    MedecinPatientUpdateComponent,
    MedecinPatientDeleteDialogComponent,
  ],
  entryComponents: [MedecinPatientDeleteDialogComponent],
})
export class MedecinPatientModule {}
