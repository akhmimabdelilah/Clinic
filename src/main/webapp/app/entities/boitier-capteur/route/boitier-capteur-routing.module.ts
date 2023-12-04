import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BoitierCapteurComponent } from '../list/boitier-capteur.component';
import { BoitierCapteurDetailComponent } from '../detail/boitier-capteur-detail.component';
import { BoitierCapteurUpdateComponent } from '../update/boitier-capteur-update.component';
import { BoitierCapteurRoutingResolveService } from './boitier-capteur-routing-resolve.service';

const boitierCapteurRoute: Routes = [
  {
    path: '',
    component: BoitierCapteurComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BoitierCapteurDetailComponent,
    resolve: {
      boitierCapteur: BoitierCapteurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BoitierCapteurUpdateComponent,
    resolve: {
      boitierCapteur: BoitierCapteurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BoitierCapteurUpdateComponent,
    resolve: {
      boitierCapteur: BoitierCapteurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(boitierCapteurRoute)],
  exports: [RouterModule],
})
export class BoitierCapteurRoutingModule {}
