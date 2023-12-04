import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBoitierPatient, BoitierPatient } from '../boitier-patient.model';
import { BoitierPatientService } from '../service/boitier-patient.service';

@Injectable({ providedIn: 'root' })
export class BoitierPatientRoutingResolveService implements Resolve<IBoitierPatient> {
  constructor(protected service: BoitierPatientService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBoitierPatient> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((boitierPatient: HttpResponse<BoitierPatient>) => {
          if (boitierPatient.body) {
            return of(boitierPatient.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new BoitierPatient());
  }
}
