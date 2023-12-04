import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBoitierCapteur } from '../boitier-capteur.model';

@Component({
  selector: 'jhi-boitier-capteur-detail',
  templateUrl: './boitier-capteur-detail.component.html',
})
export class BoitierCapteurDetailComponent implements OnInit {
  boitierCapteur: IBoitierCapteur | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ boitierCapteur }) => {
      this.boitierCapteur = boitierCapteur;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
