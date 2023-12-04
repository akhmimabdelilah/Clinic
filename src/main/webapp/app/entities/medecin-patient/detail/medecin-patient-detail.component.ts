import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMedecinPatient } from '../medecin-patient.model';

@Component({
  selector: 'jhi-medecin-patient-detail',
  templateUrl: './medecin-patient-detail.component.html',
})
export class MedecinPatientDetailComponent implements OnInit {
  medecinPatient: IMedecinPatient | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ medecinPatient }) => {
      this.medecinPatient = medecinPatient;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
