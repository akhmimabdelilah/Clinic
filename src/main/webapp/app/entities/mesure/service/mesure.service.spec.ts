import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IMesure, Mesure } from '../mesure.model';

import { MesureService } from './mesure.service';

describe('Service Tests', () => {
  describe('Mesure Service', () => {
    let service: MesureService;
    let httpMock: HttpTestingController;
    let elemDefault: IMesure;
    let expectedResult: IMesure | IMesure[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(MesureService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        type: 'AAAAAAA',
        valeur: 0,
        date: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            date: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Mesure', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            date: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.create(new Mesure()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Mesure', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            type: 'BBBBBB',
            valeur: 1,
            date: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Mesure', () => {
        const patchObject = Object.assign(
          {
            valeur: 1,
            date: currentDate.format(DATE_FORMAT),
          },
          new Mesure()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Mesure', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            type: 'BBBBBB',
            valeur: 1,
            date: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Mesure', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addMesureToCollectionIfMissing', () => {
        it('should add a Mesure to an empty array', () => {
          const mesure: IMesure = { id: 123 };
          expectedResult = service.addMesureToCollectionIfMissing([], mesure);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(mesure);
        });

        it('should not add a Mesure to an array that contains it', () => {
          const mesure: IMesure = { id: 123 };
          const mesureCollection: IMesure[] = [
            {
              ...mesure,
            },
            { id: 456 },
          ];
          expectedResult = service.addMesureToCollectionIfMissing(mesureCollection, mesure);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Mesure to an array that doesn't contain it", () => {
          const mesure: IMesure = { id: 123 };
          const mesureCollection: IMesure[] = [{ id: 456 }];
          expectedResult = service.addMesureToCollectionIfMissing(mesureCollection, mesure);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(mesure);
        });

        it('should add only unique Mesure to an array', () => {
          const mesureArray: IMesure[] = [{ id: 123 }, { id: 456 }, { id: 45411 }];
          const mesureCollection: IMesure[] = [{ id: 123 }];
          expectedResult = service.addMesureToCollectionIfMissing(mesureCollection, ...mesureArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const mesure: IMesure = { id: 123 };
          const mesure2: IMesure = { id: 456 };
          expectedResult = service.addMesureToCollectionIfMissing([], mesure, mesure2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(mesure);
          expect(expectedResult).toContain(mesure2);
        });

        it('should accept null and undefined values', () => {
          const mesure: IMesure = { id: 123 };
          expectedResult = service.addMesureToCollectionIfMissing([], null, mesure, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(mesure);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
