import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { MesureComponent } from './list/mesure.component';
import { MesureDetailComponent } from './detail/mesure-detail.component';
import { MesureUpdateComponent } from './update/mesure-update.component';
import { MesureDeleteDialogComponent } from './delete/mesure-delete-dialog.component';
import { MesureRoutingModule } from './route/mesure-routing.module';

@NgModule({
  imports: [SharedModule, MesureRoutingModule],
  declarations: [MesureComponent, MesureDetailComponent, MesureUpdateComponent, MesureDeleteDialogComponent],
  entryComponents: [MesureDeleteDialogComponent],
})
export class MesureModule {}
