import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BoitierPatientDetailComponent } from './boitier-patient-detail.component';

describe('Component Tests', () => {
  describe('BoitierPatient Management Detail Component', () => {
    let comp: BoitierPatientDetailComponent;
    let fixture: ComponentFixture<BoitierPatientDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [BoitierPatientDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ boitierPatient: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(BoitierPatientDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BoitierPatientDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load boitierPatient on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.boitierPatient).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
