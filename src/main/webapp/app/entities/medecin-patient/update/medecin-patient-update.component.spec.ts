jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { MedecinPatientService } from '../service/medecin-patient.service';
import { IMedecinPatient, MedecinPatient } from '../medecin-patient.model';
import { IMedecin } from 'app/entities/medecin/medecin.model';
import { MedecinService } from 'app/entities/medecin/service/medecin.service';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';

import { MedecinPatientUpdateComponent } from './medecin-patient-update.component';

describe('Component Tests', () => {
  describe('MedecinPatient Management Update Component', () => {
    let comp: MedecinPatientUpdateComponent;
    let fixture: ComponentFixture<MedecinPatientUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let medecinPatientService: MedecinPatientService;
    let medecinService: MedecinService;
    let patientService: PatientService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MedecinPatientUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(MedecinPatientUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MedecinPatientUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      medecinPatientService = TestBed.inject(MedecinPatientService);
      medecinService = TestBed.inject(MedecinService);
      patientService = TestBed.inject(PatientService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Medecin query and add missing value', () => {
        const medecinPatient: IMedecinPatient = { id: 456 };
        const medecins: IMedecin = { id: 64855 };
        medecinPatient.medecins = medecins;

        const medecinCollection: IMedecin[] = [{ id: 11422 }];
        spyOn(medecinService, 'query').and.returnValue(of(new HttpResponse({ body: medecinCollection })));
        const additionalMedecins = [medecins];
        const expectedCollection: IMedecin[] = [...additionalMedecins, ...medecinCollection];
        spyOn(medecinService, 'addMedecinToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ medecinPatient });
        comp.ngOnInit();

        expect(medecinService.query).toHaveBeenCalled();
        expect(medecinService.addMedecinToCollectionIfMissing).toHaveBeenCalledWith(medecinCollection, ...additionalMedecins);
        expect(comp.medecinsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Patient query and add missing value', () => {
        const medecinPatient: IMedecinPatient = { id: 456 };
        const patients: IPatient = { id: 68611 };
        medecinPatient.patients = patients;

        const patientCollection: IPatient[] = [{ id: 99540 }];
        spyOn(patientService, 'query').and.returnValue(of(new HttpResponse({ body: patientCollection })));
        const additionalPatients = [patients];
        const expectedCollection: IPatient[] = [...additionalPatients, ...patientCollection];
        spyOn(patientService, 'addPatientToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ medecinPatient });
        comp.ngOnInit();

        expect(patientService.query).toHaveBeenCalled();
        expect(patientService.addPatientToCollectionIfMissing).toHaveBeenCalledWith(patientCollection, ...additionalPatients);
        expect(comp.patientsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const medecinPatient: IMedecinPatient = { id: 456 };
        const medecins: IMedecin = { id: 81882 };
        medecinPatient.medecins = medecins;
        const patients: IPatient = { id: 47629 };
        medecinPatient.patients = patients;

        activatedRoute.data = of({ medecinPatient });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(medecinPatient));
        expect(comp.medecinsSharedCollection).toContain(medecins);
        expect(comp.patientsSharedCollection).toContain(patients);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const medecinPatient = { id: 123 };
        spyOn(medecinPatientService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ medecinPatient });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: medecinPatient }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(medecinPatientService.update).toHaveBeenCalledWith(medecinPatient);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const medecinPatient = new MedecinPatient();
        spyOn(medecinPatientService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ medecinPatient });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: medecinPatient }));
        saveSubject.complete();

        // THEN
        expect(medecinPatientService.create).toHaveBeenCalledWith(medecinPatient);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const medecinPatient = { id: 123 };
        spyOn(medecinPatientService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ medecinPatient });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(medecinPatientService.update).toHaveBeenCalledWith(medecinPatient);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackMedecinById', () => {
        it('Should return tracked Medecin primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackMedecinById(0, entity);
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
