import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { MedecinService } from '../service/medecin.service';

import { MedecinComponent } from './medecin.component';

describe('Component Tests', () => {
  describe('Medecin Management Component', () => {
    let comp: MedecinComponent;
    let fixture: ComponentFixture<MedecinComponent>;
    let service: MedecinService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MedecinComponent],
      })
        .overrideTemplate(MedecinComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MedecinComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(MedecinService);

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
      expect(comp.medecins?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
