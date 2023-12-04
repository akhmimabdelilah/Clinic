jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CapteurService } from '../service/capteur.service';
import { ICapteur, Capteur } from '../capteur.model';

import { CapteurUpdateComponent } from './capteur-update.component';

describe('Component Tests', () => {
  describe('Capteur Management Update Component', () => {
    let comp: CapteurUpdateComponent;
    let fixture: ComponentFixture<CapteurUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let capteurService: CapteurService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CapteurUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CapteurUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CapteurUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      capteurService = TestBed.inject(CapteurService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const capteur: ICapteur = { id: 456 };

        activatedRoute.data = of({ capteur });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(capteur));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const capteur = { id: 123 };
        spyOn(capteurService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ capteur });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: capteur }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(capteurService.update).toHaveBeenCalledWith(capteur);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const capteur = new Capteur();
        spyOn(capteurService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ capteur });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: capteur }));
        saveSubject.complete();

        // THEN
        expect(capteurService.create).toHaveBeenCalledWith(capteur);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const capteur = { id: 123 };
        spyOn(capteurService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ capteur });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(capteurService.update).toHaveBeenCalledWith(capteur);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
