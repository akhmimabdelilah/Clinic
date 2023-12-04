import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { BoitierPatientComponent } from './list/boitier-patient.component';
import { BoitierPatientDetailComponent } from './detail/boitier-patient-detail.component';
import { BoitierPatientUpdateComponent } from './update/boitier-patient-update.component';
import { BoitierPatientDeleteDialogComponent } from './delete/boitier-patient-delete-dialog.component';
import { BoitierPatientRoutingModule } from './route/boitier-patient-routing.module';

@NgModule({
  imports: [SharedModule, BoitierPatientRoutingModule],
  declarations: [
    BoitierPatientComponent,
    BoitierPatientDetailComponent,
    BoitierPatientUpdateComponent,
    BoitierPatientDeleteDialogComponent,
  ],
  entryComponents: [BoitierPatientDeleteDialogComponent],
})
export class BoitierPatientModule {}
