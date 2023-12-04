import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BoitierCapteurService } from '../service/boitier-capteur.service';

import { BoitierCapteurComponent } from './boitier-capteur.component';

describe('Component Tests', () => {
  describe('BoitierCapteur Management Component', () => {
    let comp: BoitierCapteurComponent;
    let fixture: ComponentFixture<BoitierCapteurComponent>;
    let service: BoitierCapteurService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BoitierCapteurComponent],
      })
        .overrideTemplate(BoitierCapteurComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BoitierCapteurComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(BoitierCapteurService);

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
      expect(comp.boitierCapteurs?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
