import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MesureDetailComponent } from './mesure-detail.component';

describe('Component Tests', () => {
  describe('Mesure Management Detail Component', () => {
    let comp: MesureDetailComponent;
    let fixture: ComponentFixture<MesureDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [MesureDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ mesure: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(MesureDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MesureDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load mesure on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.mesure).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
