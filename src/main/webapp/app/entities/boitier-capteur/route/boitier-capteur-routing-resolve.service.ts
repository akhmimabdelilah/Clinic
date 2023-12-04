import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBoitierCapteur, BoitierCapteur } from '../boitier-capteur.model';
import { BoitierCapteurService } from '../service/boitier-capteur.service';

@Injectable({ providedIn: 'root' })
export class BoitierCapteurRoutingResolveService implements Resolve<IBoitierCapteur> {
  constructor(protected service: BoitierCapteurService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBoitierCapteur> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((boitierCapteur: HttpResponse<BoitierCapteur>) => {
          if (boitierCapteur.body) {
            return of(boitierCapteur.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new BoitierCapteur());
  }
}
