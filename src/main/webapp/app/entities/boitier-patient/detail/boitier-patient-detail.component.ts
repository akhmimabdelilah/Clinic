import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBoitierPatient } from '../boitier-patient.model';

@Component({
  selector: 'jhi-boitier-patient-detail',
  templateUrl: './boitier-patient-detail.component.html',
})
export class BoitierPatientDetailComponent implements OnInit {
  boitierPatient: IBoitierPatient | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ boitierPatient }) => {
      this.boitierPatient = boitierPatient;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
