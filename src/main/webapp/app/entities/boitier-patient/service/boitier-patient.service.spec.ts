import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IBoitierPatient, BoitierPatient } from '../boitier-patient.model';

import { BoitierPatientService } from './boitier-patient.service';

describe('Service Tests', () => {
  describe('BoitierPatient Service', () => {
    let service: BoitierPatientService;
    let httpMock: HttpTestingController;
    let elemDefault: IBoitierPatient;
    let expectedResult: IBoitierPatient | IBoitierPatient[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(BoitierPatientService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        dateDebut: currentDate,
        dateFin: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dateDebut: currentDate.format(DATE_FORMAT),
            dateFin: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a BoitierPatient', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dateDebut: currentDate.format(DATE_FORMAT),
            dateFin: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateDebut: currentDate,
            dateFin: currentDate,
          },
          returnedFromService
        );

        service.create(new BoitierPatient()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a BoitierPatient', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            dateDebut: currentDate.format(DATE_FORMAT),
            dateFin: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateDebut: currentDate,
            dateFin: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a BoitierPatient', () => {
        const patchObject = Object.assign(
          {
            dateDebut: currentDate.format(DATE_FORMAT),
          },
          new BoitierPatient()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            dateDebut: currentDate,
            dateFin: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of BoitierPatient', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            dateDebut: currentDate.format(DATE_FORMAT),
            dateFin: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateDebut: currentDate,
            dateFin: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a BoitierPatient', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addBoitierPatientToCollectionIfMissing', () => {
        it('should add a BoitierPatient to an empty array', () => {
          const boitierPatient: IBoitierPatient = { id: 123 };
          expectedResult = service.addBoitierPatientToCollectionIfMissing([], boitierPatient);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(boitierPatient);
        });

        it('should not add a BoitierPatient to an array that contains it', () => {
          const boitierPatient: IBoitierPatient = { id: 123 };
          const boitierPatientCollection: IBoitierPatient[] = [
            {
              ...boitierPatient,
            },
            { id: 456 },
          ];
          expectedResult = service.addBoitierPatientToCollectionIfMissing(boitierPatientCollection, boitierPatient);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a BoitierPatient to an array that doesn't contain it", () => {
          const boitierPatient: IBoitierPatient = { id: 123 };
          const boitierPatientCollection: IBoitierPatient[] = [{ id: 456 }];
          expectedResult = service.addBoitierPatientToCollectionIfMissing(boitierPatientCollection, boitierPatient);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(boitierPatient);
        });

        it('should add only unique BoitierPatient to an array', () => {
          const boitierPatientArray: IBoitierPatient[] = [{ id: 123 }, { id: 456 }, { id: 83187 }];
          const boitierPatientCollection: IBoitierPatient[] = [{ id: 123 }];
          expectedResult = service.addBoitierPatientToCollectionIfMissing(boitierPatientCollection, ...boitierPatientArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const boitierPatient: IBoitierPatient = { id: 123 };
          const boitierPatient2: IBoitierPatient = { id: 456 };
          expectedResult = service.addBoitierPatientToCollectionIfMissing([], boitierPatient, boitierPatient2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(boitierPatient);
          expect(expectedResult).toContain(boitierPatient2);
        });

        it('should accept null and undefined values', () => {
          const boitierPatient: IBoitierPatient = { id: 123 };
          expectedResult = service.addBoitierPatientToCollectionIfMissing([], null, boitierPatient, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(boitierPatient);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
