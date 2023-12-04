import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BoitierCapteurDetailComponent } from './boitier-capteur-detail.component';

describe('Component Tests', () => {
  describe('BoitierCapteur Management Detail Component', () => {
    let comp: BoitierCapteurDetailComponent;
    let fixture: ComponentFixture<BoitierCapteurDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [BoitierCapteurDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ boitierCapteur: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(BoitierCapteurDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BoitierCapteurDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load boitierCapteur on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.boitierCapteur).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
