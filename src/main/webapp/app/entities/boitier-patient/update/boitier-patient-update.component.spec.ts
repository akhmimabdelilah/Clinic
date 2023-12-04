jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { BoitierPatientService } from '../service/boitier-patient.service';
import { IBoitierPatient, BoitierPatient } from '../boitier-patient.model';
import { IBoitier } from 'app/entities/boitier/boitier.model';
import { BoitierService } from 'app/entities/boitier/service/boitier.service';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';

import { BoitierPatientUpdateComponent } from './boitier-patient-update.component';

describe('Component Tests', () => {
  describe('BoitierPatient Management Update Component', () => {
    let comp: BoitierPatientUpdateComponent;
    let fixture: ComponentFixture<BoitierPatientUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let boitierPatientService: BoitierPatientService;
    let boitierService: BoitierService;
    let patientService: PatientService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BoitierPatientUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(BoitierPatientUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BoitierPatientUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      boitierPatientService = TestBed.inject(BoitierPatientService);
      boitierService = TestBed.inject(BoitierService);
      patientService = TestBed.inject(PatientService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Boitier query and add missing value', () => {
        const boitierPatient: IBoitierPatient = { id: 456 };
        const boitiers: IBoitier = { id: 41320 };
        boitierPatient.boitiers = boitiers;

        const boitierCollection: IBoitier[] = [{ id: 6039 }];
        spyOn(boitierService, 'query').and.returnValue(of(new HttpResponse({ body: boitierCollection })));
        const additionalBoitiers = [boitiers];
        const expectedCollection: IBoitier[] = [...additionalBoitiers, ...boitierCollection];
        spyOn(boitierService, 'addBoitierToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ boitierPatient });
        comp.ngOnInit();

        expect(boitierService.query).toHaveBeenCalled();
        expect(boitierService.addBoitierToCollectionIfMissing).toHaveBeenCalledWith(boitierCollection, ...additionalBoitiers);
        expect(comp.boitiersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Patient query and add missing value', () => {
        const boitierPatient: IBoitierPatient = { id: 456 };
        const patients: IPatient = { id: 58003 };
        boitierPatient.patients = patients;

        const patientCollection: IPatient[] = [{ id: 50593 }];
        spyOn(patientService, 'query').and.returnValue(of(new HttpResponse({ body: patientCollection })));
        const additionalPatients = [patients];
        const expectedCollection: IPatient[] = [...additionalPatients, ...patientCollection];
        spyOn(patientService, 'addPatientToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ boitierPatient });
        comp.ngOnInit();

        expect(patientService.query).toHaveBeenCalled();
        expect(patientService.addPatientToCollectionIfMissing).toHaveBeenCalledWith(patientCollection, ...additionalPatients);
        expect(comp.patientsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const boitierPatient: IBoitierPatient = { id: 456 };
        const boitiers: IBoitier = { id: 51812 };
        boitierPatient.boitiers = boitiers;
        const patients: IPatient = { id: 92654 };
        boitierPatient.patients = patients;

        activatedRoute.data = of({ boitierPatient });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(boitierPatient));
        expect(comp.boitiersSharedCollection).toContain(boitiers);
        expect(comp.patientsSharedCollection).toContain(patients);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const boitierPatient = { id: 123 };
        spyOn(boitierPatientService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ boitierPatient });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: boitierPatient }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(boitierPatientService.update).toHaveBeenCalledWith(boitierPatient);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const boitierPatient = new BoitierPatient();
        spyOn(boitierPatientService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ boitierPatient });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: boitierPatient }));
        saveSubject.complete();

        // THEN
        expect(boitierPatientService.create).toHaveBeenCalledWith(boitierPatient);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const boitierPatient = { id: 123 };
        spyOn(boitierPatientService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ boitierPatient });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(boitierPatientService.update).toHaveBeenCalledWith(boitierPatient);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackBoitierById', () => {
        it('Should return tracked Boitier primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackBoitierById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackPatientById', () => {
        it('Should return tracked Patient primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPatientById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
