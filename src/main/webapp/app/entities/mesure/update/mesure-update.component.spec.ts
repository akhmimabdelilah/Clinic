jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { MesureService } from '../service/mesure.service';
import { IMesure, Mesure } from '../mesure.model';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';

import { MesureUpdateComponent } from './mesure-update.component';

describe('Component Tests', () => {
  describe('Mesure Management Update Component', () => {
    let comp: MesureUpdateComponent;
    let fixture: ComponentFixture<MesureUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let mesureService: MesureService;
    let patientService: PatientService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MesureUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(MesureUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MesureUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      mesureService = TestBed.inject(MesureService);
      patientService = TestBed.inject(PatientService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Patient query and add missing value', () => {
        const mesure: IMesure = { id: 456 };
        const patient: IPatient = { id: 5085 };
        mesure.patient = patient;

        const patientCollection: IPatient[] = [{ id: 32040 }];
        spyOn(patientService, 'query').and.returnValue(of(new HttpResponse({ body: patientCollection })));
        const additionalPatients = [patient];
        const expectedCollection: IPatient[] = [...additionalPatients, ...patientCollection];
        spyOn(patientService, 'addPatientToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ mesure });
        comp.ngOnInit();

        expect(patientService.query).toHaveBeenCalled();
        expect(patientService.addPatientToCollectionIfMissing).toHaveBeenCalledWith(patientCollection, ...additionalPatients);
        expect(comp.patientsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const mesure: IMesure = { id: 456 };
        const patient: IPatient = { id: 41648 };
        mesure.patient = patient;

        activatedRoute.data = of({ mesure });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(mesure));
        expect(comp.patientsSharedCollection).toContain(patient);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const mesure = { id: 123 };
        spyOn(mesureService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ mesure });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: mesure }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(mesureService.update).toHaveBeenCalledWith(mesure);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const mesure = new Mesure();
        spyOn(mesureService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ mesure });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: mesure }));
        saveSubject.complete();

        // THEN
        expect(mesureService.create).toHaveBeenCalledWith(mesure);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const mesure = { id: 123 };
        spyOn(mesureService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ mesure });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(mesureService.update).toHaveBeenCalledWith(mesure);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
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
