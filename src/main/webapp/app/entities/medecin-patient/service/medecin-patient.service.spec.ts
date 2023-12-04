import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IMedecinPatient, MedecinPatient } from '../medecin-patient.model';

import { MedecinPatientService } from './medecin-patient.service';

describe('Service Tests', () => {
  describe('MedecinPatient Service', () => {
    let service: MedecinPatientService;
    let httpMock: HttpTestingController;
    let elemDefault: IMedecinPatient;
    let expectedResult: IMedecinPatient | IMedecinPatient[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(MedecinPatientService);
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

      it('should create a MedecinPatient', () => {
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

        service.create(new MedecinPatient()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a MedecinPatient', () => {
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

      it('should partial update a MedecinPatient', () => {
        const patchObject = Object.assign(
          {
            dateDebut: currentDate.format(DATE_FORMAT),
            dateFin: currentDate.format(DATE_FORMAT),
          },
          new MedecinPatient()
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

      it('should return a list of MedecinPatient', () => {
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

      it('should delete a MedecinPatient', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addMedecinPatientToCollectionIfMissing', () => {
        it('should add a MedecinPatient to an empty array', () => {
          const medecinPatient: IMedecinPatient = { id: 123 };
          expectedResult = service.addMedecinPatientToCollectionIfMissing([], medecinPatient);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(medecinPatient);
        });

        it('should not add a MedecinPatient to an array that contains it', () => {
          const medecinPatient: IMedecinPatient = { id: 123 };
          const medecinPatientCollection: IMedecinPatient[] = [
            {
              ...medecinPatient,
            },
            { id: 456 },
          ];
          expectedResult = service.addMedecinPatientToCollectionIfMissing(medecinPatientCollection, medecinPatient);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a MedecinPatient to an array that doesn't contain it", () => {
          const medecinPatient: IMedecinPatient = { id: 123 };
          const medecinPatientCollection: IMedecinPatient[] = [{ id: 456 }];
          expectedResult = service.addMedecinPatientToCollectionIfMissing(medecinPatientCollection, medecinPatient);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(medecinPatient);
        });

        it('should add only unique MedecinPatient to an array', () => {
          const medecinPatientArray: IMedecinPatient[] = [{ id: 123 }, { id: 456 }, { id: 75353 }];
          const medecinPatientCollection: IMedecinPatient[] = [{ id: 123 }];
          expectedResult = service.addMedecinPatientToCollectionIfMissing(medecinPatientCollection, ...medecinPatientArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const medecinPatient: IMedecinPatient = { id: 123 };
          const medecinPatient2: IMedecinPatient = { id: 456 };
          expectedResult = service.addMedecinPatientToCollectionIfMissing([], medecinPatient, medecinPatient2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(medecinPatient);
          expect(expectedResult).toContain(medecinPatient2);
        });

        it('should accept null and undefined values', () => {
          const medecinPatient: IMedecinPatient = { id: 123 };
          expectedResult = service.addMedecinPatientToCollectionIfMissing([], null, medecinPatient, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(medecinPatient);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
