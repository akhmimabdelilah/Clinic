import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBoitierCapteur, BoitierCapteur } from '../boitier-capteur.model';

import { BoitierCapteurService } from './boitier-capteur.service';

describe('Service Tests', () => {
  describe('BoitierCapteur Service', () => {
    let service: BoitierCapteurService;
    let httpMock: HttpTestingController;
    let elemDefault: IBoitierCapteur;
    let expectedResult: IBoitierCapteur | IBoitierCapteur[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(BoitierCapteurService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        branche: 'AAAAAAA',
        etat: false,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a BoitierCapteur', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new BoitierCapteur()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a BoitierCapteur', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            branche: 'BBBBBB',
            etat: true,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a BoitierCapteur', () => {
        const patchObject = Object.assign(
          {
            branche: 'BBBBBB',
            etat: true,
          },
          new BoitierCapteur()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of BoitierCapteur', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            branche: 'BBBBBB',
            etat: true,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a BoitierCapteur', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addBoitierCapteurToCollectionIfMissing', () => {
        it('should add a BoitierCapteur to an empty array', () => {
          const boitierCapteur: IBoitierCapteur = { id: 123 };
          expectedResult = service.addBoitierCapteurToCollectionIfMissing([], boitierCapteur);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(boitierCapteur);
        });

        it('should not add a BoitierCapteur to an array that contains it', () => {
          const boitierCapteur: IBoitierCapteur = { id: 123 };
          const boitierCapteurCollection: IBoitierCapteur[] = [
            {
              ...boitierCapteur,
            },
            { id: 456 },
          ];
          expectedResult = service.addBoitierCapteurToCollectionIfMissing(boitierCapteurCollection, boitierCapteur);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a BoitierCapteur to an array that doesn't contain it", () => {
          const boitierCapteur: IBoitierCapteur = { id: 123 };
          const boitierCapteurCollection: IBoitierCapteur[] = [{ id: 456 }];
          expectedResult = service.addBoitierCapteurToCollectionIfMissing(boitierCapteurCollection, boitierCapteur);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(boitierCapteur);
        });

        it('should add only unique BoitierCapteur to an array', () => {
          const boitierCapteurArray: IBoitierCapteur[] = [{ id: 123 }, { id: 456 }, { id: 26795 }];
          const boitierCapteurCollection: IBoitierCapteur[] = [{ id: 123 }];
          expectedResult = service.addBoitierCapteurToCollectionIfMissing(boitierCapteurCollection, ...boitierCapteurArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const boitierCapteur: IBoitierCapteur = { id: 123 };
          const boitierCapteur2: IBoitierCapteur = { id: 456 };
          expectedResult = service.addBoitierCapteurToCollectionIfMissing([], boitierCapteur, boitierCapteur2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(boitierCapteur);
          expect(expectedResult).toContain(boitierCapteur2);
        });

        it('should accept null and undefined values', () => {
          const boitierCapteur: IBoitierCapteur = { id: 123 };
          expectedResult = service.addBoitierCapteurToCollectionIfMissing([], null, boitierCapteur, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(boitierCapteur);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
