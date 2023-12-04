import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'medecin',
        data: { pageTitle: 'cliniqueApp.medecin.home.title' },
        loadChildren: () => import('./medecin/medecin.module').then(m => m.MedecinModule),
      },
      {
        path: 'patient',
        data: { pageTitle: 'cliniqueApp.patient.home.title' },
        loadChildren: () => import('./patient/patient.module').then(m => m.PatientModule),
      },
      {
        path: 'boitier',
        data: { pageTitle: 'cliniqueApp.boitier.home.title' },
        loadChildren: () => import('./boitier/boitier.module').then(m => m.BoitierModule),
      },
      {
        path: 'capteur',
        data: { pageTitle: 'cliniqueApp.capteur.home.title' },
        loadChildren: () => import('./capteur/capteur.module').then(m => m.CapteurModule),
      },
      {
        path: 'mesure',
        data: { pageTitle: 'cliniqueApp.mesure.home.title' },
        loadChildren: () => import('./mesure/mesure.module').then(m => m.MesureModule),
      },
      {
        path: 'video',
        data: { pageTitle: 'cliniqueApp.video.home.title' },
        loadChildren: () => import('./video/video.module').then(m => m.VideoModule),
      },
      {
        path: 'extra-user',
        data: { pageTitle: 'cliniqueApp.extraUser.home.title' },
        loadChildren: () => import('./extra-user/extra-user.module').then(m => m.ExtraUserModule),
      },
      {
        path: 'medecin-patient',
        data: { pageTitle: 'cliniqueApp.medecinPatient.home.title' },
        loadChildren: () => import('./medecin-patient/medecin-patient.module').then(m => m.MedecinPatientModule),
      },
      {
        path: 'boitier-patient',
        data: { pageTitle: 'cliniqueApp.boitierPatient.home.title' },
        loadChildren: () => import('./boitier-patient/boitier-patient.module').then(m => m.BoitierPatientModule),
      },
      {
        path: 'boitier-capteur',
        data: { pageTitle: 'cliniqueApp.boitierCapteur.home.title' },
        loadChildren: () => import('./boitier-capteur/boitier-capteur.module').then(m => m.BoitierCapteurModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
