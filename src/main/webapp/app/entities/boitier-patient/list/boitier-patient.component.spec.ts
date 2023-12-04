import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BoitierPatientService } from '../service/boitier-patient.service';

import { BoitierPatientComponent } from './boitier-patient.component';

describe('Component Tests', () => {
  describe('BoitierPatient Management Component', () => {
    let comp: BoitierPatientComponent;
    let fixture: ComponentFixture<BoitierPatientComponent>;
    let service: BoitierPatientService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BoitierPatientComponent],
      })
        .overrideTemplate(BoitierPatientComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BoitierPatientComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(BoitierPatientService);

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
      expect(comp.boitierPatients?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
