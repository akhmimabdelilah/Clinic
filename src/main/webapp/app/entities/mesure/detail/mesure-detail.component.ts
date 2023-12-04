import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMesure } from '../mesure.model';

@Component({
  selector: 'jhi-mesure-detail',
  templateUrl: './mesure-detail.component.html',
})
export class MesureDetailComponent implements OnInit {
  mesure: IMesure | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mesure }) => {
      this.mesure = mesure;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
