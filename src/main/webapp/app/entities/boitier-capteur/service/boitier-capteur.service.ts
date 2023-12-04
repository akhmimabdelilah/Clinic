import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBoitierCapteur, getBoitierCapteurIdentifier } from '../boitier-capteur.model';

export type EntityResponseType = HttpResponse<IBoitierCapteur>;
export type EntityArrayResponseType = HttpResponse<IBoitierCapteur[]>;

@Injectable({ providedIn: 'root' })
export class BoitierCapteurService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/boitier-capteurs');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(boitierCapteur: IBoitierCapteur): Observable<EntityResponseType> {
    return this.http.post<IBoitierCapteur>(this.resourceUrl, boitierCapteur, { observe: 'response' });
  }

  update(boitierCapteur: IBoitierCapteur): Observable<EntityResponseType> {
    return this.http.put<IBoitierCapteur>(`${this.resourceUrl}/${getBoitierCapteurIdentifier(boitierCapteur) as number}`, boitierCapteur, {
      observe: 'response',
    });
  }

  partialUpdate(boitierCapteur: IBoitierCapteur): Observable<EntityResponseType> {
    return this.http.patch<IBoitierCapteur>(
      `${this.resourceUrl}/${getBoitierCapteurIdentifier(boitierCapteur) as number}`,
      boitierCapteur,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBoitierCapteur>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBoitierCapteur[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBoitierCapteurToCollectionIfMissing(
    boitierCapteurCollection: IBoitierCapteur[],
    ...boitierCapteursToCheck: (IBoitierCapteur | null | undefined)[]
  ): IBoitierCapteur[] {
    const boitierCapteurs: IBoitierCapteur[] = boitierCapteursToCheck.filter(isPresent);
    if (boitierCapteurs.length > 0) {
      const boitierCapteurCollectionIdentifiers = boitierCapteurCollection.map(
        boitierCapteurItem => getBoitierCapteurIdentifier(boitierCapteurItem)!
      );
      const boitierCapteursToAdd = boitierCapteurs.filter(boitierCapteurItem => {
        const boitierCapteurIdentifier = getBoitierCapteurIdentifier(boitierCapteurItem);
        if (boitierCapteurIdentifier == null || boitierCapteurCollectionIdentifiers.includes(boitierCapteurIdentifier)) {
          return false;
        }
        boitierCapteurCollectionIdentifiers.push(boitierCapteurIdentifier);
        return true;
      });
      return [...boitierCapteursToAdd, ...boitierCapteurCollection];
    }
    return boitierCapteurCollection;
  }
}
