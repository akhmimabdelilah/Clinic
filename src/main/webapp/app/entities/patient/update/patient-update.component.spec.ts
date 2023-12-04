jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PatientService } from '../service/patient.service';
import { IPatient, Patient } from '../patient.model';
import { IExtraUser } from 'app/entities/extra-user/extra-user.model';
import { ExtraUserService } from 'app/entities/extra-user/service/extra-user.service';

import { PatientUpdateComponent } from './patient-update.component';

describe('Component Tests', () => {
  describe('Patient Management Update Component', () => {
    let comp: PatientUpdateComponent;
    let fixture: ComponentFixture<PatientUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let patientService: PatientService;
    let extraUserService: ExtraUserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PatientUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PatientUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PatientUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      patientService = TestBed.inject(PatientService);
      extraUserService = TestBed.inject(ExtraUserService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call extraUserId query and add missing value', () => {
        const patient: IPatient = { id: 456 };
        const extraUserId: IExtraUser = { id: 10952 };
        patient.extraUserId = extraUserId;

        const extraUserIdCollection: IExtraUser[] = [{ id: 72356 }];
        spyOn(extraUserService, 'query').and.returnValue(of(new HttpResponse({ body: extraUserIdCollection })));
        const expectedCollection: IExtraUser[] = [extraUserId, ...extraUserIdCollection];
        spyOn(extraUserService, 'addExtraUserToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ patient });
        comp.ngOnInit();

        expect(extraUserService.query).toHaveBeenCalled();
        expect(extraUserService.addExtraUserToCollectionIfMissing).toHaveBeenCalledWith(extraUserIdCollection, extraUserId);
        expect(comp.extraUserIdsCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const patient: IPatient = { id: 456 };
        const extraUserId: IExtraUser = { id: 23599 };
        patient.extraUserId = extraUserId;

        activatedRoute.data = of({ patient });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(patient));
        expect(comp.extraUserIdsCollection).toContain(extraUserId);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const patient = { id: 123 };
        spyOn(patientService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ patient });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: patient }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(patientService.update).toHaveBeenCalledWith(patient);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const patient = new Patient();
        spyOn(patientService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ patient });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: patient }));
        saveSubject.complete();

        // THEN
        expect(patientService.create).toHaveBeenCalledWith(patient);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const patient = { id: 123 };
        spyOn(patientService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ patient });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(patientService.update).toHaveBeenCalledWith(patient);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackExtraUserById', () => {
        it('Should return tracked ExtraUser primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackExtraUserById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
