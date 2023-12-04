import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBoitierPatient, getBoitierPatientIdentifier } from '../boitier-patient.model';

export type EntityResponseType = HttpResponse<IBoitierPatient>;
export type EntityArrayResponseType = HttpResponse<IBoitierPatient[]>;

@Injectable({ providedIn: 'root' })
export class BoitierPatientService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/boitier-patients');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(boitierPatient: IBoitierPatient): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(boitierPatient);
    return this.http
      .post<IBoitierPatient>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(boitierPatient: IBoitierPatient): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(boitierPatient);
    return this.http
      .put<IBoitierPatient>(`${this.resourceUrl}/${getBoitierPatientIdentifier(boitierPatient) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(boitierPatient: IBoitierPatient): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(boitierPatient);
    return this.http
      .patch<IBoitierPatient>(`${this.resourceUrl}/${getBoitierPatientIdentifier(boitierPatient) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IBoitierPatient>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBoitierPatient[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBoitierPatientToCollectionIfMissing(
    boitierPatientCollection: IBoitierPatient[],
    ...boitierPatientsToCheck: (IBoitierPatient | null | undefined)[]
  ): IBoitierPatient[] {
    const boitierPatients: IBoitierPatient[] = boitierPatientsToCheck.filter(isPresent);
    if (boitierPatients.length > 0) {
      const boitierPatientCollectionIdentifiers = boitierPatientCollection.map(
        boitierPatientItem => getBoitierPatientIdentifier(boitierPatientItem)!
      );
      const boitierPatientsToAdd = boitierPatients.filter(boitierPatientItem => {
        const boitierPatientIdentifier = getBoitierPatientIdentifier(boitierPatientItem);
        if (boitierPatientIdentifier == null || boitierPatientCollectionIdentifiers.includes(boitierPatientIdentifier)) {
          return false;
        }
        boitierPatientCollectionIdentifiers.push(boitierPatientIdentifier);
        return true;
      });
      return [...boitierPatientsToAdd, ...boitierPatientCollection];
    }
    return boitierPatientCollection;
  }

  protected convertDateFromClient(boitierPatient: IBoitierPatient): IBoitierPatient {
    return Object.assign({}, boitierPatient, {
      dateDebut: boitierPatient.dateDebut?.isValid() ? boitierPatient.dateDebut.format(DATE_FORMAT) : undefined,
      dateFin: boitierPatient.dateFin?.isValid() ? boitierPatient.dateFin.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((boitierPatient: IBoitierPatient) => {
        boitierPatient.dateDebut = boitierPatient.dateDebut ? dayjs(boitierPatient.dateDebut) : undefined;
        boitierPatient.dateFin = boitierPatient.dateFin ? dayjs(boitierPatient.dateFin) : undefined;
      });
    }
    return res;
  }
}
