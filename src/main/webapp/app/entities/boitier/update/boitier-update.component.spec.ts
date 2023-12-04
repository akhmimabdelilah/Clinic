jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { BoitierService } from '../service/boitier.service';
import { IBoitier, Boitier } from '../boitier.model';

import { BoitierUpdateComponent } from './boitier-update.component';

describe('Component Tests', () => {
  describe('Boitier Management Update Component', () => {
    let comp: BoitierUpdateComponent;
    let fixture: ComponentFixture<BoitierUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let boitierService: BoitierService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BoitierUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(BoitierUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BoitierUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      boitierService = TestBed.inject(BoitierService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const boitier: IBoitier = { id: 456 };

        activatedRoute.data = of({ boitier });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(boitier));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const boitier = { id: 123 };
        spyOn(boitierService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ boitier });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: boitier }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(boitierService.update).toHaveBeenCalledWith(boitier);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const boitier = new Boitier();
        spyOn(boitierService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ boitier });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: boitier }));
        saveSubject.complete();

        // THEN
        expect(boitierService.create).toHaveBeenCalledWith(boitier);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const boitier = { id: 123 };
        spyOn(boitierService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ boitier });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(boitierService.update).toHaveBeenCalledWith(boitier);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
