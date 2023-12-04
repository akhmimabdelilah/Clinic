import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { BoitierCapteurComponent } from './list/boitier-capteur.component';
import { BoitierCapteurDetailComponent } from './detail/boitier-capteur-detail.component';
import { BoitierCapteurUpdateComponent } from './update/boitier-capteur-update.component';
import { BoitierCapteurDeleteDialogComponent } from './delete/boitier-capteur-delete-dialog.component';
import { BoitierCapteurRoutingModule } from './route/boitier-capteur-routing.module';

@NgModule({
  imports: [SharedModule, BoitierCapteurRoutingModule],
  declarations: [
    BoitierCapteurComponent,
    BoitierCapteurDetailComponent,
    BoitierCapteurUpdateComponent,
    BoitierCapteurDeleteDialogComponent,
  ],
  entryComponents: [BoitierCapteurDeleteDialogComponent],
})
export class BoitierCapteurModule {}
