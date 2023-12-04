import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMedecinPatient, MedecinPatient } from '../medecin-patient.model';
import { MedecinPatientService } from '../service/medecin-patient.service';

@Injectable({ providedIn: 'root' })
export class MedecinPatientRoutingResolveService implements Resolve<IMedecinPatient> {
  constructor(protected service: MedecinPatientService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMedecinPatient> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((medecinPatient: HttpResponse<MedecinPatient>) => {
          if (medecinPatient.body) {
            return of(medecinPatient.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new MedecinPatient());
  }
}
