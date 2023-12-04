jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { VideoService } from '../service/video.service';
import { IVideo, Video } from '../video.model';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';

import { VideoUpdateComponent } from './video-update.component';

describe('Component Tests', () => {
  describe('Video Management Update Component', () => {
    let comp: VideoUpdateComponent;
    let fixture: ComponentFixture<VideoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let videoService: VideoService;
    let patientService: PatientService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [VideoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(VideoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(VideoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      videoService = TestBed.inject(VideoService);
      patientService = TestBed.inject(PatientService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Patient query and add missing value', () => {
        const video: IVideo = { id: 456 };
        const patients: IPatient = { id: 11308 };
        video.patients = patients;

        const patientCollection: IPatient[] = [{ id: 60107 }];
        spyOn(patientService, 'query').and.returnValue(of(new HttpResponse({ body: patientCollection })));
        const additionalPatients = [patients];
        const expectedCollection: IPatient[] = [...additionalPatients, ...patientCollection];
        spyOn(patientService, 'addPatientToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ video });
        comp.ngOnInit();

        expect(patientService.query).toHaveBeenCalled();
        expect(patientService.addPatientToCollectionIfMissing).toHaveBeenCalledWith(patientCollection, ...additionalPatients);
        expect(comp.patientsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const video: IVideo = { id: 456 };
        const patients: IPatient = { id: 95793 };
        video.patients = patients;

        activatedRoute.data = of({ video });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(video));
        expect(comp.patientsSharedCollection).toContain(patients);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const video = { id: 123 };
        spyOn(videoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ video });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: video }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(videoService.update).toHaveBeenCalledWith(video);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const video = new Video();
        spyOn(videoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ video });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: video }));
        saveSubject.complete();

        // THEN
        expect(videoService.create).toHaveBeenCalledWith(video);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const video = { id: 123 };
        spyOn(videoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ video });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(videoService.update).toHaveBeenCalledWith(video);
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
