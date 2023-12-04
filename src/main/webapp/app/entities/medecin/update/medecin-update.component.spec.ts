jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { MedecinService } from '../service/medecin.service';
import { IMedecin, Medecin } from '../medecin.model';
import { IExtraUser } from 'app/entities/extra-user/extra-user.model';
import { ExtraUserService } from 'app/entities/extra-user/service/extra-user.service';

import { MedecinUpdateComponent } from './medecin-update.component';

describe('Component Tests', () => {
  describe('Medecin Management Update Component', () => {
    let comp: MedecinUpdateComponent;
    let fixture: ComponentFixture<MedecinUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let medecinService: MedecinService;
    let extraUserService: ExtraUserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MedecinUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(MedecinUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MedecinUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      medecinService = TestBed.inject(MedecinService);
      extraUserService = TestBed.inject(ExtraUserService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call extraUserId query and add missing value', () => {
        const medecin: IMedecin = { id: 456 };
        const extraUserId: IExtraUser = { id: 98155 };
        medecin.extraUserId = extraUserId;

        const extraUserIdCollection: IExtraUser[] = [{ id: 29274 }];
        spyOn(extraUserService, 'query').and.returnValue(of(new HttpResponse({ body: extraUserIdCollection })));
        const expectedCollection: IExtraUser[] = [extraUserId, ...extraUserIdCollection];
        spyOn(extraUserService, 'addExtraUserToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ medecin });
        comp.ngOnInit();

        expect(extraUserService.query).toHaveBeenCalled();
        expect(extraUserService.addExtraUserToCollectionIfMissing).toHaveBeenCalledWith(extraUserIdCollection, extraUserId);
        expect(comp.extraUserIdsCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const medecin: IMedecin = { id: 456 };
        const extraUserId: IExtraUser = { id: 20015 };
        medecin.extraUserId = extraUserId;

        activatedRoute.data = of({ medecin });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(medecin));
        expect(comp.extraUserIdsCollection).toContain(extraUserId);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const medecin = { id: 123 };
        spyOn(medecinService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ medecin });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: medecin }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(medecinService.update).toHaveBeenCalledWith(medecin);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const medecin = new Medecin();
        spyOn(medecinService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ medecin });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: medecin }));
        saveSubject.complete();

        // THEN
        expect(medecinService.create).toHaveBeenCalledWith(medecin);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const medecin = { id: 123 };
        spyOn(medecinService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ medecin });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(medecinService.update).toHaveBeenCalledWith(medecin);
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
