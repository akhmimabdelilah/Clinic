import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMesure, getMesureIdentifier } from '../mesure.model';

export type EntityResponseType = HttpResponse<IMesure>;
export type EntityArrayResponseType = HttpResponse<IMesure[]>;

@Injectable({ providedIn: 'root' })
export class MesureService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/mesures');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(mesure: IMesure): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mesure);
    return this.http
      .post<IMesure>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(mesure: IMesure): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mesure);
    return this.http
      .put<IMesure>(`${this.resourceUrl}/${getMesureIdentifier(mesure) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(mesure: IMesure): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mesure);
    return this.http
      .patch<IMesure>(`${this.resourceUrl}/${getMesureIdentifier(mesure) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IMesure>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IMesure[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMesureToCollectionIfMissing(mesureCollection: IMesure[], ...mesuresToCheck: (IMesure | null | undefined)[]): IMesure[] {
    const mesures: IMesure[] = mesuresToCheck.filter(isPresent);
    if (mesures.length > 0) {
      const mesureCollectionIdentifiers = mesureCollection.map(mesureItem => getMesureIdentifier(mesureItem)!);
      const mesuresToAdd = mesures.filter(mesureItem => {
        const mesureIdentifier = getMesureIdentifier(mesureItem);
        if (mesureIdentifier == null || mesureCollectionIdentifiers.includes(mesureIdentifier)) {
          return false;
        }
        mesureCollectionIdentifiers.push(mesureIdentifier);
        return true;
      });
      return [...mesuresToAdd, ...mesureCollection];
    }
    return mesureCollection;
  }

  protected convertDateFromClient(mesure: IMesure): IMesure {
    return Object.assign({}, mesure, {
      date: mesure.date?.isValid() ? mesure.date.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((mesure: IMesure) => {
        mesure.date = mesure.date ? dayjs(mesure.date) : undefined;
      });
    }
    return res;
  }
}
