import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MedecinPatientComponent } from '../list/medecin-patient.component';
import { MedecinPatientDetailComponent } from '../detail/medecin-patient-detail.component';
import { MedecinPatientUpdateComponent } from '../update/medecin-patient-update.component';
import { MedecinPatientRoutingResolveService } from './medecin-patient-routing-resolve.service';

const medecinPatientRoute: Routes = [
  {
    path: '',
    component: MedecinPatientComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MedecinPatientDetailComponent,
    resolve: {
      medecinPatient: MedecinPatientRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MedecinPatientUpdateComponent,
    resolve: {
      medecinPatient: MedecinPatientRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MedecinPatientUpdateComponent,
    resolve: {
      medecinPatient: MedecinPatientRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(medecinPatientRoute)],
  exports: [RouterModule],
})
export class MedecinPatientRoutingModule {}
