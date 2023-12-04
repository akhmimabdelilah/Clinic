jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { BoitierCapteurService } from '../service/boitier-capteur.service';
import { IBoitierCapteur, BoitierCapteur } from '../boitier-capteur.model';
import { IBoitier } from 'app/entities/boitier/boitier.model';
import { BoitierService } from 'app/entities/boitier/service/boitier.service';
import { ICapteur } from 'app/entities/capteur/capteur.model';
import { CapteurService } from 'app/entities/capteur/service/capteur.service';

import { BoitierCapteurUpdateComponent } from './boitier-capteur-update.component';

describe('Component Tests', () => {
  describe('BoitierCapteur Management Update Component', () => {
    let comp: BoitierCapteurUpdateComponent;
    let fixture: ComponentFixture<BoitierCapteurUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let boitierCapteurService: BoitierCapteurService;
    let boitierService: BoitierService;
    let capteurService: CapteurService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BoitierCapteurUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(BoitierCapteurUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BoitierCapteurUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      boitierCapteurService = TestBed.inject(BoitierCapteurService);
      boitierService = TestBed.inject(BoitierService);
      capteurService = TestBed.inject(CapteurService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Boitier query and add missing value', () => {
        const boitierCapteur: IBoitierCapteur = { id: 456 };
        const boitiers: IBoitier = { id: 53521 };
        boitierCapteur.boitiers = boitiers;

        const boitierCollection: IBoitier[] = [{ id: 62548 }];
        spyOn(boitierService, 'query').and.returnValue(of(new HttpResponse({ body: boitierCollection })));
        const additionalBoitiers = [boitiers];
        const expectedCollection: IBoitier[] = [...additionalBoitiers, ...boitierCollection];
        spyOn(boitierService, 'addBoitierToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ boitierCapteur });
        comp.ngOnInit();

        expect(boitierService.query).toHaveBeenCalled();
        expect(boitierService.addBoitierToCollectionIfMissing).toHaveBeenCalledWith(boitierCollection, ...additionalBoitiers);
        expect(comp.boitiersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Capteur query and add missing value', () => {
        const boitierCapteur: IBoitierCapteur = { id: 456 };
        const capteurs: ICapteur = { id: 71434 };
        boitierCapteur.capteurs = capteurs;

        const capteurCollection: ICapteur[] = [{ id: 7359 }];
        spyOn(capteurService, 'query').and.returnValue(of(new HttpResponse({ body: capteurCollection })));
        const additionalCapteurs = [capteurs];
        const expectedCollection: ICapteur[] = [...additionalCapteurs, ...capteurCollection];
        spyOn(capteurService, 'addCapteurToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ boitierCapteur });
        comp.ngOnInit();

        expect(capteurService.query).toHaveBeenCalled();
        expect(capteurService.addCapteurToCollectionIfMissing).toHaveBeenCalledWith(capteurCollection, ...additionalCapteurs);
        expect(comp.capteursSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const boitierCapteur: IBoitierCapteur = { id: 456 };
        const boitiers: IBoitier = { id: 2026 };
        boitierCapteur.boitiers = boitiers;
        const capteurs: ICapteur = { id: 14344 };
        boitierCapteur.capteurs = capteurs;

        activatedRoute.data = of({ boitierCapteur });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(boitierCapteur));
        expect(comp.boitiersSharedCollection).toContain(boitiers);
        expect(comp.capteursSharedCollection).toContain(capteurs);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const boitierCapteur = { id: 123 };
        spyOn(boitierCapteurService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ boitierCapteur });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: boitierCapteur }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(boitierCapteurService.update).toHaveBeenCalledWith(boitierCapteur);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const boitierCapteur = new BoitierCapteur();
        spyOn(boitierCapteurService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ boitierCapteur });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: boitierCapteur }));
        saveSubject.complete();

        // THEN
        expect(boitierCapteurService.create).toHaveBeenCalledWith(boitierCapteur);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const boitierCapteur = { id: 123 };
        spyOn(boitierCapteurService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ boitierCapteur });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(boitierCapteurService.update).toHaveBeenCalledWith(boitierCapteur);
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

      describe('trackCapteurById', () => {
        it('Should return tracked Capteur primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCapteurById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
