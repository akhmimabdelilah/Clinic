import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMedecinPatient, getMedecinPatientIdentifier } from '../medecin-patient.model';

export type EntityResponseType = HttpResponse<IMedecinPatient>;
export type EntityArrayResponseType = HttpResponse<IMedecinPatient[]>;

@Injectable({ providedIn: 'root' })
export class MedecinPatientService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/medecin-patients');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(medecinPatient: IMedecinPatient): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(medecinPatient);
    return this.http
      .post<IMedecinPatient>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(medecinPatient: IMedecinPatient): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(medecinPatient);
    return this.http
      .put<IMedecinPatient>(`${this.resourceUrl}/${getMedecinPatientIdentifier(medecinPatient) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(medecinPatient: IMedecinPatient): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(medecinPatient);
    return this.http
      .patch<IMedecinPatient>(`${this.resourceUrl}/${getMedecinPatientIdentifier(medecinPatient) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IMedecinPatient>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IMedecinPatient[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMedecinPatientToCollectionIfMissing(
    medecinPatientCollection: IMedecinPatient[],
    ...medecinPatientsToCheck: (IMedecinPatient | null | undefined)[]
  ): IMedecinPatient[] {
    const medecinPatients: IMedecinPatient[] = medecinPatientsToCheck.filter(isPresent);
    if (medecinPatients.length > 0) {
      const medecinPatientCollectionIdentifiers = medecinPatientCollection.map(
        medecinPatientItem => getMedecinPatientIdentifier(medecinPatientItem)!
      );
      const medecinPatientsToAdd = medecinPatients.filter(medecinPatientItem => {
        const medecinPatientIdentifier = getMedecinPatientIdentifier(medecinPatientItem);
        if (medecinPatientIdentifier == null || medecinPatientCollectionIdentifiers.includes(medecinPatientIdentifier)) {
          return false;
        }
        medecinPatientCollectionIdentifiers.push(medecinPatientIdentifier);
        return true;
      });
      return [...medecinPatientsToAdd, ...medecinPatientCollection];
    }
    return medecinPatientCollection;
  }

  protected convertDateFromClient(medecinPatient: IMedecinPatient): IMedecinPatient {
    return Object.assign({}, medecinPatient, {
      dateDebut: medecinPatient.dateDebut?.isValid() ? medecinPatient.dateDebut.format(DATE_FORMAT) : undefined,
      dateFin: medecinPatient.dateFin?.isValid() ? medecinPatient.dateFin.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateDebut = res.body.dateDebut ? dayjs(res.body.dateDebut) : undefined;
      res.body.dateFin = res.body.dateFin ? dayjs(res.body.dateFin) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((medecinPatient: IMedecinPatient) => {
        medecinPatient.dateDebut = medecinPatient.dateDebut ? dayjs(medecinPatient.dateDebut) : undefined;
        medecinPatient.dateFin = medecinPatient.dateFin ? dayjs(medecinPatient.dateFin) : undefined;
      });
    }
    return res;
  }
}
