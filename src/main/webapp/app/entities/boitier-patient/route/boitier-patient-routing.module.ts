import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BoitierPatientComponent } from '../list/boitier-patient.component';
import { BoitierPatientDetailComponent } from '../detail/boitier-patient-detail.component';
import { BoitierPatientUpdateComponent } from '../update/boitier-patient-update.component';
import { BoitierPatientRoutingResolveService } from './boitier-patient-routing-resolve.service';

const boitierPatientRoute: Routes = [
  {
    path: '',
    component: BoitierPatientComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BoitierPatientDetailComponent,
    resolve: {
      boitierPatient: BoitierPatientRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BoitierPatientUpdateComponent,
    resolve: {
      boitierPatient: BoitierPatientRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BoitierPatientUpdateComponent,
    resolve: {
      boitierPatient: BoitierPatientRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(boitierPatientRoute)],
  exports: [RouterModule],
})
export class BoitierPatientRoutingModule {}
