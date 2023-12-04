import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { MedecinPatientService } from '../service/medecin-patient.service';

import { MedecinPatientComponent } from './medecin-patient.component';

describe('Component Tests', () => {
  describe('MedecinPatient Management Component', () => {
    let comp: MedecinPatientComponent;
    let fixture: ComponentFixture<MedecinPatientComponent>;
    let service: MedecinPatientService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MedecinPatientComponent],
      })
        .overrideTemplate(MedecinPatientComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MedecinPatientComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(MedecinPatientService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.medecinPatients?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
