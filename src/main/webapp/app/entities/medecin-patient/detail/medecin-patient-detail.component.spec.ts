import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MedecinPatientDetailComponent } from './medecin-patient-detail.component';

describe('Component Tests', () => {
  describe('MedecinPatient Management Detail Component', () => {
    let comp: MedecinPatientDetailComponent;
    let fixture: ComponentFixture<MedecinPatientDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [MedecinPatientDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ medecinPatient: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(MedecinPatientDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MedecinPatientDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load medecinPatient on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.medecinPatient).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
